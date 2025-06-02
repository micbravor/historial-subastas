"use client"

import { useState, useEffect } from "react"
import { supabase, CURRENT_POSTOR_ID } from "@/lib/supabase"

export type AuctionDetails = {
  id_subasta: string
  titulo: string
  descripcion: string
  estado: string
  inicio: string
  fin: string
  precio_base: number
  monto_minimo_puja: number
  cantidad_max_participantes: number
  motivo_cancelacion?: string
  vehiculo: {
    ficha: string
    modelo: string
    anio: number
    descripcion: string
    imagen_url: string | null
  }
  participantes_count: number
  pujas_count: number
  monto_final?: number
  mis_pujas: Array<{
    id_puja: string
    monto: number
    fecha: string
    hora: string
  }>
  pujas_recientes?: Array<{
    id_puja: string
    monto: number
    fecha: string
    hora: string
  }>
  ganador?: {
    nombre?: string
    primer_apellido?: string
  }
}

const ESTADOS_PERMITIDOS = ["expirada", "activa", "finalizada", "cancelada"] as const

export function useAuctionDetails(auctionId: string | null) {
  const [auction, setAuction] = useState<AuctionDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!auctionId) {
      setAuction(null)
      return
    }

    async function fetchAuctionDetails() {
      try {
        setLoading(true)
        setError(null)

        // SEGURIDAD: Verificar que el postor está inscrito en esta subasta
        const { data: participaData, error: participaError } = await supabase
          .from("participa")
          .select("id_subasta")
          .eq("id_postor", CURRENT_POSTOR_ID)
          .eq("id_subasta", auctionId)
          .single()

        if (participaError || !participaData) {
          throw new Error("No tienes permisos para ver esta subasta")
        }

        // Obtener detalles completos de la subasta
        const { data: subastaData, error: subastaError } = await supabase
          .from("subasta")
          .select(`
            id_subasta,
            titulo,
            descripcion,
            estado,
            inicio,
            fin,
            precio_base,
            monto_minimo_puja,
            cantidad_max_participantes,
            motivo_cancelacion,
            vehiculo (
              ficha,
              modelo,
              anio,
              descripcion,
              imagen_url
            )
          `)
          .eq("id_subasta", auctionId)
          .single()

        if (subastaError) {
          throw new Error("Error al obtener detalles de la subasta: " + subastaError.message)
        }

        // SEGURIDAD: Validar estado permitido
        const estadoLower = subastaData.estado?.toLowerCase()
        if (!ESTADOS_PERMITIDOS.includes(estadoLower as any)) {
          throw new Error("No tienes permisos para ver esta subasta")
        }

        // Contar participantes
        const { count: participantesCount } = await supabase
          .from("participa")
          .select("id_postor", { count: "exact", head: true })
          .eq("id_subasta", auctionId)

        // Contar pujas totales
        const { count: pujasCount } = await supabase
          .from("puja")
          .select("id_puja", { count: "exact", head: true })
          .eq("id_subasta", auctionId)

        // Obtener mis pujas
        const { data: misPujasData } = await supabase
          .from("puja")
          .select("id_puja, monto, fecha, hora")
          .eq("id_subasta", auctionId)
          .eq("id_postor", CURRENT_POSTOR_ID)
          .order("fecha", { ascending: false })
          .order("hora", { ascending: false })

        // Verificar adjudicación
        const { data: adjudicacionData } = await supabase
          .from("adjudicacion")
          .select("monto_final, id_postor")
          .eq("id_subasta", auctionId)
          .maybeSingle()

        // Inicializar variables para información específica según el estado
        let pujasRecientesData: Array<{
          id_puja: string
          monto: number
          fecha: string
          hora: string
        }> = []

        let ganadorData: { nombre?: string; primer_apellido?: string } | undefined = undefined

        // Si la subasta está activa, obtener pujas recientes
        if (estadoLower === "activa") {
          const { data: pujasRecientesResult } = await supabase
            .from("puja")
            .select("id_puja, monto, fecha, hora")
            .eq("id_subasta", auctionId)
            .order("fecha", { ascending: false })
            .order("hora", { ascending: false })
            .limit(5)

          pujasRecientesData = pujasRecientesResult || []
        }

        // Si la subasta está finalizada, obtener información del ganador
        if (estadoLower === "finalizada" && adjudicacionData?.id_postor) {
          const { data: ganadorResult } = await supabase
            .from("postor")
            .select(`
              usuario (
                nombre,
                primer_apellido
              )
            `)
            .eq("id_postor", adjudicacionData.id_postor)
            .maybeSingle()

          if (ganadorResult?.usuario) {
            ganadorData = {
              nombre: ganadorResult.usuario.nombre,
              primer_apellido: ganadorResult.usuario.primer_apellido,
            }
          }
        }

        const auctionDetails: AuctionDetails = {
          ...subastaData,
          participantes_count: participantesCount || 0,
          pujas_count: pujasCount || 0,
          monto_final: adjudicacionData?.monto_final,
          mis_pujas: misPujasData || [],
          pujas_recientes: pujasRecientesData.length > 0 ? pujasRecientesData : undefined,
          ganador: ganadorData,
          vehiculo: subastaData.vehiculo || {
            ficha: "",
            modelo: "Desconocido",
            anio: 0,
            descripcion: "",
            imagen_url: null,
          },
        }

        setAuction(auctionDetails)
      } catch (err: any) {
        console.error("Error al cargar detalles de la subasta:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAuctionDetails()
  }, [auctionId])

  return { auction, loading, error }
}
