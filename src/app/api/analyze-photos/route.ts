import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'
import type { ProjectMeasurements } from '@/types'

const ANALYSIS_PROMPT = `
Tu es un expert en estimation de surfaces pour la rénovation extérieure résidentielle au Québec.
Analyse ces photos d'une maison et extrais les informations suivantes en JSON:

{
  "facade_width": number (largeur façade en pieds, estimée),
  "building_height": number (hauteur du bâtiment en pieds, estimée),
  "wall_surface": number (surface totale des murs en pi², estimée),
  "roof_surface": number (surface de toiture en pi², estimée),
  "window_count": number (nombre de fenêtres visibles),
  "door_count": number (nombre de portes visibles),
  "perimeter": number (périmètre estimé en pieds),
  "confidence_level": "high" | "medium" | "low",
  "building_stories": number (nombre d'étages),
  "has_garage": boolean,
  "has_dormer": boolean,
  "roof_style": "gable" | "hip" | "mansard" | "flat" | "gambrel",
  "detected_features": string[] (liste des caractéristiques notables),
  "notes": string (commentaires et avertissements sur les estimations)
}

Utilise des estimations réalistes pour des maisons québécoises typiques.
Si une valeur ne peut pas être estimée avec confiance, utilise null.
Réponds UNIQUEMENT avec le JSON, sans texte supplémentaire.
`

interface AnalyzeRequestBody {
  images: string[]
  projectName?: string
  address?: string
}

interface ClaudeAnalysisResult {
  facade_width: number | null
  building_height: number | null
  wall_surface: number | null
  roof_surface: number | null
  window_count: number | null
  door_count: number | null
  perimeter: number | null
  confidence_level: 'high' | 'medium' | 'low' | null
  building_stories: number | null
  has_garage: boolean | null
  has_dormer: boolean | null
  roof_style: 'gable' | 'hip' | 'mansard' | 'flat' | 'gambrel' | null
  detected_features: string[] | null
  notes: string | null
}

function getMockMeasurements(): ClaudeAnalysisResult {
  return {
    facade_width: 38,
    building_height: 22,
    wall_surface: 1842,
    roof_surface: 1340,
    window_count: 9,
    door_count: 2,
    perimeter: 128,
    confidence_level: 'medium',
    building_stories: 2,
    has_garage: true,
    has_dormer: false,
    roof_style: 'gable',
    detected_features: [
      'Revêtement en vinyle',
      'Fenêtres à double vitrage',
      'Porte en acier',
      'Gouttières en aluminium',
      'Balcon avant',
      'Garage simple attaché',
    ],
    notes:
      'Estimations basées sur des dimensions typiques de maisons unifamiliales québécoises. À valider sur le terrain avec des mesures précises. (Mode démonstration — aucune clé API configurée)',
  }
}

function isValidBase64Image(str: string): boolean {
  return str.startsWith('data:image/') && str.includes(';base64,')
}

function isValidUrl(str: string): boolean {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyzeRequestBody
    const { images, projectName, address } = body

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'Au moins une image est requise.' },
        { status: 400 }
      )
    }

    const apiKey = process.env.ANTHROPIC_API_KEY

    // Return mock data if no API key configured
    if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
      const mock = getMockMeasurements()
      const measurements: ProjectMeasurements = {
        facade_width: mock.facade_width,
        building_height: mock.building_height,
        wall_surface: mock.wall_surface,
        roof_surface: mock.roof_surface,
        window_count: mock.window_count,
        door_count: mock.door_count,
        perimeter: mock.perimeter,
        confidence_level: mock.confidence_level,
        notes: mock.notes,
        building_stories: mock.building_stories ?? undefined,
        has_garage: mock.has_garage ?? undefined,
        has_dormer: mock.has_dormer ?? undefined,
        roof_style: mock.roof_style ?? undefined,
        detected_features: mock.detected_features ?? undefined,
      }
      return NextResponse.json({
        measurements,
        detectedFeatures: mock.detected_features ?? [],
        raw: JSON.stringify(mock, null, 2),
        mock: true,
      })
    }

    const client = new Anthropic({ apiKey })

    // Limit to 4 images
    const selectedImages = images.slice(0, 4)

    type ContentBlock =
      | {
          type: 'image'
          source:
            | { type: 'base64'; media_type: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'; data: string }
            | { type: 'url'; url: string }
        }
      | { type: 'text'; text: string }

    const imageContent: ContentBlock[] = []

    for (const img of selectedImages) {
      if (isValidBase64Image(img)) {
        const [mimeWithPrefix, data] = img.split(';base64,')
        const mimeType = mimeWithPrefix.replace('data:', '') as
          | 'image/jpeg'
          | 'image/png'
          | 'image/gif'
          | 'image/webp'
        imageContent.push({
          type: 'image',
          source: {
            type: 'base64',
            media_type: mimeType,
            data,
          },
        })
      } else if (isValidUrl(img)) {
        imageContent.push({
          type: 'image',
          source: {
            type: 'url',
            url: img,
          },
        })
      }
    }

    if (imageContent.length === 0) {
      return NextResponse.json(
        { error: 'Aucune image valide fournie. Utilisez des URLs ou des images base64.' },
        { status: 400 }
      )
    }

    const contextText =
      projectName || address
        ? `Projet: ${projectName ?? 'Sans nom'}${address ? `. Adresse: ${address}` : ''}\n\n`
        : ''

    imageContent.push({
      type: 'text',
      text: contextText + ANALYSIS_PROMPT,
    })

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: imageContent,
        },
      ],
    })

    const rawText =
      response.content[0].type === 'text' ? response.content[0].text : ''

    // Parse the JSON response
    let parsed: ClaudeAnalysisResult
    try {
      // Strip any markdown code blocks if present
      const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      parsed = JSON.parse(cleaned) as ClaudeAnalysisResult
    } catch {
      return NextResponse.json(
        { error: 'Impossible de parser la réponse de Claude. Réessayez.', raw: rawText },
        { status: 422 }
      )
    }

    const measurements: ProjectMeasurements = {
      facade_width: parsed.facade_width ?? null,
      building_height: parsed.building_height ?? null,
      wall_surface: parsed.wall_surface ?? null,
      roof_surface: parsed.roof_surface ?? null,
      window_count: parsed.window_count ?? null,
      door_count: parsed.door_count ?? null,
      perimeter: parsed.perimeter ?? null,
      confidence_level: parsed.confidence_level ?? null,
      notes: parsed.notes ?? null,
      building_stories: parsed.building_stories ?? undefined,
      has_garage: parsed.has_garage ?? undefined,
      has_dormer: parsed.has_dormer ?? undefined,
      roof_style: parsed.roof_style ?? undefined,
      detected_features: parsed.detected_features ?? undefined,
    }

    return NextResponse.json({
      measurements,
      detectedFeatures: parsed.detected_features ?? [],
      raw: rawText,
      mock: false,
    })
  } catch (err) {
    console.error('[analyze-photos] Error:', err)
    const message = err instanceof Error ? err.message : 'Erreur interne du serveur.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
