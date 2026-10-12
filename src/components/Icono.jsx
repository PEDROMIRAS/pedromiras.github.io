// Icono decorativo del archivo public/assets/img/iconos.svg (un <symbol> por icono)
export default function Icono({ nombre }) {
  return (
    <svg className="icono" aria-hidden="true">
      <use href={`./assets/img/iconos.svg#${nombre}`} />
    </svg>
  );
}
