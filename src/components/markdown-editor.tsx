import Editor, { OnMount } from '@monaco-editor/react'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  onCursorChange?: (lineNumber: number) => void
}

export default function MarkdownEditor({ value, onChange, onCursorChange }: MarkdownEditorProps) {
  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '')
  }

  const handleEditorMount: OnMount = (editor) => {
    // 커서 위치 변경 시 호출
    editor.onDidChangeCursorPosition((e) => {
      if (onCursorChange) {
        onCursorChange(e.position.lineNumber)
      }
    })
  }

  return (
    <div className="h-full">
      <Editor
        height="100%"
        defaultLanguage="markdown"
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorMount}
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
