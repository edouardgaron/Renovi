'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Camera,
  Ruler,
  FileText,
  Zap,
  Star,
  Check,
  ChevronDown,
  ArrowRight,
  Building,
  Users,
  BarChart3,
  Shield,
  Clock,
  Smartphone,
  Box,
  Send,
  Home,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PRICING_PLANS } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-[#0F1E5C] via-[#1B4FDE] to-[#1640C4] overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-mesh opacity-30" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32">
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="max-w-4xl"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full backdrop-blur-sm">
              <Zap className="w-4 h-4 text-yellow-400" />
              Nouveau en 2025 — Visualisation 3D disponible
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6"
          >
            Mesurez.
            <br />
            <span className="text-[#93B4FD]">Visualisez.</span>
            <br />
            Impressionnez.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeInUp}
            className="text-xl text-blue-100 max-w-2xl mb-10 leading-relaxed"
          >
            La plateforme tout-en-un pour les entrepreneurs en rénovation extérieure au Québec.
            Vos clients prennent des photos, vous obtenez des mesures précises et des rapports professionnels.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
            <Link href="/register">
              <Button
                size="xl"
                className="bg-white text-[#1B4FDE] hover:bg-gray-50 shadow-lg hover:shadow-xl font-semibold"
              >
                Commencer gratuitement
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button
              size="xl"
              className="bg-transparent border-2 border-white/40 text-white hover:bg-white/10 backdrop-blur-sm"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Voir la démo
            </Button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            variants={fadeInUp}
            className="mt-12 flex flex-wrap items-center gap-6"
          >
            <div className="flex -space-x-2">
              {['MB', 'ST', 'JL', 'PR'].map((initials) => (
                <div
                  key={initials}
                  className="w-9 h-9 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-xs font-bold text-white backdrop-blur-sm"
                >
                  {initials}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 mb-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-blue-200">
                <strong className="text-white">200+</strong> entrepreneurs au Québec
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" className="w-full" fill="white">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  )
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      icon: Camera,
      title: 'Photos guidées',
      description:
        'Vos clients reçoivent un lien personnalisé avec des instructions étape par étape pour photographier leur maison sous tous les angles.',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: Ruler,
      title: 'Mesures automatiques',
      description:
        'Notre algorithme extrait automatiquement les dimensions: surface murale, toiture, périmètre, nombre de fenêtres et portes.',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: Box,
      title: 'Visualisation 3D',
      description:
        'Montrez à vos clients comment leur maison sera transformée avec notre configurateur 3D interactif. Testez couleurs et matériaux.',
      color: 'bg-orange-50 text-orange-600',
    },
    {
      icon: FileText,
      title: 'Rapports professionnels',
      description:
        'Générez des rapports PDF élaborés avec votre logo, les mesures détaillées, les photos annotées et les matériaux recommandés.',
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: Send,
      title: 'Invitations automatiques',
      description:
        'Envoyez des invitations par courriel en un clic. Le client n\'a besoin d\'aucun compte — juste son téléphone.',
      color: 'bg-teal-50 text-teal-600',
    },
    {
      icon: Users,
      title: 'Gestion des clients',
      description:
        'CRM intégré pour gérer vos clients, l\'historique de leurs projets et toutes vos communications.',
      color: 'bg-rose-50 text-rose-600',
    },
  ]

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-[#1B4FDE] uppercase tracking-wider">
            Fonctionnalités
          </span>
          <h2 className="mt-2 text-4xl font-bold text-gray-900">
            Tout ce dont vous avez besoin
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            Une suite d&apos;outils puissants conçue spécifiquement pour les professionnels de la rénovation extérieure.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-card-hover hover:border-gray-200 transition-all group"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}
              >
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#1B4FDE] transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// How it works
function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      icon: Building,
      title: 'Créez le projet',
      description:
        'Ajoutez votre client dans la plateforme et créez un nouveau projet avec l\'adresse de la propriété à rénover.',
      color: 'border-blue-200 bg-blue-50',
    },
    {
      number: '02',
      icon: Send,
      title: 'Envoyez l\'invitation',
      description:
        'En un clic, votre client reçoit un courriel avec un lien unique vers son portail photo personnalisé.',
      color: 'border-purple-200 bg-purple-50',
    },
    {
      number: '03',
      icon: Camera,
      title: 'Client prend les photos',
      description:
        'Le client suit les instructions étape par étape pour photographier sa maison depuis tous les angles requis.',
      color: 'border-orange-200 bg-orange-50',
    },
    {
      number: '04',
      icon: BarChart3,
      title: 'Rapport automatique',
      description:
        'Renovi analyse les photos, extrait les mesures et génère automatiquement un rapport professionnel complet.',
      color: 'border-green-200 bg-green-50',
    },
  ]

  return (
    <section
      id="how-it-works"
      className="py-24 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-[#1B4FDE] uppercase tracking-wider">
            Simple et rapide
          </span>
          <h2 className="mt-2 text-4xl font-bold text-gray-900">
            Comment ça fonctionne
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            De la création du projet au rapport en moins de 24 heures.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-gray-200 to-transparent z-0 -mr-6" />
              )}
              <div
                className={`relative z-10 rounded-xl border-2 p-6 ${step.color}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-black text-gray-200">
                    {step.number}
                  </span>
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <step.icon className="w-5 h-5 text-[#1B4FDE]" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Testimonials
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Martin Bouchard',
      company: 'Toitures Bouchard & Fils',
      role: 'Propriétaire',
      content:
        'Renovi a transformé ma façon de faire des soumissions. J\'économise 3-4 heures par projet et mes clients sont impressionnés par les rapports professionnels.',
      rating: 5,
      initials: 'MB',
    },
    {
      name: 'Sylvie Lapointe',
      company: 'Rénovations Lapointe',
      role: 'Gestionnaire de projets',
      content:
        'La visualisation 3D est un game-changer. Les clients peuvent voir exactement à quoi va ressembler leur maison avant de signer. Notre taux de conversion a augmenté de 40%.',
      rating: 5,
      initials: 'SL',
    },
    {
      name: 'Jean-Pierre Morin',
      company: 'Construction Morin Inc.',
      role: 'Directeur',
      content:
        'Simple, efficace et professionnel. Mes clients n\'ont aucune difficulté à utiliser le portail photo. Le support est excellent.',
      rating: 5,
      initials: 'JM',
    },
  ]

  return (
    <section className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
            Témoignages
          </span>
          <h2 className="mt-2 text-4xl font-bold text-white">
            Ils utilisent Renovi au quotidien
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-slate-300 leading-relaxed mb-6 text-sm">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1B4FDE] rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Pricing Section
function PricingSection() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-[#1B4FDE] uppercase tracking-wider">
            Tarifs
          </span>
          <h2 className="mt-2 text-4xl font-bold text-gray-900">
            Tarifs simples et transparents
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            Sans engagement. Annulez en tout temps.
          </p>

          {/* Billing toggle */}
          <div className="mt-8 inline-flex items-center gap-3 bg-gray-100 p-1.5 rounded-lg">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                billing === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                billing === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Annuel
              <span className="text-xs text-green-600 font-semibold bg-green-50 px-1.5 py-0.5 rounded">
                -15%
              </span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PRICING_PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl border-2 p-8 ${
                plan.is_popular
                  ? 'border-[#1B4FDE] shadow-lg shadow-blue-100'
                  : 'border-gray-200 hover:border-gray-300'
              } transition-all`}
            >
              {plan.is_popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[#1B4FDE] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                    Le plus populaire
                  </span>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-gray-900">
                    {formatCurrency(
                      billing === 'monthly' ? plan.price_monthly : Math.round(plan.price_yearly / 12)
                    )}
                  </span>
                  <span className="text-gray-500">/ mois</span>
                </div>
                {billing === 'yearly' && (
                  <p className="text-sm text-green-600 mt-1">
                    {formatCurrency(plan.price_yearly)} facturé annuellement
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/register" className="block">
                <Button
                  className={`w-full ${
                    plan.is_popular
                      ? 'bg-[#1B4FDE] hover:bg-[#1640C4] text-white'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                  size="lg"
                >
                  Commencer
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// FAQ Section
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: 'Comment mes clients prennent-ils les photos?',
      answer:
        'Vos clients reçoivent un lien unique par courriel. En cliquant sur ce lien, ils accèdent à un portail simple sur leur téléphone qui les guide étape par étape pour photographier leur maison depuis tous les angles nécessaires. Aucun téléchargement d\'application n\'est requis.',
    },
    {
      question: 'Quelle est la précision des mesures?',
      answer:
        'Nos mesures atteignent une précision de 85-95% selon la qualité des photos fournies. Plus les photos respectent les instructions (distance, angle, lumière), plus les mesures sont précises. Un indicateur de confiance est toujours fourni avec chaque rapport.',
    },
    {
      question: 'Puis-je utiliser mon propre logo sur les rapports?',
      answer:
        'Oui, avec le plan Professionnel et Entreprise, vous pouvez ajouter votre logo et personnaliser les couleurs des rapports PDF pour qu\'ils reflètent votre image de marque.',
    },
    {
      question: 'Y a-t-il un engagement de durée?',
      answer:
        'Non, aucun engagement. Vous pouvez annuler à tout moment. Si vous choisissez la facturation annuelle, vous bénéficiez d\'une économie de 15% et vous pouvez annuler avant le prochain renouvellement.',
    },
    {
      question: 'La plateforme fonctionne-t-elle au Québec uniquement?',
      answer:
        'Renovi est conçu et optimisé pour le marché québécois et canadien, mais fonctionne partout dans le monde. L\'interface est disponible en français et en anglais.',
    },
    {
      question: 'Comment fonctionne la période d\'essai?',
      answer:
        'Vous pouvez commencer gratuitement avec un accès au plan Démarrage pendant 14 jours, sans carte de crédit requise. Vous décidez ensuite si vous souhaitez continuer avec un plan payant.',
    },
  ]

  return (
    <section id="faq" className="py-24 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-[#1B4FDE] uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="mt-2 text-4xl font-bold text-gray-900">
            Questions fréquentes
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                  {faq.answer}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// CTA Section
function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#1B4FDE] to-[#0F1E5C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Prêt à transformer votre façon de travailler?
          </h2>
          <p className="text-xl text-blue-200 mb-10 max-w-2xl mx-auto">
            Rejoignez plus de 200 entrepreneurs au Québec qui utilisent Renovi pour gagner du temps et impressionner leurs clients.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button
                size="xl"
                className="bg-white text-[#1B4FDE] hover:bg-gray-50 font-semibold shadow-lg"
              >
                Commencer gratuitement
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <a href="mailto:bonjour@renovi.ca">
              <Button
                size="xl"
                className="bg-transparent border-2 border-white/40 text-white hover:bg-white/10"
              >
                Parler à un conseiller
              </Button>
            </a>
          </div>
          <p className="mt-6 text-sm text-blue-300">
            Essai gratuit 14 jours · Aucune carte de crédit requise · Annulation en tout temps
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </>
  )
}
