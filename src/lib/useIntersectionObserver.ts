'use client'

import { useEffect, useRef } from 'react'

interface Options {
  /** Fraction of the element that must be visible before animating. Default: 0.15 */
  threshold?: number
  /**
   * Skip the IntersectionObserver and add `animate-in` immediately after mount.
   * Use this for above-the-fold / hero elements that should be visible straight away.
   */
  immediate?: boolean
}

/**
 * Attaches an IntersectionObserver to the returned ref. When the element
 * crosses the viewport threshold the class `animate-in` is added, triggering
 * the CSS transition defined in globals.css (.fade-in-up, .slide-in-left,
 * .stagger-children). The observer disconnects after the first intersection so
 * the animation plays only once.
 *
 * Usage:
 *   const ref = useIntersectionObserver<HTMLDivElement>()
 *   <div ref={ref} className="fade-in-up"> … </div>
 *
 * Hero usage (immediate):
 *   const ref = useIntersectionObserver<HTMLDivElement>({ immediate: true })
 *   <div ref={ref} className="fade-in-up"> … </div>
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLElement>(
  { threshold = 0.15, immediate = false }: Options = {},
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (immediate) {
      el.classList.add('animate-in')
      return
    }

    // Guard for environments without IntersectionObserver (old browsers / jsdom).
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('animate-in')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('animate-in')
          observer.disconnect()
        }
      },
      { threshold },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [immediate, threshold])

  return ref
}
