// Data penimpanan
let todos = [];
let currentFilter = 'all';

// DOM 
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const dateInput = document.getElementById('dateInput');
const todoList = document.getElementById('todoList');
const filterBtn = document.getElementById('filterBtn');
const filterDropdown = document.getElementById('filterDropdown');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const filterOptions = document.querySelectorAll('.filter-option');

console.log('Script loaded successfully');

// Inisialisasi saat halaman di buat
window.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, initializing app');
    loadTodos();
    renderTodos();
    console.log('Current todos:', todos);
});

// Form submit
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Form submitted');
    addTodo();
});

// Filter 
filterBtn.addEventListener('click', () => {
    filterDropdown.classList.toggle('active');
    console.log('Filter dropdown toggled');
});

// Close filter dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!filterBtn.contains(e.target) && !filterDropdown.contains(e.target)) {
        filterDropdown.classList.remove('active');
    }
});

// Filter
filterOptions.forEach(option => {
    option.addEventListener('click', () => {
        currentFilter = option.getAttribute('data-filter');
        console.log('Filter changed to:', currentFilter);
        filterDropdown.classList.remove('active');
        renderTodos();
    });
});

// HAPUS
deleteAllBtn.addEventListener('click', () => {
    if (todos.length === 0) {
        alert('No tasks to delete!');
        console.log('No tasks to delete');
        return;
    }
    
    if (confirm('Are you sure you want to delete all tasks?')) {
        todos = [];
        saveTodos();
        renderTodos();
        console.log('All tasks deleted');
    }
});

// Tambah tugas
function addTodo() {
    const taskText = todoInput.value.trim();
    const dueDate = dateInput.value;

    console.log('Attempting to add todo - Task:', taskText, 'Date:', dueDate);

    // Validsi input
    if (taskText === '') {
        alert('Please enter a task!');
        console.log('Validation failed: Empty task');
        return;
    }

    if (dueDate === '') {
        alert('Please select a date!');
        console.log('Validation failed: No date selected');
        return;
    }

    // Buat todo object
    const todo = {
        id: Date.now(),
        task: taskText,
        date: dueDate,
        completed: false
    };

    // Tambah ke array                                                                                                      
    todos.push(todo);
    console.log('Todo added successfully:', todo);
    console.log('Total todos:', todos.length);
    
    // Simpan ke localStorage
    saveTodos();

    // Bersihkan input
    todoInput.value = '';
    dateInput.value = '';

    // Membuat ulang tampilan
    renderTodos();
}

//Tampilkan daftar tugas berdasarkan filter
function renderTodos() {
    console.log('Rendering todos with filter:', currentFilter);
    
    // Filter 
    let filteredTodos = todos;
    
    if (currentFilter === 'complete') {
        filteredTodos = todos.filter(todo => todo.completed);
    } else if (currentFilter === 'incomplete') {
        filteredTodos = todos.filter(todo => !todo.completed);
    }

    console.log('Filtered todos count:', filteredTodos.length);

    // Bersihkan daftar
    todoList.innerHTML = '';

    // Cek jika kosong
    if (filteredTodos.length === 0) {
        todoList.innerHTML = '<p class="empty-message">No task found</p>';
        console.log('No tasks to display');
        return;
    }

    // Buat todo items
    filteredTodos.forEach(todo => {
        const todoItem = createTodoElement(todo);
        todoList.appendChild(todoItem);
    });
    
    console.log('Todos rendered successfully');
}

// Buat element todo
function createTodoElement(todo) {
    const todoItem = document.createElement('div');
    todoItem.className = 'todo-item';
    todoItem.setAttribute('data-id', todo.id);

    // Format date
    const formattedDate = formatDate(todo.date);

    // Status
    const statusClass = todo.completed ? 'status-complete' : 'status-incomplete';
    const statusText = todo.completed ? 'Complete' : 'Incomplete';
    const taskClass = todo.completed ? 'completed' : '';

    todoItem.innerHTML = `
        <div class="task-text ${taskClass}">${todo.task}</div>
        <div class="task-date">${formattedDate}</div>
        <div>
            <span class="status-badge ${statusClass}">${statusText}</span>
        </div>
        <div class="action-buttons">
            <button class="btn-complete" onclick="toggleComplete(${todo.id})">
                ${todo.completed ? 'Undo' : 'Done'}
            </button>
            <button class="btn-delete" onclick="deleteTodo(${todo.id})">Delete</button>
        </div>
    `;

    return todoItem;
}

// Alihkan status selesai
function toggleComplete(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        console.log('Todo status toggled - ID:', id, 'Completed:', todo.completed);
        saveTodos();
        renderTodos();
    }
}

// Hapus todo
function deleteTodo(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        todos = todos.filter(t => t.id !== id);
        console.log('Todo deleted - ID:', id);
        console.log('Remaining todos:', todos.length);
        saveTodos();
        renderTodos();
    }
}

// Format date to readable format
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Simpan todos ke localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
    console.log('Todos saved to localStorage');
}

// Muat daftar tugas dari localStorage
function loadTodos() {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
        todos = JSON.parse(savedTodos);
        console.log('Todos loaded from localStorage:', todos.length, 'items');
    } else {
        console.log('No saved todos found');
    }
}