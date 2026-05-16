export type UserRole = 'admin' | 'company' | 'employee' | 'client'
export type ProjectStatus =
  | 'draft'
  | 'invitation_sent'
  | 'photos_received'
  | 'analyzing'
  | 'report_ready'
  | 'completed'
export type MaterialType =
  | 'vinyl'
  | 'canexel'
  | 'wood'
  | 'brick'
  | 'aluminum'
  | 'stucco'
  | 'shingle'
  | 'metal'
export type BuildingType = 'residential' | 'commercial' | 'condo' | 'cottage'
export type SubscriptionPlan = 'starter' | 'pro' | 'enterprise'
export type InvitationStatus = 'pending' | 'opened' | 'completed' | 'expired'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  company_id: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Company {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  province: string
  postal_code: string
  logo_url: string | null
  owner_id: string
  subscription_plan: SubscriptionPlan
  license_number: string | null
  website: string | null
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  company_id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  province: string
  postal_code: string
  notes: string | null
  created_at: string
  updated_at: string
  projects?: Project[]
}

export interface ProjectPhoto {
  id: string
  project_id: string
  url: string
  angle: PhotoAngle
  caption: string | null
  order: number
  width: number | null
  height: number | null
  file_size: number | null
  created_at: string
}

export type PhotoAngle =
  | 'front'
  | 'back'
  | 'left_side'
  | 'right_side'
  | 'front_left'
  | 'front_right'
  | 'back_left'
  | 'back_right'
  | 'roof'
  | 'detail'

export interface ProjectMeasurements {
  facade_width: number | null
  building_height: number | null
  wall_surface: number | null
  roof_surface: number | null
  window_count: number | null
  door_count: number | null
  perimeter: number | null
  confidence_level: 'low' | 'medium' | 'high' | null
  notes: string | null
  building_stories?: number
  has_garage?: boolean
  has_dormer?: boolean
  roof_style?: 'gable' | 'hip' | 'mansard' | 'flat' | 'gambrel'
  detected_features?: string[]
}

export interface ProjectMaterials {
  wall_color: string | null
  roof_color: string | null
  trim_color: string | null
  door_color: string | null
  wall_material: MaterialType | null
  roof_material: MaterialType | null
  accent_color: string | null
}

export interface Project {
  id: string
  company_id: string
  client_id: string
  client?: Client
  name: string
  address: string
  city: string
  province: string
  postal_code: string
  building_type: BuildingType
  status: ProjectStatus
  photos: ProjectPhoto[]
  measurements: ProjectMeasurements
  materials: ProjectMaterials
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Invitation {
  id: string
  project_id: string
  project?: Project
  client_id: string
  client?: Client
  token: string
  expires_at: string
  status: InvitationStatus
  message: string | null
  created_at: string
  updated_at: string
}

export interface ActivityItem {
  id: string
  company_id: string
  type: 'project_created' | 'client_added' | 'invitation_sent' | 'photos_received' | 'report_generated'
  title: string
  description: string
  project_id: string | null
  client_id: string | null
  created_at: string
}

export interface DashboardStats {
  total_projects: number
  active_projects: number
  total_clients: number
  reports_generated: number
  photos_received: number
  invitations_sent: number
}

export interface PricingPlan {
  id: SubscriptionPlan
  name: string
  price_monthly: number
  price_yearly: number
  features: string[]
  max_projects: number
  max_clients: number
  is_popular?: boolean
}

export interface ColorSwatch {
  name: string
  hex: string
  brand?: string
}

export interface MaterialOption {
  id: MaterialType
  label_fr: string
  label_en: string
  description_fr: string
  texture_url?: string
}
