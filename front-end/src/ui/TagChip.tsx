type TagChipProps = {
  label: string
}

export function TagChip({ label }: TagChipProps) {
  return (
    <button
      type="button"
      className="inline-flex shrink-0 items-center rounded-full bg-[linear-gradient(135deg,rgba(230,0,126,0.14),rgba(255,122,55,0.10))] px-4 py-2 text-xs font-semibold text-[var(--sw-text-strong)] ring-1 ring-black/5 hover:brightness-95 active:brightness-90"
    >
      {label}
    </button>
  )
}

