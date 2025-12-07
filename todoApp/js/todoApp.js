//Creacion de variables
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const filterBtns = document.querySelectorAll('.filter-btn');
const stats = document.getElementById('stats');

//Funciones
function saveTodos(){
    localStorage.setItem('todos', JSON.stringify(todos));
}

function addTodo(){
    const text = todoInput.value.trim();
    if(text === '') return;

    const todo = { //Objeto todo que vamos a guardar en localStorage
        id: Date.now(),
        text: text,
        completed: false
    };

    todos.push(todo);
    saveTodos();//Guardamos la tarea
    todoInput.value = '';//Limpiamos el campo
    renderTodos();
}

function deleteTodo(id){
    todos = todos.filter(todo => todo.id !== id);//Eliminamos el todo que tenga ese id
    saveTodos();
    renderTodos();
}

function toggleTodo(id){
    const todo = todos.find(todo => todo.id === id); 
    if(todo){
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

function renderTodos(){
    let filteredTodos = todos;

    if (currentFilter === 'active') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }

    if(filteredTodos.length === 0){
        todoList.innerHTML = '<div class="empty-state"> No hay tareas para mostrar. </div>';
    }else{
        todoList.innerHTML = filteredTodos.map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''}"> 
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo(${todo.id})">
                <span class="todo-text">${todo.text}</span>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">Eliminar</button>
            </li>    
        `).join('');
    }

    updateStats();
}

function updateStats(){
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length; 
    const active = total - completed;
    stats.textContent = `Total: ${total} | Activas: ${active} | Completadas: ${completed}`;
}

addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter'){
        addTodo();
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTodos();
    })
});

renderTodos();