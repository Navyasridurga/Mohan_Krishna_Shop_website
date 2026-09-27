export default function ErrorMessage({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl bg-papaya-500/10 px-6 py-10 text-center">
      <p className="text-4xl">⚠️</p>
      <p className="font-semibold text-papaya-600">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-outline">
          Try again
        </button>
      )}
    </div>
  );
}
