'use client'

import { useState } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight, Users, TrendingUp, Clock } from 'lucide-react'

interface Testimonial {
  id: string
  name: string
  company: string
  role: string
  avatar: string
  rating: number
  text: string
  results: {
    metric: string
    value: string
  }[]
  verified: boolean
  industry: string
}

interface TestimonialsProps {
  variant?: 'carousel' | 'grid' | 'featured'
  maxItems?: number
  className?: string
}

export default function Testimonials({
  variant = 'carousel',
  maxItems = 3,
  className = ""
}: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: "Marc Dubois",
      company: "Dubois Construction",
      role: "Président",
      avatar: "👷‍♂️",
      rating: 5,
      text: "StructureClerk a transformé ma gestion. Je passe 10 heures de moins par semaine sur l'administratif et je peux me concentrer sur mes chantiers. L'extraction IA est bluffante de précision!",
      results: [
        { metric: "Temps économisé", value: "10h/semaine" },
        { metric: "Précision IA", value: "96%" }
      ],
      verified: true,
      industry: "Construction"
    },
    {
      id: '2',
      name: "Sophie Tremblay",
      company: "Tremblay Design",
      role: "Directrice",
      avatar: "👩‍💼",
      rating: 5,
      text: "En tant que designer, je déteste l'administratif. Avec StructureClerk, je prends une photo de mes factures et c'est fait. Le devis intelligent m'a fait gagner 3 contrats le mois dernier!",
      results: [
        { metric: "Devis gagnés", value: "+3/mois" },
        { metric: "Temps de facturation", value: "-80%" }
      ],
      verified: true,
      industry: "Design"
    },
    {
      id: '3',
      name: "Robert Gagnon",
      company: "Gagnon Électricité",
      role: "Électricien",
      avatar: "⚡",
      rating: 5,
      text: "Je suis technophobe, mais StructureClerk est incroyablement simple. J'ai économisé $2,300 la première semaine en optimisant mes factures. Mes clients sont impressionnés par ma rapidité!",
      results: [
        { metric: "Économies mois 1", value: "$2,300" },
        { metric: "Factures traitées", value: "127" }
      ],
      verified: true,
      industry: "Électricité"
    },
    {
      id: '4',
      name: "Julie Martin",
      company: "Martin Rénovation",
      role: "Gérante",
      avatar: "👩‍🔧",
      rating: 4,
      text: "Les prévisions financières m'ont permis d'anticiper un problème de trésorerie et de l'éviter. Je dors beaucoup mieux la nuit grâce à StructureClerk!",
      results: [
        { metric: "Visibilité financière", value: "+85%" },
        { metric: "Stress réduit", value: "-70%" }
      ],
      verified: true,
      industry: "Rénovation"
    },
    {
      id: '5',
      name: "Michel Roy",
      company: "Roy Paysagiste",
      role: "Propriétaire",
      avatar: "🌳",
      rating: 5,
      text: "La caméra métrique est magique! Je fais des devis en 5 minutes au lieu de 30 minutes. Mes clients adorent la précision et je ne perds plus d'argent sur les mauvais calculs.",
      results: [
        { metric: "Temps par devis", value: "-83%" },
        { metric: "Précision mesures", value: "98%" }
      ],
      verified: true,
      industry: "Paysagisme"
    }
  ]

  const currentTestimonials = testimonials.slice(currentIndex, currentIndex + maxItems)

  const next = () => {
    setCurrentIndex((prev) => (prev + maxItems) % testimonials.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - maxItems + testimonials.length) % testimonials.length)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  if (variant === 'featured') {
    const featured = testimonials[0]
    return (
      <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6 ${className}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{featured.avatar}</div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-gray-900">{featured.name}</h4>
                {featured.verified && (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <Star className="w-3 h-3 fill-green-600" />
                    <span>Vérifié</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600">{featured.role}, {featured.company}</p>
            </div>
          </div>
          <div className="flex">{renderStars(featured.rating)}</div>
        </div>

        <Quote className="w-8 h-8 text-blue-200 mb-4" />
        <p className="text-gray-700 mb-4 italic">"{featured.text}"</p>

        <div className="flex flex-wrap gap-2">
          {featured.results.map((result, index) => (
            <div key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
              {result.metric}: {result.value}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (variant === 'grid') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {testimonials.slice(0, maxItems).map((testimonial) => (
          <div key={testimonial.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{testimonial.avatar}</div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.company}</p>
                </div>
              </div>
              {testimonial.verified && (
                <div className="text-xs text-green-600 font-medium">Vérifié</div>
              )}
            </div>

            <div className="flex mb-3">{renderStars(testimonial.rating)}</div>

            <Quote className="w-6 h-6 text-gray-200 mb-3" />
            <p className="text-gray-700 text-sm mb-4 italic">"{testimonial.text}"</p>

            <div className="flex flex-wrap gap-1">
              {testimonial.results.map((result, index) => (
                <div key={index} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                  {result.value}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentTestimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{testimonial.avatar}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    {testimonial.verified && (
                      <Star className="w-4 h-4 text-green-500 fill-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                {testimonial.industry}
              </span>
            </div>

            <div className="flex mb-3">{renderStars(testimonial.rating)}</div>

            <Quote className="w-6 h-6 text-gray-200 mb-3" />
            <p className="text-gray-700 text-sm mb-4 italic">"{testimonial.text}"</p>

            <div className="space-y-2">
              {testimonial.results.map((result, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{result.metric}</span>
                  <span className="font-semibold text-green-600">{result.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      {testimonials.length > maxItems && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={prev}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: Math.ceil(testimonials.length / maxItems) }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === Math.floor(currentIndex / maxItems) ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            disabled={currentIndex + maxItems >= testimonials.length}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Trust Summary */}
      <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <div className="flex items-center justify-center gap-8 text-center">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-700">
              <span className="font-bold text-blue-600">127+</span> entrepreneurs
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-700">
              Note moyenne <span className="font-bold text-yellow-600">4.8/5</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-700">
              <span className="font-bold text-green-600">87%</span> voient des résultats
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}