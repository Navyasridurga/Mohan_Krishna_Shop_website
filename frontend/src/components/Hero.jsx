import { Link } from 'react-router-dom';
import CallButton from './CallButton';
import WhatsAppButton from './WhatsAppButton';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-teal-900">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
        <div className="animate-rise-in">
          <p className="font-display text-sm font-semibold uppercase tracking-wide text-lime-400">
            Ramachandrapuram's fresh juice corner
          </p>
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-tight text-cream md:text-5xl">
            Cold-pressed juice, hot fried rice, made while you wait.
          </h1>
          <p className="mt-4 max-w-md text-cream/80">
            No syrups, no shortcuts. Just fresh fruit squeezed to order, sizzling fried rice, and fast food
            cooked fresh - open every day in Ramachandrapuram.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/menu" className="btn-primary">
              View Menu
            </Link>
            <WhatsAppButton />
            <CallButton className="btn-outline !border-cream !text-cream hover:!bg-cream hover:!text-teal-900" />
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-sm">
          <div className="absolute inset-0 rounded-[3rem] bg-mango-500/20 blur-2xl" />
          <div className="relative flex h-full w-full items-center justify-center rounded-[3rem] bg-gradient-to-br from-mango-500 via-papaya-500 to-lime-500 text-8xl shadow-card">
            🥤🍉🍛
          </div>
        </div>
      </div>
    </section>
  );
}
