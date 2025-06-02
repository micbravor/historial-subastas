"use client"

import { AuctionCard } from "./auction-card"
import { useAuctionHistory } from "@/hooks/use-auction-history"
import { Loader2, AlertCircle } from "lucide-react"

interface AuctionListProps {
  onViewDetails: (auctionId: string) => void
}

export function AuctionList({ onViewDetails }: AuctionListProps) {
  const { auctions, loading, error } = useAuctionHistory()

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-red-600 animate-spin mx-auto mb-2" />
          <p className="text-gray-600">Conectando a la base de datos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-5 h-5" />
          <h3 className="font-semibold">Error de conexión a la base de datos</h3>
        </div>
        <p className="text-sm mb-4">{error}</p>
        <div className="text-xs bg-red-100 p-3 rounded border">
          <p className="font-medium mb-1">Para solucionar este error:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Verifica que las credenciales de Supabase estén configuradas en lib/supabase.ts</li>
            <li>Asegúrate de que el CURRENT_POSTOR_ID sea válido</li>
            <li>Revisa la consola del navegador para más detalles</li>
          </ol>
        </div>
      </div>
    )
  }

  if (auctions.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 p-8 rounded-lg text-center">
        <p className="text-gray-500 mb-2">No se encontraron subastas para este postor.</p>
        <p className="text-sm text-gray-400">
          Verifica que el ID del postor sea correcto y que tenga participaciones en la base de datos.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {auctions.map((auction) => (
        <AuctionCard key={auction.id_subasta} auction={auction} onViewDetails={onViewDetails} />
      ))}
    </div>
  )
}
