export default function ReviewCard({ review }) {
  return (
    <div className="flex h-full flex-col gap-3 rounded-3xl bg-white p-6 shadow-card">
      <div className="text-mango-500" aria-label={`${review.rating} out of 5 stars`}>
        {'★'.repeat(review.rating)}
        {'☆'.repeat(5 - review.rating)}
      </div>
      <p className="flex-1 text-teal-800">&ldquo;{review.comment}&rdquo;</p>
      <p className="font-display font-semibold text-teal-900">- {review.customer_name}</p>
    </div>
  );
}
