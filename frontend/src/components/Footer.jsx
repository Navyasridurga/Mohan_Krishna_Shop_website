import CallButton from './CallButton';
import WhatsAppButton from './WhatsAppButton';
import MapButton from './MapButton';

export default function Footer() {
  return (
    <footer className="bg-teal-900 text-cream">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <h3 className="font-display text-xl font-bold text-mango-400">Mohan Krishna Juice & Fried Rice</h3>
          <p className="mt-2 text-sm text-cream/80">
            Fresh juices, fresh fruit and hot fried rice, made to order every day in Ramachandrapuram.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold text-lime-400">Visit or order</h4>
          <p className="mt-2 text-sm text-cream/80">Ramachandrapuram, Andhra Pradesh</p>
          <p className="text-sm text-cream/80">Open daily, 10:00 AM - 10:00 PM</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <CallButton className="btn-primary !px-4 !py-2 text-sm" />
            <WhatsAppButton className="btn-secondary !px-4 !py-2 text-sm" />
            <MapButton className="btn-outline !px-4 !py-2 text-sm !border-cream !text-cream hover:!bg-cream hover:!text-teal-900" />
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold text-lime-400">Quick links</h4>
          <ul className="mt-2 space-y-1 text-sm text-cream/80">
            <li><a href="/menu" className="hover:text-mango-400">Menu</a></li>
            <li><a href="/about" className="hover:text-mango-400">About the shop</a></li>
            <li><a href="/contact" className="hover:text-mango-400">Contact</a></li>
            <li><a href="/admin/login" className="hover:text-mango-400">Admin login</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 px-4 py-4 text-center text-xs text-cream/60">
        &copy; {new Date().getFullYear()} Mohan Krishna Juice & Fried Rice. All rights reserved.
      </div>
    </footer>
  );
}
