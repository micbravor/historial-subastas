"use client"

import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import type { AuctionWithDetails } from "@/hooks/use-auction-history"

interface AuctionProps {
  auction: AuctionWithDetails
  onViewDetails: (auctionId: string) => void
}

export function AuctionCard({ auction, onViewDetails }: AuctionProps) {
  // Formatear fechas
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getEstadoColor = (estado: string) => {
    const estadoLower = estado?.toLowerCase()
    switch (estadoLower) {
      case "activa":
        return "bg-green-100 text-green-600"
      case "finalizada":
        return "bg-blue-100 text-blue-600"
      case "cancelada":
        return "bg-red-100 text-red-600"
      case "expirada":
        return "bg-gray-100 text-gray-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <div className="flex border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="w-1/3 bg-white border-r border-gray-200 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full">
            {/* Imagen del vehículo o placeholder */}
            {auction.vehiculo.imagen_url ? (
              <img
                src={auction.vehiculo.imagen_url || "/placeholder.svg"}
                alt={`${auction.vehiculo.modelo} ${auction.vehiculo.anio}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Si la imagen falla al cargar, mostrar el placeholder con X
                  e.currentTarget.style.display = "none"
                  e.currentTarget.nextElementSibling?.classList.remove("hidden")
                }}
              />
            ) : null}

            {/* Placeholder con X cuando no hay imagen o falla la carga */}
            <div
              className={`absolute inset-0 flex items-center justify-center ${auction.vehiculo.imagen_url ? "hidden" : ""}`}
            >
              <div className="w-full h-full relative">
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="relative w-full h-full">
                      <div className="absolute top-0 left-0 h-full w-full">
                        <div className="h-full w-full flex">
                          <div className="border-t border-black w-full absolute top-1/2"></div>
                          <div className="border-r border-black h-full absolute left-1/2"></div>
                        </div>
                      </div>
                      <div className="absolute bottom-0 right-0 h-full w-full">
                        <div className="h-full w-full flex">
                          <div className="border-b border-black w-full absolute top-1/2"></div>
                          <div className="border-l border-black h-full absolute left-1/2"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Estado */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(auction.estado)}`}>
                {auction.estado || "Desconocido"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-2/3 bg-white p-3">
        <div className="flex flex-col h-full">
          <h2 className="text-lg font-bold mb-2">{auction.titulo || "Sin título"}</h2>

          <div className="space-y-1 text-xs">
            <p>
              <strong>Vehículo:</strong> {auction.vehiculo.modelo} {auction.vehiculo.anio}
            </p>
            <p>
              <strong>Fecha:</strong> {formatDate(auction.inicio)} - {formatDate(auction.fin)}
            </p>
            {auction.monto_final && (
              <p>
                <strong>Monto final:</strong> {formatCurrency(auction.monto_final)}
              </p>
            )}
          </div>

          <div className="mt-auto flex justify-end">
            <Button
              onClick={() => onViewDetails(auction.id_subasta)}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-1 text-xs px-3 py-1"
            >
              <Info className="w-3 h-3" />
              Ver detalles
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
