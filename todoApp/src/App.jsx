import { useEffect, useRef, useState } from 'react';

const FILTROS = [
  { id: 'all', etiqueta: 'Todas' },
  { id: 'active', etiqueta: 'Activas' },
  { id: 'completed', etiqueta: 'Completadas' },
];

function leerTareasGuardadas() {
  try {
    const tareas = JSON.parse(localStorage.getItem('todos'));
    return Array.isArray(tareas) ? tareas : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [tareas, setTareas] = useState(leerTareasGuardadas);
  const [filtro, setFiltro] = useState('all');
  const inputRef = useRef(null);

  // Guardar en localStorage cada vez que cambian las tareas (igual que saveTodos())
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(tareas));
  }, [tareas]);

  const añadirTarea = () => {
    const texto = inputRef.current.value.trim();
    if (texto === '') return;
    setTareas((actuales) => [...actuales, { id: Date.now(), text: texto, completed: false }]);
    inputRef.current.value = '';
  };

  const eliminarTarea = (id) => {
    setTareas((actuales) => actuales.filter((t) => t.id !== id));
  };

  const alternarTarea = (id) => {
    setTareas((actuales) => actuales.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const tareasFiltradas = tareas.filter((t) => {
    if (filtro === 'active') return !t.completed;
    if (filtro === 'completed') return t.completed;
    return true;
  });

  const total = tareas.length;
  const completadas = tareas.filter((t) => t.completed).length;
  const activas = total - completadas;

  return (
    <div className="container">
      <a href="../#projects" className="volver-portfolio">
        ← Portfolio
      </a>
      <h1>Lista de Tareas</h1>

      <div className="input-container">
        <input
          type="text"
          id="todoInput"
          ref={inputRef}
          placeholder="Añade una nueva tarea..."
          onKeyPress={(e) => e.key === 'Enter' && añadirTarea()}
        />
        <button id="addBtn" onClick={añadirTarea}>
          Añadir
        </button>
      </div>

      <div className="filters">
        {FILTROS.map((f) => (
          <button
            key={f.id}
            className={`filter-btn${filtro === f.id ? ' active' : ''}`}
            onClick={() => setFiltro(f.id)}
          >
            {f.etiqueta}
          </button>
        ))}
      </div>

      <ul id="todoList">
        {tareasFiltradas.length === 0 ? (
          <div className="empty-state">No hay tareas para mostrar.</div>
        ) : (
          tareasFiltradas.map((t) => (
            <li key={t.id} className={`todo-item${t.completed ? ' completed' : ''}`}>
              <input
                type="checkbox"
                className="todo-checkbox"
                checked={t.completed}
                onChange={() => alternarTarea(t.id)}
              />
              <span className="todo-text">{t.text}</span>
              <button className="delete-btn" onClick={() => eliminarTarea(t.id)}>
                Eliminar
              </button>
            </li>
          ))
        )}
      </ul>

      <div className="stats">
        Total: {total} | Activas: {activas} | Completadas: {completadas}
      </div>
    </div>
  );
}
