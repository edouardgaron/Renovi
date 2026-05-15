'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, UserPlus, Check, Building2, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'

const registerSchema = z
  .object({
    account_type: z.enum(['company', 'client']),
    full_name: z.string().min(2, 'Nom requis (min. 2 caractères)'),
    company_name: z.string().optional(),
    email: z.string().email('Adresse courriel invalide'),
    phone: z.string().min(10, 'Numéro de téléphone invalide'),
    password: z.string().min(8, 'Minimum 8 caractères'),
    confirm_password: z.string(),
    accept_terms: z.literal(true, {
      errorMap: () => ({ message: 'Vous devez accepter les conditions' }),
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirm_password'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [accountType, setAccountType] = useState<'company' | 'client'>('company')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { account_type: 'company' },
  })

  function selectAccountType(type: 'company' | 'client') {
    setAccountType(type)
    setValue('account_type', type)
  }

  async function onSubmit(data: RegisterFormData) {
    try {
      await new Promise((r) => setTimeout(r, 1000))
      document.cookie = 'renovi_session=mock_session; path=/; max-age=86400'
      toast.success('Compte créé avec succès! Bienvenue sur Renovi.')
      router.push('/dashboard')
    } catch {
      toast.error('Erreur lors de la création du compte.')
    }
  }

  return (
    <div className="w-full max-w-lg">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-panel p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Créer votre compte</h1>
          <p className="text-sm text-gray-500 mt-1.5">
            Commencez gratuitement, sans carte de crédit
          </p>
        </div>

        {/* Account type selector */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Type de compte</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => selectAccountType('company')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                accountType === 'company'
                  ? 'border-[#1B4FDE] bg-[#EFF4FF] text-[#1B4FDE]'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <Building2 className="w-6 h-6" />
              <div className="text-center">
                <p className="text-sm font-medium">Entrepreneur</p>
                <p className="text-xs opacity-70">Gérez vos projets</p>
              </div>
              {accountType === 'company' && (
                <div className="absolute top-2 right-2">
                  <Check className="w-4 h-4 text-[#1B4FDE]" />
                </div>
              )}
            </button>
            <button
              type="button"
              onClick={() => selectAccountType('client')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                accountType === 'client'
                  ? 'border-[#1B4FDE] bg-[#EFF4FF] text-[#1B4FDE]'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <User className="w-6 h-6" />
              <div className="text-center">
                <p className="text-sm font-medium">Client</p>
                <p className="text-xs opacity-70">Suivez votre projet</p>
              </div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('account_type')} />

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="full_name">Nom complet</Label>
              <Input
                id="full_name"
                placeholder="Marc Beaumont"
                {...register('full_name')}
                className={errors.full_name ? 'border-red-300' : ''}
              />
              {errors.full_name && (
                <p className="text-xs text-red-600">{errors.full_name.message}</p>
              )}
            </div>

            {accountType === 'company' && (
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="company_name">Nom de l&apos;entreprise</Label>
                <Input
                  id="company_name"
                  placeholder="Rénovations Beaumont Inc."
                  {...register('company_name')}
                />
              </div>
            )}

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="email">Courriel</Label>
              <Input
                id="email"
                type="email"
                placeholder="vous@example.com"
                {...register('email')}
                className={errors.email ? 'border-red-300' : ''}
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="col-span-2 space-y-1.5">
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

            <div className="space-y-1.5">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className={`pr-10 ${errors.password ? 'border-red-300' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm_password">Confirmer</Label>
              <Input
                id="confirm_password"
                type="password"
                placeholder="••••••••"
                {...register('confirm_password')}
                className={errors.confirm_password ? 'border-red-300' : ''}
              />
              {errors.confirm_password && (
                <p className="text-xs text-red-600">{errors.confirm_password.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-2.5 pt-1">
            <input
              type="checkbox"
              id="accept_terms"
              {...register('accept_terms')}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#1B4FDE] focus:ring-[#1B4FDE]"
            />
            <label htmlFor="accept_terms" className="text-xs text-gray-600 leading-relaxed">
              J&apos;accepte les{' '}
              <Link href="#" className="text-[#1B4FDE] hover:underline">
                conditions d&apos;utilisation
              </Link>{' '}
              et la{' '}
              <Link href="#" className="text-[#1B4FDE] hover:underline">
                politique de confidentialité
              </Link>
            </label>
          </div>
          {errors.accept_terms && (
            <p className="text-xs text-red-600">{errors.accept_terms.message}</p>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full bg-[#1B4FDE] hover:bg-[#1640C4] mt-2"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Création du compte...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Créer mon compte
              </span>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Déjà un compte?{' '}
          <Link href="/login" className="text-[#1B4FDE] font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
