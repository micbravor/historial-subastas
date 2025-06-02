export function BackgroundCircles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Círculo grande superior derecha */}
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-red-100 opacity-30 blur-3xl"></div>

      {/* Círculo mediano inferior izquierda */}
      <div className="absolute bottom-40 -left-20 w-64 h-64 rounded-full bg-red-200 opacity-20 blur-3xl"></div>

      {/* Círculo pequeño centro */}
      <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-red-100 opacity-25 blur-3xl"></div>

      {/* Círculo extra pequeño superior izquierda */}
      <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-red-200 opacity-20 blur-3xl"></div>

      {/* Círculo extra inferior derecha */}
      <div className="absolute -bottom-10 right-1/4 w-72 h-72 rounded-full bg-red-100 opacity-30 blur-3xl"></div>
    </div>
  )
}
