const STORAGE_KEY = 'personal-todo-list';

const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const taskCount = document.getElementById('taskCount');
const clearCompletedBtn = document.getElementById('clearCompleted');
const dateText = document.getElementById('dateText');

let tasks = loadTasks();

function formatDate() {
  const now = new Date();
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(now);
}

function loadTasks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function updateCount() {
  const remaining = tasks.filter((task) => !task.completed).length;
  taskCount.textContent = `${remaining} task${remaining === 1 ? '' : 's'} left`;
}

function renderTasks() {
  todoList.innerHTML = '';

  if (tasks.length === 0) {
    const emptyState = document.createElement('li');
    emptyState.className = 'empty-state';
    emptyState.textContent = 'No tasks yet. Add your first one!';
    todoList.appendChild(emptyState);
    updateCount();
    return;
  }

  tasks.forEach((task) => {
    const item = document.createElement('li');
    item.className = `todo-item ${task.completed ? 'completed' : ''}`;

    const main = document.createElement('div');
    main.className = 'todo-main';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', `Mark ${task.text} as complete`);
    checkbox.addEventListener('change', () => toggleTask(task.id));

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = task.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.setAttribute('aria-label', `Delete ${task.text}`);
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    main.appendChild(checkbox);
    main.appendChild(text);
    item.appendChild(main);
    item.appendChild(deleteBtn);
    todoList.appendChild(item);
  });

  updateCount();
}

function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) {
    todoInput.focus();
    return;
  }

  tasks.unshift({
    id: Date.now(),
    text: trimmed,
    completed: false,
  });

  saveTasks();
  renderTasks();
  todoInput.value = '';
  todoInput.focus();
}

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

function clearCompleted() {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
}

todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  addTask(todoInput.value);
});

clearCompletedBtn.addEventListener('click', clearCompleted);
dateText.textContent = formatDate();
renderTasks();
