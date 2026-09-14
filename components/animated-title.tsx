import { cn } from '@/lib/utils'

type AnimatedTitleProps = {
  text: string
  className?: string
  /** Decorative nodes anchored to a given word index (0-based). */
  decorations?: Record<number, React.ReactNode>
  /**
   * Visual-only replacement text for a given word index (e.g. a dotless "ı"
   * so a fungus can act as the dot). The h1 aria-label keeps the real text.
   */
  wordOverrides?: Record<number, string>
}

export function AnimatedTitle({
  text,
  className,
  decorations,
  wordOverrides,
}: AnimatedTitleProps) {
  const words = text.split(' ')

  return (
    <h1 aria-label={text} className={cn('jungle-title', className)}>
      {words.map((word, index) => {
        const decoration = decorations?.[index]
        const display = wordOverrides?.[index] ?? word
        return (
          <span
            key={`${word}-${index}`}
            aria-hidden="true"
            className={cn('jungle-title-word', decoration && 'relative')}
            style={
              { '--enter-delay': `${index * 0.13}s` } as React.CSSProperties
            }
          >
            <span className="jungle-title-word-inner">{display}</span>
            {decoration}
          </span>
        )
      })}
    </h1>
  )
}
