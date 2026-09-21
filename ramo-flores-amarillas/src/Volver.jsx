// Botón "Volver" fijo en la esquina superior izquierda.
export default function Volver({ onClick, foco }) {
  return (
    <button type="button" className="volver entra" onClick={onClick} data-foco={foco ? '' : undefined}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M15 5l-7 7 7 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Volver
    </button>
  );
}
