import Editor from '@monaco-editor/react'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '')
  }

  return (
    <div className="h-full">
      <Editor
        height="100%"
        defaultLanguage="markdown"
        value={value}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  )
}
