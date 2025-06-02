"use client"

import { ArrowLeft, Calendar, Users, Gavel, Car, DollarSign, AlertTriangle, Trophy, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuctionDetails } from "@/hooks/use-auction-details"
import { formatCurrency } from "@/lib/utils"

interface AuctionDetailsProps {
  auctionId: string
  onBack: () => void
}

export function AuctionDetails({ auctionId, onBack }: AuctionDetailsProps) {
  const { auction, loading, error } = useAuctionDetails(auctionId)

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getEstadoBadge = (estado: string) => {
    const estadoLower = estado?.toLowerCase()
    switch (estadoLower) {
      case "activa":
        return <Badge className="bg-green-100 text-green-800">Activa</Badge>
      case "finalizada":
        return <Badge className="bg-blue-100 text-blue-800">Finalizada</Badge>
      case "cancelada":
        return <Badge className="bg-red-100 text-red-800">Cancelada</Badge>
      case "expirada":
        return <Badge className="bg-gray-100 text-gray-800">Expirada</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{estado}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-600">Cargando detalles de la subasta...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 py-8">
          <Button onClick={onBack} className="mb-4 bg-red-600 hover:bg-red-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-semibold">Error al cargar detalles</h3>
            </div>
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 py-8">
          <Button onClick={onBack} className="mb-4 bg-red-600 hover:bg-red-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div className="bg-gray-50 border border-gray-200 p-8 rounded-lg text-center">
            <p className="text-gray-500">No se encontraron detalles de la subasta.</p>
          </div>
        </div>
      </div>
    )
  }

  const estadoLower = auction.estado?.toLowerCase()

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 py-8">
        <Button onClick={onBack} className="mb-6 bg-red-600 hover:bg-red-700">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al historial
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Título y estado */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-2xl">{auction.titulo}</CardTitle>
                  {getEstadoBadge(auction.estado)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{auction.descripcion}</p>

                {/* Información específica según el estado */}
                {estadoLower === "cancelada" && auction.motivo_cancelacion && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-red-700 text-sm">
                      <strong>Motivo de cancelación:</strong> {auction.motivo_cancelacion}
                    </p>
                  </div>
                )}

                {estadoLower === "finalizada" && auction.ganador && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded flex items-center">
                    <Trophy className="w-5 h-5 text-green-600 mr-2" />
                    <div>
                      <p className="text-green-700 text-sm font-medium">Subasta finalizada exitosamente</p>
                      <p className="text-green-700 text-sm">
                        Ganador: {auction.ganador.nombre} {auction.ganador.primer_apellido}
                      </p>
                    </div>
                  </div>
                )}

                {estadoLower === "expirada" && (
                  <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded flex items-center">
                    <Clock className="w-5 h-5 text-gray-600 mr-2" />
                    <p className="text-gray-700 text-sm">Esta subasta ha expirado sin adjudicación.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Información del vehículo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Información del Vehículo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    {auction.vehiculo.imagen_url ? (
                      <img
                        src={auction.vehiculo.imagen_url || "/placeholder.svg"}
                        alt={`${auction.vehiculo.modelo} ${auction.vehiculo.anio}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Car className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p>
                      <strong>Modelo:</strong> {auction.vehiculo.modelo}
                    </p>
                    <p>
                      <strong>Año:</strong> {auction.vehiculo.anio}
                    </p>
                    <p>
                      <strong>Descripción:</strong> {auction.vehiculo.descripcion || "No disponible"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sección de Pujas - Siempre visible */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="w-5 h-5" />
                  Pujas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Mis pujas */}
                {auction.mis_pujas.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Mis pujas ({auction.mis_pujas.length})</h3>
                    <div className="space-y-2">
                      {auction.mis_pujas.map((puja, index) => (
                        <div key={puja.id_puja} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <div>
                            <p className="font-semibold">{formatCurrency(puja.monto)}</p>
                            <p className="text-sm text-gray-600">{formatDate(`${puja.fecha}T${puja.hora}`)}</p>
                          </div>
                          {index === 0 && <Badge className="bg-blue-100 text-blue-800">Más reciente</Badge>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pujas recientes (solo en subastas activas) */}
                {estadoLower === "activa" && auction.pujas_recientes && auction.pujas_recientes.length > 0 && (
                  <div className={auction.mis_pujas.length > 0 ? "mt-4" : ""}>
                    <h3 className="text-sm font-medium mb-2">Pujas recientes de otros participantes</h3>
                    <div className="space-y-2">
                      {auction.pujas_recientes.map((puja) => (
                        <div key={puja.id_puja} className="flex justify-between items-center p-3 bg-blue-50 rounded">
                          <div>
                            <p className="font-semibold">{formatCurrency(puja.monto)}</p>
                            <p className="text-sm text-gray-600">{formatDate(`${puja.fecha}T${puja.hora}`)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mensaje cuando no hay pujas */}
                {auction.mis_pujas.length === 0 &&
                  (!auction.pujas_recientes || auction.pujas_recientes.length === 0) && (
                    <div className="text-center py-8">
                      <Gavel className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 mb-1">No hay pujas registradas en esta subasta</p>
                      <p className="text-sm text-gray-400">
                        {estadoLower === "activa"
                          ? "Sé el primero en participar"
                          : "Esta subasta no recibió pujas durante su período activo"}
                      </p>
                    </div>
                  )}

                {/* Información adicional según el estado */}
                {estadoLower === "cancelada" && auction.mis_pujas.length > 0 && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded">
                    <p className="text-orange-700 text-sm">
                      <strong>Nota:</strong> Las pujas realizadas en esta subasta fueron canceladas y no tienen validez.
                    </p>
                  </div>
                )}

                {estadoLower === "expirada" && auction.mis_pujas.length > 0 && (
                  <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded">
                    <p className="text-gray-700 text-sm">
                      <strong>Nota:</strong> Esta subasta expiró sin alcanzar el precio de reserva o sin adjudicación.
                    </p>
                  </div>
                )}

                {estadoLower === "finalizada" && auction.mis_pujas.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-blue-700 text-sm">
                      <strong>Nota:</strong> Esta subasta ha finalizado.
                      {auction.monto_final &&
                        ` El monto final de adjudicación fue ${formatCurrency(auction.monto_final)}.`}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            {/* Información de la subasta */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Información de Subasta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Precio base</p>
                  <p className="font-semibold">{formatCurrency(auction.precio_base)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monto mínimo de puja</p>
                  <p className="font-semibold">{formatCurrency(auction.monto_minimo_puja)}</p>
                </div>
                {auction.monto_final && (
                  <div>
                    <p className="text-sm text-gray-600">Monto final</p>
                    <p className="font-semibold text-green-600">{formatCurrency(auction.monto_final)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Fechas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Fechas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Inicio</p>
                  <p className="font-semibold">{formatDate(auction.inicio)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fin</p>
                  <p className="font-semibold">{formatDate(auction.fin)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Estadísticas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Estadísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Participantes</p>
                  <p className="font-semibold">
                    {auction.participantes_count} / {auction.cantidad_max_participantes}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
