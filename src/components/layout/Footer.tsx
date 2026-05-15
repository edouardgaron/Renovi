import React from 'react'
import Link from 'next/link'
import { Home, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#1B4FDE] rounded-lg flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Renovi</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              La plateforme tout-en-un pour les entrepreneurs en rénovation extérieure au Québec.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>Québec, QC, Canada</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>info@renovi.ca</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>1 (800) 555-RENO</span>
              </div>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4">Produit</h4>
            <ul className="space-y-2.5">
              {[
                { href: '#features', label: 'Fonctionnalités' },
                { href: '#pricing', label: 'Tarifs' },
                { href: '#how-it-works', label: 'Comment ça marche' },
                { href: '/register', label: 'Démarrer gratuitement' },
                { href: '/login', label: 'Connexion' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contractors */}
          <div>
            <h4 className="font-semibold text-white mb-4">Pour les pros</h4>
            <ul className="space-y-2.5">
              {[
                { href: '#', label: 'Peintres' },
                { href: '#', label: 'Couvreurs' },
                { href: '#', label: 'Poseurs de revêtement' },
                { href: '#', label: 'Installateurs de fenêtres' },
                { href: '#', label: 'Entrepreneurs généraux' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Légal & Support</h4>
            <ul className="space-y-2.5">
              {[
                { href: '#', label: 'Politique de confidentialité' },
                { href: '#', label: "Conditions d'utilisation" },
                { href: '#', label: 'Centre d\'aide' },
                { href: '#', label: 'Contactez-nous' },
                { href: '#', label: 'Blog' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Renovi Inc. Tous droits réservés.
          </p>
          <p className="text-sm text-slate-500">
            Fait avec soin au Québec, Canada
          </p>
        </div>
      </div>
    </footer>
  )
}
