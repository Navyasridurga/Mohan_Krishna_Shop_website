export default function EmptyState({ icon = '🍽️', title = 'Nothing here yet', subtitle }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-2 py-16 text-center text-teal-800">
      <p className="text-4xl">{icon}</p>
      <p className="font-display text-lg font-semibold">{title}</p>
      {subtitle && <p className="text-sm text-teal-800/70">{subtitle}</p>}
    </div>
  );
}
