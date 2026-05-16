import { NextResponse } from 'next/server'

const HOUSE_IMAGES = [
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
  'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
]

interface MockAddress {
  address: string
  city: string
  province: string
  postal: string
}

const MOCK_ADDRESSES: MockAddress[] = [
  { address: '245 rue des Érables', city: 'Québec', province: 'QC', postal: 'G1K 3P4' },
  { address: '1842 boulevard Laurier', city: 'Sainte-Foy', province: 'QC', postal: 'G1V 2L3' },
  { address: '789 rue Saint-Jean', city: 'Québec', province: 'QC', postal: 'G1R 1P7' },
  { address: '456 avenue des Pins', city: 'Montréal', province: 'QC', postal: 'H2W 1P6' },
  { address: '1200 rue Sherbrooke', city: 'Montréal', province: 'QC', postal: 'H3A 1G2' },
  { address: '34 rue du Moulin', city: 'Lévis', province: 'QC', postal: 'G6V 5H3' },
  { address: '567 chemin des Patriotes', city: 'Longueuil', province: 'QC', postal: 'J4H 2A1' },
  { address: '23 rue des Lilas', city: 'Laval', province: 'QC', postal: 'H7N 2K3' },
  { address: '890 boulevard du Lac', city: 'Saguenay', province: 'QC', postal: 'G7H 4B2' },
  { address: '12 avenue de la Cathédrale', city: 'Trois-Rivières', province: 'QC', postal: 'G9A 3M1' },
]

// Mock lat/lng centers per city
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  Québec: { lat: 46.8139, lng: -71.2082 },
  'Sainte-Foy': { lat: 46.7743, lng: -71.2755 },
  Montréal: { lat: 45.5017, lng: -73.5673 },
  Lévis: { lat: 46.8018, lng: -71.1764 },
  Longueuil: { lat: 45.5315, lng: -73.5181 },
  Laval: { lat: 45.6066, lng: -73.7124 },
  Saguenay: { lat: 48.4279, lng: -71.0596 },
  'Trois-Rivières': { lat: 46.3432, lng: -72.5409 },
  Charlesbourg: { lat: 46.8760, lng: -71.2668 },
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') ?? ''

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ results: [] })
  }

  const q = query.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

  const filtered = MOCK_ADDRESSES.filter((a) => {
    const searchable = `${a.address} ${a.city} ${a.province} ${a.postal}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
    return searchable.includes(q)
  })

  const results = filtered.slice(0, 5).map((a) => {
    const hash = hashString(`${a.address}${a.city}`)
    const imageIndex = hash % HOUSE_IMAGES.length
    const coords = CITY_COORDS[a.city] ?? { lat: 46.8, lng: -71.2 }
    const latOffset = ((hash % 100) - 50) * 0.001
    const lngOffset = (((hash >> 4) % 100) - 50) * 0.001

    return {
      address: a.address,
      city: a.city,
      province: a.province,
      postal: a.postal,
      lat: coords.lat + latOffset,
      lng: coords.lng + lngOffset,
      previewImage: HOUSE_IMAGES[imageIndex],
      fullAddress: `${a.address}, ${a.city}, ${a.province} ${a.postal}`,
    }
  })

  // Add a small simulated delay to mimic a real API call
  await new Promise((r) => setTimeout(r, 120))

  return NextResponse.json({ results })
}
