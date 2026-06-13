import Link from 'next/link'
import { ArrowRight, Sparkles, Target, Zap, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">CP</span>
            </div>
            <span className="font-semibold text-foreground">CreadorPro AI</span>
          </div>
          <Link href="/login">
            <Button size="sm" className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white">
              Comenzar gratis
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-800 bg-violet-950/30 text-violet-300 text-sm mb-8">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Consultor estratégico IA para LATAM</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground max-w-3xl leading-tight mb-6">
          Tu estrategia de negocio digital,{' '}
          <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            generada por IA
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg text-muted-foreground max-w-xl mb-10">
          Responde 3 preguntas sobre tu perfil y recibe un plan estratégico completo: nichos, servicios, contenido, pitch y roadmap de crecimiento.
        </p>

        {/* CTA */}
        <Link href="/login">
          <Button
            size="lg"
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-8 h-12 text-base"
          >
            Generar mi plan estratégico
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
        <p className="mt-3 text-xs text-muted-foreground">Gratis · Listo en 30 segundos</p>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full">
          {[
            {
              icon: Target,
              title: 'Nichos rentables',
              desc: 'Identifica los segmentos de mercado con mayor potencial para tu perfil en LATAM',
            },
            {
              icon: Zap,
              title: 'Plan completo en segundos',
              desc: 'Propuesta de valor, servicios, estrategia de contenido y pitch profesional',
            },
            {
              icon: Users,
              title: 'Hecho para LATAM',
              desc: 'Recomendaciones contextualizadas para el mercado digital latinoamericano',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-card border border-border rounded-xl p-5 text-left">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mb-3">
                <Icon className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-4 text-center">
        <p className="text-xs text-muted-foreground">CreadorPro AI · Para freelancers, creadores y micro-agencias de LATAM</p>
      </footer>
    </div>
  )
}
