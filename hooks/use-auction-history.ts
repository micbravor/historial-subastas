"use client"

import { useState, useEffect } from "react"
import { supabase, CURRENT_POSTOR_ID } from "@/lib/supabase"

export type AuctionWithDetails = {
  id_subasta: string
  titulo: string
  estado: string
  inicio: string
  fin: string
  monto_final?: number
  participantes_count: number
  pujas_count: number
  vehiculo: {
    modelo: string
    anio: number
    imagen_url: string | null
  }
  descripcion?: string
}

// Estados permitidos para visualización por seguridad (en minúsculas para comparación)
const ESTADOS_PERMITIDOS = ["expirada", "activa", "finalizada", "cancelada"] as const
type EstadoPermitido = (typeof ESTADOS_PERMITIDOS)[number]

export function useAuctionHistory() {
  const [auctions, setAuctions] = useState<AuctionWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAuctionHistory() {
      try {
        setLoading(true)

        // Verificar que tenemos un ID de postor válido
        if (!CURRENT_POSTOR_ID || CURRENT_POSTOR_ID === "ID_REAL_DEL_POSTOR") {
          throw new Error("ID del postor no configurado. Por favor configura CURRENT_POSTOR_ID en lib/supabase.ts")
        }

        // 1. SEGURIDAD: Solo obtenemos subastas donde el postor está inscrito
        const { data: participaData, error: participaError } = await supabase
          .from("participa")
          .select("id_subasta")
          .eq("id_postor", CURRENT_POSTOR_ID)

        if (participaError) {
          throw new Error("Error al obtener participaciones: " + participaError.message)
        }

        if (!participaData || participaData.length === 0) {
          setAuctions([])
          setLoading(false)
          return
        }

        const subastaIds = participaData.map((p) => p.id_subasta)

        // 2. SEGURIDAD: Solo obtenemos subastas con estados permitidos Y donde el usuario participa
        const { data: subastasData, error: subastasError } = await supabase
          .from("subasta")
          .select(`
            id_subasta,
            titulo,
            descripcion,
            estado,
            inicio,
            fin,
            ficha
          `)
          .in("id_subasta", subastaIds)

        if (subastasError) {
          throw new Error("Error al obtener subastas: " + subastasError.message)
        }

        if (!subastasData || subastasData.length === 0) {
          setAuctions([])
          setLoading(false)
          return
        }

        // 3. Obtenemos la información de vehículos por separado
        const fichas = subastasData.map((s) => s.ficha).filter(Boolean)

        const { data: vehiculosData, error: vehiculosError } = await supabase
          .from("vehiculo")
          .select("ficha, modelo, anio, imagen_url")
          .in("ficha", fichas)

        if (vehiculosError) {
          console.error("Error al obtener vehículos:", vehiculosError)
        }

        // 4. Combinamos la información y aplicamos filtros de seguridad
        const auctionsWithDetails = await Promise.all(
          subastasData.map(async (subasta) => {
            // Verificar estado permitido
            const estadoLower = subasta.estado?.toLowerCase() || ""
            const estadoPermitido = ESTADOS_PERMITIDOS.includes(estadoLower as any)

            if (!estadoPermitido) {
              return null
            }

            // Buscar vehículo correspondiente
            const vehiculo = vehiculosData?.find((v) => v.ficha === subasta.ficha) || {
              modelo: "Desconocido",
              anio: 0,
              imagen_url: null,
            }

            // Contar participantes
            const { count: participantesCount } = await supabase
              .from("participa")
              .select("id_postor", { count: "exact", head: true })
              .eq("id_subasta", subasta.id_subasta)

            // Contar pujas
            const { count: pujasCount } = await supabase
              .from("puja")
              .select("id_puja", { count: "exact", head: true })
              .eq("id_subasta", subasta.id_subasta)

            // Verificar adjudicación
            const { data: adjudicacionData } = await supabase
              .from("adjudicacion")
              .select("monto_final")
              .eq("id_subasta", subasta.id_subasta)
              .maybeSingle()

            return {
              ...subasta,
              monto_final: adjudicacionData?.monto_final,
              participantes_count: participantesCount || 0,
              pujas_count: pujasCount || 0,
              vehiculo,
            }
          }),
        )

        // Filtrar nulls (subastas con estados no permitidos)
        const auctionsFiltered = auctionsWithDetails.filter((auction) => auction !== null)

        setAuctions(auctionsFiltered)
        setLoading(false)
      } catch (err: any) {
        console.error("Error al cargar historial de subastas:", err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchAuctionHistory()
  }, [])

  return { auctions, loading, error }
}
