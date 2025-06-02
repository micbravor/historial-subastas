"use client"

import { useState } from "react"
import { BrowserFrame } from "@/components/browser-frame"
import { Header } from "@/components/header"
import { AuctionList } from "@/components/auction-list"
import { AuctionDetails } from "@/components/auction-details"
import { BackgroundCircles } from "@/components/background-circles"

export default function Home() {
  const [selectedAuctionId, setSelectedAuctionId] = useState<string | null>(null)

  const handleViewDetails = (auctionId: string) => {
    setSelectedAuctionId(auctionId)
  }

  const handleBackToList = () => {
    setSelectedAuctionId(null)
  }

  return (
    <BrowserFrame>
      <div className="min-h-screen bg-white relative overflow-hidden">
        <BackgroundCircles />
        <Header />

        {selectedAuctionId ? (
          <AuctionDetails auctionId={selectedAuctionId} onBack={handleBackToList} />
        ) : (
          <main className="container mx-auto px-4 py-8 relative z-10">
            <h1 className="text-3xl font-bold text-center mb-8">Historial de subastas</h1>
            <AuctionList onViewDetails={handleViewDetails} />
          </main>
        )}
      </div>
    </BrowserFrame>
  )
}
