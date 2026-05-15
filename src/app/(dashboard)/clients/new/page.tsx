'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, UserPlus } from 'lucide-react'
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
import { PROVINCES_CA } from '@/lib/constants'
import toast from 'react-hot-toast'

const clientSchema = z.object({
  name: z.string().min(2, 'Nom requis (min. 2 caractères)'),
  email: z.string().email('Adresse courriel invalide'),
  phone: z.string().min(10, 'Numéro de téléphone invalide'),
  address: z.string().min(5, 'Adresse requise'),
  city: z.string().min(2, 'Ville requise'),
  province: z.string().min(2, 'Province requise'),
  postal_code: z.string().min(6, 'Code postal requis'),
  notes: z.string().optional(),
})

type ClientFormData = z.infer<typeof clientSchema>

export default function NewClientPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: { province: 'QC' },
  })

  async function onSubmit(data: ClientFormData) {
    try {
      await new Promise((r) => setTimeout(r, 600))
      toast.success('Client ajouté avec succès!')
      router.push('/clients')
    } catch {
      toast.error('Erreur lors de l\'ajout du client.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/clients">
          <Button variant="ghost" size="icon-sm" className="rounded-lg">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nouveau client</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Ajoutez un client à votre carnet d&apos;adresses.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal info */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
          <h2 className="font-semibold text-gray-900">Informations personnelles</h2>

          <div className="space-y-1.5">
            <Label htmlFor="name">Nom complet</Label>
            <Input
              id="name"
              placeholder="Sophie Tremblay"
              {...register('name')}
              className={errors.name ? 'border-red-300' : ''}
            />
            {errors.name && (
              <p className="text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Courriel</Label>
              <Input
                id="email"
                type="email"
                placeholder="client@example.com"
                {...register('email')}
                className={errors.email ? 'border-red-300' : ''}
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="418-555-0192"
                {...register('phone')}
                className={errors.phone ? 'border-red-300' : ''}
              />
              {errors.phone && (
                <p className="text-xs text-red-600">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
          <h2 className="font-semibold text-gray-900">Adresse</h2>

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
                placeholder="Québec"
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
          <h2 className="font-semibold text-gray-900">Notes</h2>
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes internes (optionnel)</Label>
            <Textarea
              id="notes"
              placeholder="Informations importantes sur ce client, préférences, historique..."
              rows={3}
              {...register('notes')}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/clients">
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
                Ajout...
              </span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Ajouter le client
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
