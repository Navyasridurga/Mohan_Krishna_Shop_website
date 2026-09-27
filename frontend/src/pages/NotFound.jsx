import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="text-5xl">🍹</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-teal-900">Page not found</h1>
      <p className="mt-2 text-teal-800/70">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary mt-6">
        Back to Home
      </Link>
    </div>
  );
}
