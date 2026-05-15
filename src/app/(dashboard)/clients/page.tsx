'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ClientCard from '@/components/dashboard/ClientCard'
import { mockClients } from '@/lib/mock-data'

export default function ClientsPage() {
  const [search, setSearch] = useState('')

  const filteredClients = mockClients.filter((c) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.phone.includes(q)
    )
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 mt-1">
            {mockClients.length} client{mockClients.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        <Link href="/clients/new">
          <Button className="gap-2 bg-[#1B4FDE] hover:bg-[#1640C4]">
            <Plus className="w-4 h-4" />
            Nouveau client
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Rechercher par nom, courriel ou ville..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Clients Grid */}
      {filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">
            Aucun client trouvé
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            {search
              ? 'Aucun client ne correspond à votre recherche.'
              : 'Ajoutez votre premier client pour commencer.'}
          </p>
          {!search && (
            <Link href="/clients/new">
              <Button className="bg-[#1B4FDE] hover:bg-[#1640C4]">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un client
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
