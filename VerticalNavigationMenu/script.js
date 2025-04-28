// Get elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const dueDateInput = document.getElementById('due-date-input');
const dueTimeInput = document.getElementById('due-time-input');
const prioritySelect = document.getElementById('priority-select');
const recurringSelect = document.getElementById('recurring-select');
const taskList = document.getElementById('task-list');
const searchInput = document.getElementById('search-input');
const noteInput = document.getElementById('note-input');
const noteFolderSelect = document.getElementById('note-folder-select');
const noteTagInput = document.getElementById('note-tag-input');
const saveNoteBtn = document.getElementById('save-note-btn');
const noteList = document.getElementById('note-list');
const reminderSelect = document.getElementById('reminder-select');

// Task array
let tasks = [];

// Note array
let notes = [];

// Add event listeners
taskForm.addEventListener('submit', addTask);
saveNoteBtn.addEventListener('click', saveNote);
reminderSelect.addEventListener('change', setReminder);
searchInput.addEventListener('input', searchTasks);

// Function to add task
function addTask(e) {
  e.preventDefault();
  const task = {
    text: taskInput.value.trim(),
    dueDate: dueDateInput.value,
    dueTime: dueTimeInput.value,
    priority: prioritySelect.value,
    recurring: recurringSelect.value
  };
  tasks.push(task);
  displayTasks();
  taskInput.value = '';
  dueDateInput.value = '';
  dueTimeInput.value = '';
}

// Function to display tasks
function displayTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const taskListItem = document.createElement('li');
    taskListItem.innerHTML = `
      <span>${task.text}</span>
      <span>Due: ${task.dueDate} ${task.dueTime}</span>
      <span>Priority: ${task.priority}</span>
      <span>Recurring: ${task.recurring}</span>
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    `;
    taskListItem.querySelector('.edit-btn').addEventListener('click', () => editTask(index));
    taskListItem.querySelector('.delete-btn').addEventListener('click', () => deleteTask(index));
    taskList.appendChild(taskListItem);
  });
}

// Function to edit task
function editTask(index) {
  const task = tasks[index];
  taskInput.value = task.text;
  dueDateInput.value = task.dueDate;
  dueTimeInput.value = task.dueTime;
  prioritySelect.value = task.priority;
  recurringSelect.value = task.recurring;
  tasks.splice(index, 1);
  displayTasks();
}

// Function to delete task
function deleteTask(index) {
  tasks.splice(index, 1);
  displayTasks();
}

// Function to save note
function saveNote() {
  const note = {
    text: noteInput.value.trim(),
    folder: noteFolderSelect.value,
    tags: noteTagInput.value.trim().split(',')
  };
  notes.push(note);
  displayNotes();
  noteInput.value = '';
  noteTagInput.value = '';
}

// Function to display notes
function displayNotes() {
  noteList.innerHTML = '';
  notes.forEach((note, index) => {
    const noteListItem = document.createElement('li');
    noteListItem.innerHTML = `
      <span>${note.text}</span>
      <span>Folder: ${note.folder}</span>
      <span>Tags: ${note.tags.join(', ')}</span>
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    `;
    noteListItem.querySelector('.edit-btn').addEventListener('click', () => editNote(index));
    noteListItem.querySelector('.delete-btn').addEventListener('click', () => deleteNote(index));
    noteList.appendChild(noteListItem);
  });
}

// Function to edit note
function editNote(index) {
  const note = notes[index];
  noteInput.value = note.text;
  noteFolderSelect.value = note.folder;
  noteTagInput.value = note.tags.join(',');
  notes.splice(index, 1);
  displayNotes();
}

// Function to delete note
function deleteNote(index) {
  notes.splice(index, 1);
  displayNotes();
}

// Function to set reminder
function setReminder() {
  const reminderTime = reminderSelect.value;
  // Implement reminder logic here
}

// Function to search tasks
function searchTasks() {
  const searchQuery = searchInput.value.toLowerCase();
  const filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(searchQuery));
  taskList.innerHTML = '';
  filteredTasks.forEach((task, index) => {
    const taskListItem = document.createElement('li');
    taskListItem.textContent = task.text;
    taskList.appendChild(taskListItem);
  });
}