"use client"

import { ChevronDown, User } from "lucide-react"
import { useState, useEffect } from "react"
import { supabase, CURRENT_POSTOR_ID } from "@/lib/supabase"

export function Header() {
  const [userName, setUserName] = useState("Nombre")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        // Verificar que tenemos un ID de postor válido
        if (!CURRENT_POSTOR_ID || CURRENT_POSTOR_ID === "ID_REAL_DEL_POSTOR") {
          console.error("ID del postor no configurado")
          setLoading(false)
          return
        }

        console.log("Buscando información del postor:", CURRENT_POSTOR_ID)

        // Obtenemos la información del postor y su usuario asociado
        const { data, error } = await supabase
          .from("postor")
          .select(`
            id_postor,
            usuario (
              nombre,
              primer_apellido
            )
          `)
          .eq("id_postor", CURRENT_POSTOR_ID)
          .maybeSingle()

        if (error) {
          console.error("Error al obtener información del postor:", error)
          throw error
        }

        console.log("Datos del postor obtenidos:", data)

        if (data && data.usuario) {
          const fullName = `${data.usuario.nombre || ""} ${data.usuario.primer_apellido || ""}`.trim()
          setUserName(fullName || "Nombre")
        } else {
          console.warn("No se encontró información del postor o usuario asociado")
          setUserName("Usuario no encontrado")
        }
      } catch (error) {
        console.error("Error al obtener información del usuario:", error)
        setUserName("Error al cargar")
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [])

  return (
    <header className="bg-white p-4 border-b border-gray-100">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-red-600">ZAAGOM</div>
        <div className="flex items-center space-x-2">
          <User className="w-6 h-6 text-gray-600" />
          <div>
            <div className="text-sm font-medium">Hola</div>
            <div className="text-sm">{loading ? "Cargando..." : userName}</div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </div>
      </div>
    </header>
  )
}
