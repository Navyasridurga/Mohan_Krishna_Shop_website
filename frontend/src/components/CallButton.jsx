const phone = import.meta.env.VITE_SHOP_PHONE || '+917386262182';

export default function CallButton({ className = '', children }) {
  return (
    <a href={`tel:${phone}`} className={className || 'btn-primary'} aria-label="Call the shop now">
      <span aria-hidden="true">📞</span>
      {children || 'Call Now'}
    </a>
  );
}
