'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, LogIn, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'
import { findAccount, setSession, MOCK_ACCOUNTS } from '@/lib/mock-auth'

const loginSchema = z.object({
  email: z.string().email('Adresse courriel invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})

type LoginFormData = z.infer<typeof loginSchema>

const colorMap: Record<string, string> = {
  purple: 'bg-purple-100 text-purple-700 border-purple-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  green: 'bg-green-100 text-green-700 border-green-200',
  orange: 'bg-orange-100 text-orange-700 border-orange-200',
}

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormData) {
    await new Promise((r) => setTimeout(r, 600))

    const account = findAccount(data.email, data.password)
    if (!account) {
      toast.error('Courriel ou mot de passe incorrect.')
      return
    }

    setSession(account.user)
    toast.success(`Bienvenue, ${account.user.name} !`)
    router.push(account.redirectTo)
  }

  function quickLogin(email: string, password: string) {
    setValue('email', email)
    setValue('password', password)
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-panel p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Connexion à Renovi</h1>
          <p className="text-sm text-gray-500 mt-1.5">Accédez à votre tableau de bord</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="email">Courriel</Label>
            <Input
              id="email"
              type="email"
              placeholder="vous@example.com"
              autoComplete="email"
              {...register('email')}
              className={errors.email ? 'border-red-300 focus-visible:ring-red-400' : ''}
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
              <Link href="/forgot-password" className="text-xs text-[#1B4FDE] hover:underline">
                Mot de passe oublié?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                {...register('password')}
                className={`pr-10 ${errors.password ? 'border-red-300 focus-visible:ring-red-400' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full bg-[#1B4FDE] hover:bg-[#1640C4]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connexion...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Se connecter
              </span>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Pas encore de compte?{' '}
          <Link href="/register" className="text-[#1B4FDE] font-medium hover:underline">
            Créer un compte gratuitement
          </Link>
        </p>
      </div>

      {/* Demo accounts */}
      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-amber-500" />
          <p className="text-sm font-semibold text-gray-700">Comptes de démonstration</p>
        </div>
        <div className="space-y-2">
          {MOCK_ACCOUNTS.map((account) => (
            <button
              key={account.email}
              type="button"
              onClick={() => quickLogin(account.email, account.password)}
              className="w-full flex items-center justify-between p-2.5 rounded-lg border bg-white hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${colorMap[account.color]}`}>
                  {account.label}
                </span>
                <span className="text-xs text-gray-600">{account.email}</span>
              </div>
              <span className="text-xs text-gray-400 font-mono">{account.password}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">
          Cliquez sur un compte pour remplir automatiquement les champs
        </p>
      </div>
    </div>
  )
}
