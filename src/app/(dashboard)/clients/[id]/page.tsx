'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { notFound, useParams } from 'next/navigation'
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  FolderOpen,
  Plus,
  Edit2,
  Save,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import StatusBadge from '@/components/dashboard/StatusBadge'
import { getClientById, getProjectsByClientId } from '@/lib/mock-data'
import { formatDate, getInitials } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function ClientDetailPage() {
  const params = useParams()
  const clientId = Array.isArray(params.id) ? params.id[0] : (params.id ?? '')
  const client = getClientById(clientId)
  const projects = getProjectsByClientId(clientId)

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: client?.name ?? '',
    email: client?.email ?? '',
    phone: client?.phone ?? '',
    address: client?.address ?? '',
    notes: client?.notes ?? '',
  })

  if (!client) notFound()

  async function handleSave() {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 700))
    setSaving(false)
    setEditing(false)
    toast.success('Client mis à jour avec succès !')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/clients">
          <Button variant="ghost" size="icon-sm" className="rounded-lg mt-1">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#1B4FDE] rounded-xl flex items-center justify-center text-white font-bold text-lg">
              {getInitials(client.name)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
              <p className="text-sm text-gray-500">{client.city}, {client.province}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <Button variant="outline" size="sm" onClick={() => setEditing(false)} className="gap-1.5">
                <X className="w-4 h-4" />
                Annuler
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving} className="bg-[#1B4FDE] hover:bg-[#1640C4] gap-1.5">
                {saving ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Sauvegarder
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="gap-1.5">
              <Edit2 className="w-4 h-4" />
              Modifier
            </Button>
          )}
          <Link href={`/projects/new?client=${client.id}`}>
            <Button size="sm" className="bg-[#1B4FDE] hover:bg-[#1640C4] gap-1.5">
              <Plus className="w-4 h-4" />
              Nouveau projet
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Client Info */}
        <div className="md:col-span-2 bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Coordonnées</h2>

          {editing ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Nom complet</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Courriel</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Téléphone</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Adresse</Label>
                <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Notes internes</Label>
                <textarea
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1B4FDE]/30"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <a href={`mailto:${client.email}`} className="text-[#1B4FDE] hover:underline">
                  {client.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <a href={`tel:${client.phone}`} className="text-gray-700 hover:text-gray-900">
                  {client.phone}
                </a>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  {client.address}, {client.city}, {client.province} {client.postal_code}
                </span>
              </div>
              {client.notes && (
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <p className="text-xs text-gray-500 uppercase font-medium tracking-wide mb-1">Notes</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{client.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
            <p className="text-3xl font-bold text-[#1B4FDE]">{projects.length}</p>
            <p className="text-sm text-gray-500 mt-1">Projets</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
            <p className="text-3xl font-bold text-green-600">
              {projects.filter((p) => p.status === 'completed').length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Complétés</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
            <p className="text-sm font-medium text-gray-700">Depuis</p>
            <p className="text-sm text-gray-500 mt-1">{formatDate(client.created_at)}</p>
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-[#1B4FDE]" />
            <h2 className="font-semibold text-gray-900">Projets ({projects.length})</h2>
          </div>
          <Link href={`/projects/new?client=${client.id}`}>
            <Button size="sm" variant="outline" className="gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Ajouter
            </Button>
          </Link>
        </div>

        {projects.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <div className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{project.name}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {project.address}, {project.city}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <p className="text-xs text-gray-400">{formatDate(project.updated_at)}</p>
                    <StatusBadge status={project.status} size="sm" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-gray-500">Aucun projet pour ce client.</p>
            <Link href={`/projects/new?client=${client.id}`}>
              <Button size="sm" className="mt-3 bg-[#1B4FDE] hover:bg-[#1640C4] gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                Créer un projet
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
