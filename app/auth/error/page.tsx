import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
        <span className="text-white font-bold text-xl">!</span>
      </div>
      <h1 className="text-xl font-bold text-foreground">Error de autenticación</h1>
      <p className="text-muted-foreground text-sm max-w-sm">
        Hubo un problema al iniciar sesión. Por favor intenta de nuevo.
      </p>
      <Link
        href="/"
        className="text-violet-400 hover:text-violet-300 text-sm underline underline-offset-4"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
