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
    <div className="flex items-center gap-2">
      <label htmlFor="theme-select" className="text-sm font-medium text-white">
        테마:
      </label>
      <select
        id="theme-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-1.5 text-sm border border-white/20 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white bg-white/10 text-white backdrop-blur-sm cursor-pointer"
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
