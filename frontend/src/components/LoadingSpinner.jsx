export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-teal-800" role="status">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-mango-400 border-t-transparent" />
      <p className="font-medium">{label}</p>
    </div>
  );
}
