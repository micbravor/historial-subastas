import type React from "react"
import { ArrowLeft, ArrowRight, RefreshCw, Info } from "lucide-react"

interface BrowserFrameProps {
  children: React.ReactNode
  title?: string
}

export function BrowserFrame({ children, title = "Page title" }: BrowserFrameProps) {
  return (
    <div className="flex flex-col border border-gray-300 rounded-lg overflow-hidden shadow-lg">
      <div className="bg-gray-100 p-2 border-b border-gray-300">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="text-center flex-1 text-sm font-medium">{title}</div>
        </div>
      </div>
      <div className="bg-gray-100 p-2 border-b border-gray-300 flex items-center space-x-2">
        <ArrowLeft className="w-4 h-4 text-gray-500" />
        <ArrowRight className="w-4 h-4 text-gray-500" />
        <RefreshCw className="w-4 h-4 text-gray-500" />
        <div className="flex-1 bg-white border border-gray-300 rounded px-2 py-1 text-sm flex items-center">
          <span className="text-gray-500 mr-1">https://</span>
          <span className="truncate"></span>
        </div>
        <Info className="w-4 h-4 text-gray-500" />
      </div>
      <div className="flex-1 bg-white">{children}</div>
    </div>
  )
}
