'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { mockClients } from '@/lib/mock-data'
import { PROVINCES_CA } from '@/lib/constants'
import toast from 'react-hot-toast'

const projectSchema = z.object({
  name: z.string().min(2, 'Nom requis'),
  client_id: z.string().min(1, 'Sélectionnez un client'),
  address: z.string().min(5, 'Adresse requise'),
  city: z.string().min(2, 'Ville requise'),
  province: z.string().min(2, 'Province requise'),
  postal_code: z.string().min(6, 'Code postal requis'),
  building_type: z.enum(['residential', 'commercial', 'condo', 'cottage']),
  notes: z.string().optional(),
})

type ProjectFormData = z.infer<typeof projectSchema>

export default function NewProjectPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      building_type: 'residential',
      province: 'QC',
    },
  })

  const selectedClientId = watch('client_id')

  // Auto-fill address when client is selected
  function handleClientSelect(clientId: string) {
    setValue('client_id', clientId)
    const client = mockClients.find((c) => c.id === clientId)
    if (client) {
      setValue('address', client.address)
      setValue('city', client.city)
      setValue('province', client.province)
      setValue('postal_code', client.postal_code)
    }
  }

  async function onSubmit(data: ProjectFormData) {
    try {
      await new Promise((r) => setTimeout(r, 600))
      toast.success('Projet créé avec succès!')
      router.push('/projects')
    } catch {
      toast.error('Erreur lors de la création du projet.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/projects">
          <Button variant="ghost" size="icon-sm" className="rounded-lg">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nouveau projet</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Créez un projet pour commencer à travailler avec un client.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic info */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
          <h2 className="font-semibold text-gray-900">Informations de base</h2>

          <div className="space-y-1.5">
            <Label htmlFor="name">Nom du projet</Label>
            <Input
              id="name"
              placeholder="Ex: Rénovation extérieure - Tremblay"
              {...register('name')}
              className={errors.name ? 'border-red-300' : ''}
            />
            {errors.name && (
              <p className="text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="client">Client</Label>
            <Select onValueChange={handleClientSelect}>
              <SelectTrigger className={errors.client_id ? 'border-red-300' : ''}>
                <SelectValue placeholder="Sélectionnez un client..." />
              </SelectTrigger>
              <SelectContent>
                {mockClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name} — {client.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.client_id && (
              <p className="text-xs text-red-600">{errors.client_id.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Pas encore ce client?{' '}
              <Link href="/clients/new" className="text-[#1B4FDE] hover:underline">
                Créer un nouveau client
              </Link>
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="building_type">Type de bâtiment</Label>
            <Select
              defaultValue="residential"
              onValueChange={(v) => setValue('building_type', v as 'residential' | 'commercial' | 'condo' | 'cottage')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Résidentiel</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="cottage">Chalet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
          <h2 className="font-semibold text-gray-900">Adresse de la propriété</h2>

          <div className="space-y-1.5">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              placeholder="1842 boulevard Laurier"
              {...register('address')}
              className={errors.address ? 'border-red-300' : ''}
            />
            {errors.address && (
              <p className="text-xs text-red-600">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                placeholder="Sainte-Foy"
                {...register('city')}
                className={errors.city ? 'border-red-300' : ''}
              />
              {errors.city && (
                <p className="text-xs text-red-600">{errors.city.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Province</Label>
              <Select
                defaultValue="QC"
                onValueChange={(v) => setValue('province', v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROVINCES_CA.map((p) => (
                    <SelectItem key={p.code} value={p.code}>
                      {p.code} — {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="w-1/2 space-y-1.5">
            <Label htmlFor="postal_code">Code postal</Label>
            <Input
              id="postal_code"
              placeholder="G1V 2L3"
              {...register('postal_code')}
              className={errors.postal_code ? 'border-red-300' : ''}
            />
            {errors.postal_code && (
              <p className="text-xs text-red-600">{errors.postal_code.message}</p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Notes internes</h2>
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              placeholder="Informations supplémentaires sur le projet, préférences du client, contraintes particulières..."
              rows={4}
              {...register('notes')}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/projects">
            <Button type="button" variant="outline">
              Annuler
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#1B4FDE] hover:bg-[#1640C4] gap-2"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Création...
              </span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Créer le projet
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
