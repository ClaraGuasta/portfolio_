export default function ChestIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
        <path d="M3 11V9a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v2" />
        <path d="M3 11h18v9H3Z" />
        <path d="M10.5 11v3.5h3V11" />
    </svg>
  );
}
