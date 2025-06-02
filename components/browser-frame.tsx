import type React from "react"

interface BrowserFrameProps {
  children: React.ReactNode
  title?: string
}

export function BrowserFrame({ children, title = "Page title" }: BrowserFrameProps) {
  return (
    <div className="flex flex-col overflow-hidden">
      <div className="flex-1 bg-white">{children}</div>
    </div>
  )
}
