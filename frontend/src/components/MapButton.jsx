const mapsUrl =
  import.meta.env.VITE_GOOGLE_MAPS_URL ||
  'https://maps.google.com/?q=Mohan+Krishna+Juice+and+Fried+Rice+Ramachandrapuram';

export default function MapButton({ className = '', children }) {
  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className || 'btn-outline'}
      aria-label="Get directions on Google Maps"
    >
      <span aria-hidden="true">📍</span>
      {children || 'Get Directions'}
    </a>
  );
}
