const number = import.meta.env.VITE_WHATSAPP_NUMBER || '917386262182';

export default function WhatsAppButton({ className = '', message, children }) {
  const defaultMessage = 'Hi! I would like to order from Mohan Krishna Juice & Fried Rice.';
  const text = encodeURIComponent(message || defaultMessage);
  const href = `https://wa.me/${number}?text=${text}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className || 'btn-secondary'}
      aria-label="Order on WhatsApp"
    >
      <span aria-hidden="true">💬</span>
      {children || 'Order on WhatsApp'}
    </a>
  );
}
