import Link from 'next/link'
import { Home } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      {/* Top bar */}
      <header className="px-6 py-4">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-8 h-8 bg-[#1B4FDE] rounded-lg flex items-center justify-center">
            <Home className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Renovi</span>
        </Link>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Renovi Inc. · Politique de confidentialité · Conditions d&apos;utilisation
      </footer>
    </div>
  )
}
