'use client'

import React, { useState } from 'react'
import { Building2, User, CreditCard, Save, KeyRound, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { mockCompany, mockUser } from '@/lib/mock-data'
import { Separator } from '@/components/ui/separator'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [companyForm, setCompanyForm] = useState({
    name: mockCompany.name,
    email: mockCompany.email,
    phone: mockCompany.phone,
    license_number: mockCompany.license_number ?? '',
    website: mockCompany.website ?? '',
  })

  const [profileForm, setProfileForm] = useState({
    name: mockUser.name,
    email: mockUser.email,
    password: '',
    confirm: '',
  })

  const [savingCompany, setSavingCompany] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)

  async function handleSaveCompany() {
    setSavingCompany(true)
    await new Promise((r) => setTimeout(r, 700))
    setSavingCompany(false)
    toast.success('Informations de l\'entreprise sauvegardées !')
  }

  async function handleSaveProfile() {
    if (profileForm.password && profileForm.password !== profileForm.confirm) {
      toast.error('Les mots de passe ne correspondent pas.')
      return
    }
    setSavingProfile(true)
    await new Promise((r) => setTimeout(r, 700))
    setSavingProfile(false)
    toast.success('Profil mis à jour avec succès !')
  }

  function handleManageSubscription() {
    toast('Redirection vers le portail de facturation...', { icon: '💳' })
    setTimeout(() => toast('Portail de facturation non disponible en mode démo.', { icon: 'ℹ️' }), 1200)
  }

  function handleCancelSubscription() {
    toast.error('Annulation disponible uniquement sur la version en production.')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-500 mt-1">Gérez votre compte et votre entreprise.</p>
      </div>

      {/* Company Settings */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
          <Building2 className="w-5 h-5 text-[#1B4FDE]" />
          <h2 className="font-semibold text-gray-900">Informations de l&apos;entreprise</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label>Nom de l&apos;entreprise</Label>
              <Input
                value={companyForm.name}
                onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Courriel</Label>
              <Input
                type="email"
                value={companyForm.email}
                onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Téléphone</Label>
              <Input
                value={companyForm.phone}
                onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Numéro RBQ</Label>
              <Input
                value={companyForm.license_number}
                onChange={(e) => setCompanyForm({ ...companyForm, license_number: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Site web</Label>
              <Input
                value={companyForm.website}
                onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleSaveCompany}
              disabled={savingCompany}
              className="bg-[#1B4FDE] hover:bg-[#1640C4] gap-2"
            >
              {savingCompany ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Sauvegarder
            </Button>
          </div>
        </div>
      </div>

      {/* User Settings */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
          <User className="w-5 h-5 text-[#1B4FDE]" />
          <h2 className="font-semibold text-gray-900">Profil personnel</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label>Nom complet</Label>
              <Input
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Courriel</Label>
              <Input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              />
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <KeyRound className="w-4 h-4" />
            Changer le mot de passe (optionnel)
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Nouveau mot de passe</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={profileForm.password}
                onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Confirmer le mot de passe</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={profileForm.confirm}
                onChange={(e) => setProfileForm({ ...profileForm, confirm: e.target.value })}
                className={
                  profileForm.confirm && profileForm.password !== profileForm.confirm
                    ? 'border-red-300'
                    : ''
                }
              />
              {profileForm.confirm && profileForm.password === profileForm.confirm && profileForm.password && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Les mots de passe correspondent
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleSaveProfile}
              disabled={savingProfile}
              className="bg-[#1B4FDE] hover:bg-[#1640C4] gap-2"
            >
              {savingProfile ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Mettre à jour
            </Button>
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-[#1B4FDE]" />
          <h2 className="font-semibold text-gray-900">Abonnement</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Plan Professionnel</p>
              <p className="text-sm text-gray-500 mt-0.5">
                99 $/mois · Renouvellement le 1er janvier 2026
              </p>
            </div>
            <span className="bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-200">
              Actif
            </span>
          </div>
          <Separator className="my-4" />
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={handleManageSubscription}>
              Gérer l&apos;abonnement
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:bg-red-50 hover:border-red-200"
              onClick={handleCancelSubscription}
            >
              Annuler l&apos;abonnement
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
