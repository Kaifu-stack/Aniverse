export default function SkeletonCard({ size = 'md' }) {
  const widths = { sm: 'w-36', md: 'w-44 sm:w-48', lg: 'w-52 sm:w-56' }
  return (
    <div className={`${widths[size]} shrink-0`}>
      <div className="skeleton rounded-xl aspect-[2/3]" />
      <div className="mt-2 space-y-1.5 px-1">
        <div className="skeleton h-3.5 rounded w-4/5" />
        <div className="skeleton h-3 rounded w-1/2" />
      </div>
    </div>
  )
}
