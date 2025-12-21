interface ThemeSelectorProps {
  value: string
  onChange: (theme: string) => void
}

const MARP_THEMES = [
  { value: 'default', label: 'Default' },
  { value: 'gaia', label: 'Gaia' },
  { value: 'uncover', label: 'Uncover' },
]

export default function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  return (
    <div className="flex items-center gap-1.5">
      <label htmlFor="theme-select" className="text-xs text-white">
        테마:
      </label>
      <select
        id="theme-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-2 py-1 text-xs border border-white/20 rounded focus:outline-none bg-white/10 text-white cursor-pointer"
      >
        {MARP_THEMES.map((theme) => (
          <option key={theme.value} value={theme.value} className="text-gray-900">
            {theme.label}
          </option>
        ))}
      </select>
    </div>
  )
}
