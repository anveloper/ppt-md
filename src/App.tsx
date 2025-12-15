import { useState } from 'react'
import MarkdownEditor from './components/markdown-editor'
import PresentationPreview from './components/presentation-preview'

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

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-gray-800 text-white py-4 px-6 shadow-lg">
        <h1 className="text-2xl font-bold">MARP Presentation Editor</h1>
      </header>

      {/* Editor and Preview */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Editor */}
        <div className="w-1/2 border-r border-gray-300">
          <MarkdownEditor value={markdown} onChange={setMarkdown} />
        </div>

        {/* Right: Preview */}
        <div className="w-1/2">
          <PresentationPreview markdown={markdown} />
        </div>
      </div>
    </div>
  )
}

export default App
