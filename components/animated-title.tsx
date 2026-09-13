import { cn } from '@/lib/utils'

type AnimatedTitleProps = {
  text: string
  className?: string
}

export function AnimatedTitle({ text, className }: AnimatedTitleProps) {
  const words = text.split(' ')

  return (
    <h1 className={cn('jungle-title', className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="jungle-title">
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="jungle-title-word"
            style={{ '--enter-delay': `${index * 0.13}s` } as React.CSSProperties}
          >
            {word}
          </span>
        ))}
      </span>
    </h1>
  )
}
