import { useEffect, useState } from 'react'
import { Marp } from '@marp-team/marp-core'

interface PresentationPreviewProps {
  markdown: string
  theme?: string
}

export default function PresentationPreview({ markdown, theme = 'default' }: PresentationPreviewProps) {
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
  }, [markdown, theme])

  return (
    <div className="h-full bg-gray-50 overflow-auto p-8">
      <style>{css}</style>
      <style>{`
        .marp-preview section {
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          margin-bottom: 2rem;
          border-radius: 0.5rem;
          overflow: hidden;
        }
      `}</style>
      <div
        className="marp-preview"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
