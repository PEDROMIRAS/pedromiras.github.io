import { tono } from './color.js';

// Pequeño capullo cerrado: indica que hay algo que tocar. Toma el color elegido.
export default function Brote({ color }) {
  return (
    <svg className="brote-icono" viewBox="0 0 64 96" aria-hidden="true">
      <path d="M32 94 C32 76 30 66 32 52" stroke="#5FAE7A" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M31 80 C18 78 10 68 8 60 C20 60 29 68 31 80Z" fill="#5FAE7A" />
      <path d="M33 72 C46 70 54 61 56 53 C44 53 35 61 33 72Z" fill="#4E9A69" />
      <path d="M32 54 C18 52 16 32 32 12 C48 32 46 52 32 54Z" fill={color} />
      <path d="M32 54 C26 46 26 30 32 16 C38 30 38 46 32 54Z" fill={tono(color, 14)} />
    </svg>
  );
}
