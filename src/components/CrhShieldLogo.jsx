export function CrhShieldLogo({ className = '', title = 'Escudo Inteligente CRH' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 160"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="crhShieldPrimary" x1="24" y1="20" x2="126" y2="136" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1B84FF" />
          <stop offset="1" stopColor="#0F4C81" />
        </linearGradient>
        <linearGradient id="crhShieldAccent" x1="30" y1="132" x2="134" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#00C389" />
          <stop offset="1" stopColor="#1B84FF" />
        </linearGradient>
      </defs>

      <path
        d="M80 10 131 30v39c0 34-19 59-51 81C48 128 29 103 29 69V30L80 10Z"
        fill="url(#crhShieldPrimary)"
      />
      <path
        d="M80 22 121 38v31c0 28-15 49-41 68C54 118 39 97 39 69V38l41-16Z"
        fill="rgba(255,255,255,0.08)"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="2"
      />

      <circle cx="80" cy="80" r="14" fill="#FFFFFF" />
      <circle cx="80" cy="80" r="8" fill="#00C389" />

      <path d="M55 54 80 80 56 105" fill="none" stroke="#D7ECFF" strokeWidth="5" strokeLinecap="round" />
      <path d="M105 54 80 80l24 25" fill="none" stroke="#D7ECFF" strokeWidth="5" strokeLinecap="round" />

      <path d="M55 54 105 54" fill="none" stroke="url(#crhShieldAccent)" strokeWidth="4" strokeLinecap="round" />
      <path d="M56 105h48" fill="none" stroke="url(#crhShieldAccent)" strokeWidth="4" strokeLinecap="round" />

      <circle cx="55" cy="54" r="6" fill="#1B84FF" />
      <circle cx="105" cy="54" r="6" fill="#1B84FF" />
      <circle cx="56" cy="105" r="6" fill="#00C389" />
      <circle cx="104" cy="105" r="6" fill="#00C389" />
      <circle cx="80" cy="80" r="3" fill="#0F4C81" />
    </svg>
  )
}
