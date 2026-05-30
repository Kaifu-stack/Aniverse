import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Infinite scroll hook using IntersectionObserver.
 * Returns a ref to attach to the sentinel element.
 */
export function useInfiniteScroll(callback, hasMore) {
  const observerRef = useRef(null)
  const sentinelRef = useRef(null)

  const observe = useCallback(() => {
    if (observerRef.current) observerRef.current.disconnect()
    if (!hasMore) return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) callback()
      },
      { rootMargin: '200px' }
    )

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current)
    }
  }, [callback, hasMore])

  useEffect(() => {
    observe()
    return () => observerRef.current?.disconnect()
  }, [observe])

  return sentinelRef
}
