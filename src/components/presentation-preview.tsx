import { useEffect, useState } from 'react'
import { Marp } from '@marp-team/marp-core'

interface PresentationPreviewProps {
  markdown: string
}

export default function PresentationPreview({ markdown }: PresentationPreviewProps) {
  const [html, setHtml] = useState('')
  const [css, setCss] = useState('')

  useEffect(() => {
    const marp = new Marp({
      html: true,
    })

    try {
      const { html: renderedHtml, css: renderedCss } = marp.render(markdown)
      setHtml(renderedHtml)
      setCss(renderedCss)
    } catch (error) {
      console.error('MARP rendering error:', error)
    }
  }, [markdown])

  return (
    <div className="h-full bg-white overflow-auto">
      <style>{css}</style>
      <div
        className="marp-preview"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
