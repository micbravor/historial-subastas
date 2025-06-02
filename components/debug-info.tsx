"use client"

import { useState, useEffect } from "react"
import { supabase, CURRENT_POSTOR_ID } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DebugInfo() {
  const [debugData, setDebugData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDebugInfo() {
      try {
        const debug: any = {
          postor_id: CURRENT_POSTOR_ID,
          participaciones: null,
          subastas: null,
          vehiculos: null,
        }

        // 1. Verificar participaciones
        const { data: participaData, error: participaError } = await supabase
          .from("participa")
          .select("*")
          .eq("id_postor", CURRENT_POSTOR_ID)

        debug.participaciones = { data: participaData, error: participaError }

        if (participaData && participaData.length > 0) {
          const subastaIds = participaData.map((p) => p.id_subasta)

          // 2. Verificar subastas
          const { data: subastasData, error: subastasError } = await supabase
            .from("subasta")
            .select("*")
            .in("id_subasta", subastaIds)

          debug.subastas = { data: subastasData, error: subastasError }

          if (subastasData && subastasData.length > 0) {
            const fichas = subastasData.map((s) => s.ficha).filter(Boolean)

            // 3. Verificar vehículos
            const { data: vehiculosData, error: vehiculosError } = await supabase
              .from("vehiculo")
              .select("*")
              .in("ficha", fichas)

            debug.vehiculos = { data: vehiculosData, error: vehiculosError }
          }
        }

        setDebugData(debug)
      } catch (error) {
        console.error("Error en debug:", error)
        setDebugData({ error: error.message })
      } finally {
        setLoading(false)
      }
    }

    fetchDebugInfo()
  }, [])

  if (loading) {
    return (
      <Card className="mb-6 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-600">🔍 Información de Debug</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cargando información de debug...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-6 border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-600">🔍 Información de Debug</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-sm">
          <div>
            <strong>ID del Postor:</strong> {debugData?.postor_id}
          </div>

          <div>
            <strong>Participaciones:</strong>
            {debugData?.participaciones?.error ? (
              <div className="text-red-600">Error: {debugData.participaciones.error.message}</div>
            ) : (
              <div>
                <div>Encontradas: {debugData?.participaciones?.data?.length || 0}</div>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(debugData?.participaciones?.data, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div>
            <strong>Subastas:</strong>
            {debugData?.subastas?.error ? (
              <div className="text-red-600">Error: {debugData.subastas.error.message}</div>
            ) : (
              <div>
                <div>Encontradas: {debugData?.subastas?.data?.length || 0}</div>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(debugData?.subastas?.data, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div>
            <strong>Vehículos:</strong>
            {debugData?.vehiculos?.error ? (
              <div className="text-red-600">Error: {debugData.vehiculos.error.message}</div>
            ) : (
              <div>
                <div>Encontrados: {debugData?.vehiculos?.data?.length || 0}</div>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(debugData?.vehiculos?.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
