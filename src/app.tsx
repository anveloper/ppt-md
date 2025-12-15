import { useState } from 'react'
import MarkdownEditor from './components/markdown-editor'
import PresentationPreview from './components/presentation-preview'
import ThemeSelector from './components/theme-selector'

const defaultMarkdown = `---
marp: true
theme: default
---

# MARP Presentation Editor

Welcome to the MARP Presentation Editor!

---

## Features

- **Live Preview**: See your slides in real-time
- **Monaco Editor**: Powerful code editor
- **MARP Support**: Full MARP syntax support

---

## Getting Started

1. Edit markdown on the left
2. See live preview on the right
3. Export to PDF when ready

---

# Thank You!

Start creating your presentation now.
`

function App() {
  const [markdown, setMarkdown] = useState(defaultMarkdown)
  const [theme, setTheme] = useState('default')

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    // 마크다운의 theme 속성도 업데이트
    const updatedMarkdown = markdown.replace(/theme:\s*\w+/, `theme: ${newTheme}`)
    setMarkdown(updatedMarkdown)
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">MARP Presentation Editor</h1>
          <ThemeSelector value={theme} onChange={handleThemeChange} />
        </div>
      </header>

      {/* Editor and Preview */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Editor */}
        <div className="w-1/2 border-r border-gray-200">
          <MarkdownEditor value={markdown} onChange={setMarkdown} />
        </div>

        {/* Right: Preview */}
        <div className="w-1/2 bg-gray-50">
          <PresentationPreview markdown={markdown} theme={theme} />
        </div>
      </div>
    </div>
  )
}

export default App
