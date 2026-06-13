'use client'

import { useState, useEffect, useCallback } from 'react'
import type { StrategyReport, WizardData } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { History, Loader2, Trash2, FolderOpen, Save, Check } from 'lucide-react'

interface Project {
  id: string
  name: string
  created_at: string
  wizard_data: WizardData
  report: StrategyReport
}

interface ProjectHistoryProps {
  currentReport: StrategyReport | null
  currentWizardData: WizardData | null
  onLoadProject: (report: StrategyReport, wizardData: WizardData) => void
  isAuthenticated: boolean
}

export default function ProjectHistory({
  currentReport,
  currentWizardData,
  onLoadProject,
  isAuthenticated,
}: ProjectHistoryProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [projectName, setProjectName] = useState('')

  const loadProjects = useCallback(async () => {
    if (!isAuthenticated) return
    setIsLoading(true)
    try {
      const res = await fetch('/api/projects')
      if (res.ok) {
        const data = await res.json()
        setProjects(data)
      }
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  const saveProject = async () => {
    if (!currentReport || !currentWizardData) return
    setIsSaving(true)
    try {
      const name = projectName.trim() || `Plan — ${currentWizardData.profile.country_city} — ${new Date().toLocaleDateString('es-LATAM')}`
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, wizard_data: currentWizardData, report: currentReport }),
      })
      if (res.ok) {
        const { id } = await res.json()
        setSavedId(id)
        setProjectName('')
        loadProjects()
        setTimeout(() => setSavedId(null), 3000)
      }
    } finally {
      setIsSaving(false)
    }
  }

  const deleteProject = async (id: string) => {
    await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-6 space-y-3">
        <History className="h-8 w-8 text-muted-foreground mx-auto" />
        <p className="text-sm text-muted-foreground">
          Inicia sesión para guardar y acceder a tu historial de planes.
        </p>
        <a href="/login" className="text-xs text-violet-400 hover:text-violet-300 underline underline-offset-4">
          Iniciar sesión →
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Save current plan */}
      {currentReport && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Guardar plan actual</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              placeholder="Nombre del plan (opcional)"
              className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button
              size="sm"
              onClick={saveProject}
              disabled={isSaving}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white h-9"
            >
              {isSaving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : savedId ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <><Save className="h-3.5 w-3.5 mr-1.5" /> Guardar</>
              )}
            </Button>
          </div>
          {savedId && <p className="text-xs text-emerald-400">Plan guardado correctamente.</p>}
        </div>
      )}

      {/* Project list */}
      <div>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">Planes guardados</p>
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : projects.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No tienes planes guardados todavía.</p>
        ) : (
          <div className="space-y-2">
            {projects.map(project => (
              <div key={project.id} className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2.5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground font-medium truncate">{project.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(project.created_at).toLocaleDateString('es-LATAM', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2"
                    onClick={() => onLoadProject(project.report, project.wizard_data)}
                    title="Cargar este plan"
                  >
                    <FolderOpen className="h-3.5 w-3.5 text-violet-400" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2"
                    onClick={() => deleteProject(project.id)}
                    title="Eliminar"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-400" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
