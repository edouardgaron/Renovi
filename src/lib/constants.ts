import type { PhotoAngle, MaterialOption, ColorSwatch, PricingPlan } from '@/types'

export const APP_NAME = 'Renovi'
export const APP_TAGLINE_FR = 'Mesurez. Visualisez. Impressionnez.'
export const APP_TAGLINE_EN = 'Measure. Visualize. Impress.'

export const PHOTO_ANGLES: Record<
  PhotoAngle,
  { label_fr: string; label_en: string; instruction_fr: string; instruction_en: string; required: boolean }
> = {
  front: {
    label_fr: 'Façade avant',
    label_en: 'Front View',
    instruction_fr: 'Placez-vous face à la maison, à environ 15-20 mètres. Capturez toute la façade.',
    instruction_en: 'Stand facing the house, about 15-20 meters away. Capture the full front facade.',
    required: true,
  },
  back: {
    label_fr: 'Façade arrière',
    label_en: 'Back View',
    instruction_fr: 'Faites le tour et photographiez la façade arrière complète.',
    instruction_en: 'Go around and photograph the complete back facade.',
    required: true,
  },
  left_side: {
    label_fr: 'Côté gauche',
    label_en: 'Left Side',
    instruction_fr: 'Photographiez le côté gauche de la maison en totalité.',
    instruction_en: 'Photograph the entire left side of the house.',
    required: true,
  },
  right_side: {
    label_fr: 'Côté droit',
    label_en: 'Right Side',
    instruction_fr: 'Photographiez le côté droit de la maison en totalité.',
    instruction_en: 'Photograph the entire right side of the house.',
    required: true,
  },
  front_left: {
    label_fr: 'Coin avant gauche',
    label_en: 'Front-Left Corner',
    instruction_fr: 'Positionnez-vous au coin avant gauche pour capturer les deux façades.',
    instruction_en: 'Position yourself at the front-left corner to capture both facades.',
    required: false,
  },
  front_right: {
    label_fr: 'Coin avant droit',
    label_en: 'Front-Right Corner',
    instruction_fr: 'Positionnez-vous au coin avant droit pour capturer les deux façades.',
    instruction_en: 'Position yourself at the front-right corner to capture both facades.',
    required: false,
  },
  back_left: {
    label_fr: 'Coin arrière gauche',
    label_en: 'Back-Left Corner',
    instruction_fr: 'Positionnez-vous au coin arrière gauche.',
    instruction_en: 'Position yourself at the back-left corner.',
    required: false,
  },
  back_right: {
    label_fr: 'Coin arrière droit',
    label_en: 'Back-Right Corner',
    instruction_fr: 'Positionnez-vous au coin arrière droit.',
    instruction_en: 'Position yourself at the back-right corner.',
    required: false,
  },
  roof: {
    label_fr: 'Toiture',
    label_en: 'Roof',
    instruction_fr: 'Si possible, prenez une photo de la toiture depuis une hauteur (drone, 2e étage voisin).',
    instruction_en: 'If possible, take a photo of the roof from height (drone, neighbor\'s 2nd floor).',
    required: false,
  },
  detail: {
    label_fr: 'Détail',
    label_en: 'Detail',
    instruction_fr: 'Photographiez les détails importants: fenêtres, portes, moulures, dommages éventuels.',
    instruction_en: 'Photograph important details: windows, doors, moldings, any damage.',
    required: false,
  },
}

export const REQUIRED_PHOTO_ANGLES: PhotoAngle[] = ['front', 'back', 'left_side', 'right_side']

export const MATERIALS: MaterialOption[] = [
  {
    id: 'vinyl',
    label_fr: 'Vinyle',
    label_en: 'Vinyl',
    description_fr: 'Revêtement en PVC, faible entretien, large choix de couleurs',
  },
  {
    id: 'canexel',
    label_fr: 'Canexel',
    label_en: 'Canexel',
    description_fr: 'Fibre de bois compressée, aspect naturel, très résistant',
  },
  {
    id: 'wood',
    label_fr: 'Bois',
    label_en: 'Wood',
    description_fr: 'Revêtement en bois naturel, charme authentique',
  },
  {
    id: 'brick',
    label_fr: 'Brique',
    label_en: 'Brick',
    description_fr: 'Maçonnerie traditionnelle, très durable',
  },
  {
    id: 'aluminum',
    label_fr: 'Aluminium',
    label_en: 'Aluminum',
    description_fr: 'Revêtement métallique léger, résistant à la corrosion',
  },
  {
    id: 'stucco',
    label_fr: 'Stucco',
    label_en: 'Stucco',
    description_fr: 'Enduit à base de ciment, aspect texturé',
  },
  {
    id: 'shingle',
    label_fr: 'Bardeau asphalte',
    label_en: 'Asphalt Shingle',
    description_fr: 'Bardeau de toiture standard, excellent rapport qualité-prix',
  },
  {
    id: 'metal',
    label_fr: 'Métal',
    label_en: 'Metal',
    description_fr: 'Toiture métallique, très durable, excellent pour le Québec',
  },
]

