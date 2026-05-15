import type { User } from '@/types'

export interface MockAccount {
  email: string
  password: string
  user: User
  redirectTo: string
  label: string
  color: string
}

export const MOCK_ACCOUNTS: MockAccount[] = [
  {
    email: 'admin@renovi.ca',
    password: 'admin123',
    label: 'Administrateur',
    color: 'purple',
    redirectTo: '/dashboard',
    user: {
      id: 'user-admin',
      email: 'admin@renovi.ca',
      name: 'Admin Renovi',
      role: 'admin',
      company_id: null,
      avatar_url: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  },
  {
    email: 'marc@renovationsbeaumont.ca',
    password: 'demo123',
    label: 'Entreprise (Pro)',
    color: 'blue',
    redirectTo: '/dashboard',
    user: {
      id: 'user-001',
      email: 'marc@renovationsbeaumont.ca',
      name: 'Marc Beaumont',
      role: 'company',
      company_id: 'company-001',
      avatar_url: null,
      created_at: '2024-03-15T10:00:00Z',
      updated_at: '2024-11-20T14:30:00Z',
    },
  },
  {
    email: 'employe@renovationsbeaumont.ca',
    password: 'employe123',
    label: 'Employé',
    color: 'green',
    redirectTo: '/dashboard',
    user: {
      id: 'user-002',
      email: 'employe@renovationsbeaumont.ca',
      name: 'Julie Côté',
      role: 'employee',
      company_id: 'company-001',
      avatar_url: null,
      created_at: '2024-05-10T09:00:00Z',
      updated_at: '2024-10-01T11:00:00Z',
    },
  },
  {
    email: 'client@gmail.com',
    password: 'client123',
    label: 'Client',
    color: 'orange',
    redirectTo: '/invite/demo-token',
    user: {
      id: 'user-003',
      email: 'client@gmail.com',
      name: 'Sophie Tremblay',
      role: 'client',
      company_id: null,
      avatar_url: null,
      created_at: '2024-09-10T09:00:00Z',
      updated_at: '2024-11-15T16:00:00Z',
    },
  },
]

export function findAccount(email: string, password: string): MockAccount | null {
  return (
    MOCK_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    ) ?? null
  )
}

export function getSessionUser(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('renovi_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setSession(user: User): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('renovi_user', JSON.stringify(user))
  document.cookie = 'renovi_session=mock_session; path=/; max-age=86400'
}

export function clearSession(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('renovi_user')
  document.cookie = 'renovi_session=; path=/; max-age=0'
}
