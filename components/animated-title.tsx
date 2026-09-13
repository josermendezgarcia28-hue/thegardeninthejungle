import { cn } from '@/lib/utils'

type AnimatedTitleProps = {
  text: string
  className?: string
}

export function AnimatedTitle({ text, className }: AnimatedTitleProps) {
  const words = text.split(' ')

  return (
    <h1 aria-label={text} className={cn('jungle-title', className)}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          aria-hidden="true"
          className="jungle-title-word"
          style={{ '--enter-delay': `${index * 0.13}s` } as React.CSSProperties}
        >
          <span className="jungle-title-word-inner">{word}</span>
        </span>
      ))}
    </h1>
  )
}
