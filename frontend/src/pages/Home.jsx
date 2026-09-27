import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ReviewCard from '../components/ReviewCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { contactApi } from '../api/contactApi';

const highlights = [
  { icon: '🍊', title: 'Fresh, not frozen', text: 'Every juice is squeezed to order, with no pre-made mixes.' },
  { icon: '🔥', title: 'Cooked fresh', text: 'Fried rice and fast food are made hot, right when you order.' },
  { icon: '💸', title: 'Honest prices', text: 'Fair, transparent pricing for the whole family, every day.' },
];

export default function Home() {
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | success | error

  useEffect(() => {
    let ignore = false;
    setStatus('loading');
    contactApi
      .getReviews()
      .then((data) => {
        if (!ignore) {
          setReviews(data);
          setStatus('success');
        }
      })
      .catch(() => !ignore && setStatus('error'));
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div>
      <Hero />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((h) => (
            <div key={h.title} className="rounded-3xl bg-white p-6 text-center shadow-card">
              <p className="text-4xl">{h.icon}</p>
              <h3 className="mt-3 font-display text-lg font-bold text-teal-900">{h.title}</h3>
              <p className="mt-1 text-sm text-teal-800/80">{h.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-mango-50 py-16">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-teal-900">What's on the menu</h2>
          <p className="mt-2 text-teal-800/80">Juices, fresh fruit, fried rice and fast food - all in one place.</p>
          <Link to="/menu" className="btn-primary mt-6 inline-flex">
            Explore Full Menu
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center font-display text-3xl font-bold text-teal-900">What customers say</h2>

        <div className="mt-8">
          {status === 'loading' && <LoadingSpinner label="Loading reviews..." />}
          {status === 'error' && (
            <ErrorMessage message="Could not load reviews right now." onRetry={() => window.location.reload()} />
          )}
          {status === 'success' && reviews.length === 0 && (
            <EmptyState icon="⭐" title="No reviews yet" subtitle="Be the first to share your experience!" />
          )}
          {status === 'success' && reviews.length > 0 && (
            <div className="grid gap-6 md:grid-cols-3">
              {reviews.slice(0, 3).map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
