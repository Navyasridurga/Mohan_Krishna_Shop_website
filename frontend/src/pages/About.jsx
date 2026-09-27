import CallButton from '../components/CallButton';
import MapButton from '../components/MapButton';

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="font-display text-3xl font-bold text-teal-900 md:text-4xl">About Mohan Krishna Juice & Fried Rice</h1>

      <div className="mt-6 space-y-4 text-teal-800/90">
        <p>
          Mohan Krishna Juice & Fried Rice has been serving fresh fruit juices, seasonal fruit, and hot fried
          rice to the people of Ramachandrapuram every single day. What started as a small roadside stall has
          grown into a spot locals rely on for a quick, honest meal or a cold glass of juice on a hot afternoon.
        </p>
        <p>
          We squeeze every juice to order using fruit sourced fresh each morning - no syrups, no pre-mixed
          concentrates. Our fried rice and fast food items are cooked on the spot, so what reaches you is hot,
          fresh, and made the way you'd expect from a family-run kitchen.
        </p>
        <p>
          Whether you're stopping by for a quick mosambi juice on your way to work or ordering fried rice for
          the whole family, we aim to keep it simple: fresh ingredients, fair prices, and quick service.
        </p>
      </div>

      <div className="mt-8 rounded-3xl bg-teal-900 p-8 text-cream">
        <h2 className="font-display text-xl font-bold text-mango-400">Visit us</h2>
        <p className="mt-2 text-cream/80">Ramachandrapuram, Andhra Pradesh</p>
        <p className="text-cream/80">Open daily, 10:00 AM - 10:00 PM</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <CallButton />
          <MapButton className="btn-outline !border-cream !text-cream hover:!bg-cream hover:!text-teal-900" />
        </div>
      </div>
    </div>
  );
}
