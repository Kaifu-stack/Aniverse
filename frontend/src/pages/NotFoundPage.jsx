import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 hero-bg">
      <div className="animate-float">
        <p className="font-display text-9xl sm:text-[200px] text-neon/20 tracking-widest leading-none">404</p>
      </div>
      <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wide -mt-8 mb-3 glow-text">
        Lost in the Void
      </h1>
      <p className="text-muted max-w-md mb-8">
        This page wandered into another dimension. Let's get you back to the anime universe.
      </p>
      <Link to="/" className="btn-primary text-base px-8 py-3">
        Return Home
      </Link>
    </div>
  )
}
