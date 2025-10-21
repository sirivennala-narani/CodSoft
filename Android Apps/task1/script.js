const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
renderTasks();

addBtn.addEventListener("click", addTask);

function addTask() {
  const text = taskInput.value.trim();
  if (text === "") return;

  const task = { id: Date.now(), text, completed: false };
  tasks.push(task);
  saveTasks();
  renderTasks();
  taskInput.value = "";
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    li.innerHTML = `
      <span>${task.text}</span>
      <div class="actions">
        <button onclick="toggleTask(${task.id})">✔</button>
        <button onclick="editTask(${task.id})">✏</button>
        <button class="delete" onclick="deleteTask(${task.id})">🗑</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newText = prompt("Edit task:", task.text);
  if (newText) {
    task.text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