export const EXTERIOR_COLOR_PALETTES: { category_fr: string; colors: ColorSwatch[] }[] = [
  {
    category_fr: 'Blancs & Crèmes',
    colors: [
      { name: 'Blanc Pur', hex: '#FFFFFF' },
      { name: 'Blanc Cassé', hex: '#F5F0E8' },
      { name: 'Crème', hex: '#F2ECD8' },
      { name: 'Ivoire', hex: '#FFFFF0' },
      { name: 'Blanc Neige', hex: '#F8F8F8' },
    ],
  },
  {
    category_fr: 'Gris & Ardoises',
    colors: [
      { name: 'Gris Perle', hex: '#C8C8C8' },
      { name: 'Gris Charcoal', hex: '#4A4A4A' },
      { name: 'Gris Ardoise', hex: '#708090' },
      { name: 'Gris Anthracite', hex: '#3D3D3D' },
      { name: 'Gris Clair', hex: '#D0D0D0' },
    ],
  },
  {
    category_fr: 'Beiges & Bruns',
    colors: [
      { name: 'Beige Sable', hex: '#C8A882' },
      { name: 'Taupe', hex: '#8B7355' },
      { name: 'Brun Naturel', hex: '#8B4513' },
      { name: 'Caramel', hex: '#C19A6B' },
      { name: 'Driftwood', hex: '#9B8E7E' },
    ],
  },
  {
    category_fr: 'Bleus & Verts',
    colors: [
      { name: 'Bleu Marine', hex: '#1B3A6B' },
      { name: 'Bleu Acier', hex: '#4682B4' },
      { name: 'Vert Forêt', hex: '#2D5A27' },
      { name: 'Vert Sauge', hex: '#7D9E7D' },
      { name: 'Bleu Ardoise', hex: '#6A8CAD' },
    ],
  },
  {
    category_fr: 'Rouges & Terreux',
    colors: [
      { name: 'Rouge Bordeaux', hex: '#722F37' },
      { name: 'Rouge Brique', hex: '#CB4154' },
      { name: 'Terracotta', hex: '#C06038' },
      { name: 'Bourgogne', hex: '#800020' },
      { name: 'Rouille', hex: '#A0522D' },
    ],
  },
]

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Démarrage',
    price_monthly: 49,
    price_yearly: 490,
    features: [
      '5 projets actifs',
      '20 clients',
      'Invitations par courriel',
      'Rapport PDF de base',
      'Support par courriel',
    ],
    max_projects: 5,
    max_clients: 20,
  },
  {
    id: 'pro',
    name: 'Professionnel',
    price_monthly: 99,
    price_yearly: 990,
    features: [
      '25 projets actifs',
      'Clients illimités',
      'Visualisation 3D',
      'Rapport PDF avancé',
      'Configurateur de matériaux',
      'Support prioritaire',
      'Logo personnalisé sur rapports',
    ],
    max_projects: 25,
    max_clients: -1,
    is_popular: true,
  },
  {
    id: 'enterprise',
    name: 'Entreprise',
    price_monthly: 249,
    price_yearly: 2490,
    features: [
      'Projets illimités',
      'Clients illimités',
      'Plusieurs employés',
      'API access',
      'Intégrations CRM',
      'Rapport PDF blanc',
      'Gestionnaire de compte dédié',
      'Formation sur place',
    ],
    max_projects: -1,
    max_clients: -1,
  },
]

export const PROVINCES_CA = [
  { code: 'AB', name: 'Alberta' },
  { code: 'BC', name: 'Colombie-Britannique' },
  { code: 'MB', name: 'Manitoba' },
  { code: 'NB', name: 'Nouveau-Brunswick' },
  { code: 'NL', name: 'Terre-Neuve-et-Labrador' },
  { code: 'NS', name: 'Nouvelle-Écosse' },
  { code: 'NT', name: 'Territoires du Nord-Ouest' },
  { code: 'NU', name: 'Nunavut' },
  { code: 'ON', name: 'Ontario' },
  { code: 'PE', name: 'Île-du-Prince-Édouard' },
  { code: 'QC', name: 'Québec' },
  { code: 'SK', name: 'Saskatchewan' },
  { code: 'YT', name: 'Yukon' },
]

export const BUILDING_TYPE_LABELS: Record<string, { fr: string; en: string }> = {
  residential: { fr: 'Résidentiel', en: 'Residential' },
  commercial: { fr: 'Commercial', en: 'Commercial' },
  condo: { fr: 'Condo', en: 'Condo' },
  cottage: { fr: 'Chalet', en: 'Cottage' },
}
