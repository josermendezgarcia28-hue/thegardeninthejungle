import { cn } from '@/lib/utils'

/**
 * Tiny decorative medicinal-fungi SVGs anchored to the hero title letters.
 * Purely presentational (aria-hidden) and animated with CSS keyframes defined
 * in globals.css, so they respect prefers-reduced-motion automatically.
 */

// Red Reishi (Ganoderma lucidum) — glossy shelf bracket perched on "The",
// periodically releasing tiny glowing spore specks.
export function ReishiMushroom({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'hero-fungus pointer-events-none absolute -top-3 -left-1 z-10 block h-5 w-5 drop-shadow-md sm:-top-5 sm:h-8 sm:w-8',
        className,
      )}
    >
      <span className="relative block h-full w-full">
        <svg
          viewBox="0 0 40 30"
          fill="none"
          className="h-full w-full overflow-visible"
        >
          <path d="M4 22 C6 10, 32 8, 36 20 C34 25, 8 26, 4 22 Z" fill="#781d1d" />
          <path d="M6 21 C8 12, 30 11, 34 19 C31 23, 10 24, 6 21 Z" fill="#991b1b" />
          <path
            d="M9 19 C12 14, 27 13, 31 18"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path d="M4 22 C7 25, 33 24, 36 20" stroke="#fef08a" strokeWidth="1.2" />
          <path
            d="M9 23 C10 28, 12 30, 14 30"
            stroke="#451a03"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
        <span className="fungus-spore absolute top-0 right-1 h-1 w-1 rounded-full bg-amber-300 shadow-[0_0_4px_#fde047]" />
        <span className="fungus-spore-2 absolute top-1 left-1.5 h-1 w-1 rounded-full bg-amber-200 shadow-[0_0_4px_#fef08a]" />
      </span>
    </span>
  )
}

// Cordyceps militaris — slender glowing club that stands in as the dot of the
// dotless "ı" in "in", swaying gently from its planted base.
export function CordycepsSprout({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'hero-fungus pointer-events-none absolute -top-3 left-[24%] z-10 block h-6 w-3 -translate-x-1/2 drop-shadow-sm sm:-top-5 sm:h-9 sm:w-5',
        className,
      )}
    >
      <span className="fungus-sway block h-full w-full">
        <svg viewBox="0 0 24 40" fill="none" className="h-full w-full">
          <path
            d="M12 38 C11 26, 7 16, 9 6 C10 1, 15 1, 16 6 C17 14, 14 26, 13 38 Z"
            fill="url(#cordycepsGrad)"
          />
          <path
            d="M10 38 C9 30, 4 24, 6 18 C7 15, 10 15, 11 18 C11 23, 11 30, 11 38 Z"
            fill="#f97316"
            opacity="0.9"
          />
          <defs>
            <linearGradient id="cordycepsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="40%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>
          </defs>
        </svg>
      </span>
    </span>
  )
}

// Lion's Mane (Hericium erinaceus) — cascading pom-pom beside "Jungle" that
// breathes gently.
export function LionsManeFungus({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'hero-fungus pointer-events-none absolute -top-3 -left-2 z-10 block h-5 w-5 drop-shadow-sm sm:-top-5 sm:-left-3 sm:h-8 sm:w-8',
        className,
      )}
    >
      <span className="fungus-breathe block h-full w-full">
        <svg viewBox="0 0 32 32" fill="none" className="h-full w-full">
          <circle cx="16" cy="14" r="9" fill="#fefce8" />
          <path
            d="M11 16 C11 22, 12 25, 12 28"
            stroke="#fef9c3"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M14 17 C14 24, 15 27, 15 31"
            stroke="#ffffff"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M17 17 C17 24, 17 28, 18 30"
            stroke="#fef9c3"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M20 16 C21 21, 21 25, 22 27"
            stroke="#ffffff"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M8 14 C8 19, 9 22, 10 24"
            stroke="#fef08a"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </span>
  )
}

// Turkey Tail (Trametes versicolor) — layered concentric fan gripping the left
// wall of the "l" in "Jungle" and shelving out toward the "g" like bracket
// fungus on a tree trunk.
export function TurkeyTailBracket({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute top-[35%] right-[18%] z-10 block h-4 w-5 drop-shadow-md sm:right-[19%] sm:h-7 sm:w-8',
        className,
      )}
    >
      <span className="fungus-shelf block h-full w-full">
        {/* Mirrored so the root grips the letter on the right and the rings
            fan out to the left. */}
        <svg viewBox="0 0 36 28" fill="none" className="h-full w-full -scale-x-100">
          <path d="M2 26 C2 10, 34 10, 34 26 Z" fill="#292524" />
          <path d="M5 26 C5 13, 31 13, 31 26 Z" fill="#065f46" />
          <path d="M9 26 C9 16, 27 16, 27 26 Z" fill="#d97706" />
          <path d="M13 26 C13 19, 23 19, 23 26 Z" fill="#fef08a" />
          <path d="M16 26 C16 22, 20 22, 20 26 Z" fill="#44403c" />
        </svg>
      </span>
    </span>
  )
}
