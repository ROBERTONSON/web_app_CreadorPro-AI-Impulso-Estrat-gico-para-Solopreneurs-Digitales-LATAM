'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Profile, ExperienceLevel } from '@/lib/types'
import { ArrowRight } from 'lucide-react'

interface StepProfileProps {
  data: Profile | null
  onNext: (profile: Profile) => void
}

export default function StepProfile({ data, onNext }: StepProfileProps) {
  const [form, setForm] = useState<Partial<Profile>>(data ?? {})
  const [errors, setErrors] = useState<Partial<Record<keyof Profile, string>>>({})

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Profile, string>> = {}
    if (!form.experience) newErrors.experience = 'Selecciona tu nivel de experiencia'
    if (!form.skills?.trim()) newErrors.skills = 'Ingresa tus habilidades principales'
    if (!form.current_services?.trim()) newErrors.current_services = 'Describe tus servicios actuales'
    if (!form.interests?.trim()) newErrors.interests = 'Describe tus intereses de negocio'
    if (!form.country_city?.trim()) newErrors.country_city = 'Ingresa tu país y ciudad'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      onNext(form as Profile)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Tu Perfil Profesional</h1>
        <p className="text-muted-foreground">Cuéntanos sobre ti para personalizar tu plan estratégico.</p>
      </div>

      <div className="space-y-6">
        {/* Experiencia */}
        <div className="space-y-2">
          <Label htmlFor="experience">Nivel de experiencia</Label>
          <Select
            value={form.experience ?? ''}
            onValueChange={(v) => setForm(f => ({ ...f, experience: v as ExperienceLevel }))}
          >
            <SelectTrigger id="experience" className={errors.experience ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selecciona tu nivel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="junior">Junior (0-2 años)</SelectItem>
              <SelectItem value="mid">Mid (2-5 años)</SelectItem>
              <SelectItem value="senior">Senior (5-10 años)</SelectItem>
              <SelectItem value="expert">Experto (+10 años)</SelectItem>
            </SelectContent>
          </Select>
          {errors.experience && <p className="text-red-400 text-sm">{errors.experience}</p>}
        </div>

        {/* Habilidades */}
        <div className="space-y-2">
          <Label htmlFor="skills">Habilidades principales</Label>
          <Textarea
            id="skills"
            placeholder="Ej: diseño gráfico, copywriting, gestión de redes sociales, SEO..."
            value={form.skills ?? ''}
            onChange={(e) => setForm(f => ({ ...f, skills: e.target.value }))}
            className={`min-h-[80px] ${errors.skills ? 'border-red-500' : ''}`}
          />
          {errors.skills && <p className="text-red-400 text-sm">{errors.skills}</p>}
        </div>

        {/* Servicios actuales */}
        <div className="space-y-2">
          <Label htmlFor="current_services">Servicios actuales</Label>
          <Textarea
            id="current_services"
            placeholder="Ej: gestión de Instagram para restaurantes, diseño de logos, consultoría de marketing..."
            value={form.current_services ?? ''}
            onChange={(e) => setForm(f => ({ ...f, current_services: e.target.value }))}
            className={`min-h-[80px] ${errors.current_services ? 'border-red-500' : ''}`}
          />
          {errors.current_services && <p className="text-red-400 text-sm">{errors.current_services}</p>}
        </div>

        {/* Intereses */}
        <div className="space-y-2">
          <Label htmlFor="interests">Intereses de negocio</Label>
          <Textarea
            id="interests"
            placeholder="Ej: automatización, e-commerce, educación online, salud y bienestar..."
            value={form.interests ?? ''}
            onChange={(e) => setForm(f => ({ ...f, interests: e.target.value }))}
            className={`min-h-[80px] ${errors.interests ? 'border-red-500' : ''}`}
          />
          {errors.interests && <p className="text-red-400 text-sm">{errors.interests}</p>}
        </div>

        {/* País/Ciudad */}
        <div className="space-y-2">
          <Label htmlFor="country_city">País y ciudad</Label>
          <Input
            id="country_city"
            placeholder="Ej: México, Ciudad de México"
            value={form.country_city ?? ''}
            onChange={(e) => setForm(f => ({ ...f, country_city: e.target.value }))}
            className={errors.country_city ? 'border-red-500' : ''}
          />
          {errors.country_city && <p className="text-red-400 text-sm">{errors.country_city}</p>}
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
        size="lg"
      >
        Continuar <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}
