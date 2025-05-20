document.addEventListener("DOMContentLoaded", () => {
  enableInputs();
  loadSubjects();
  loadTasks();
});

function enableInputs() {
  document.getElementById("fachInput").disabled = false;
  document.querySelector(".subjects-section button").disabled = false;
  document.getElementById("taskInput").disabled = false;
  document.querySelector(".tasks-section button").disabled = false;

  document.querySelector(".subjects-section button").addEventListener("click", addSubject);
  document.querySelector(".tasks-section button").addEventListener("click", addTask);
  document.getElementById("taskInput").addEventListener("keypress", e => {
    if (e.key === "Enter") addTask();
  });
  document.getElementById("fachInput").addEventListener("keypress", e => {
    if (e.key === "Enter") addSubject();
  });
}

// ========== SUBJECT FUNCTIONS ==========

function addSubject() {
  const input = document.getElementById("fachInput");
  const name = input.value.trim();
  const error = document.getElementById("subjectErrorMsg");

  if (!name) {
    error.style.display = "block";
    setTimeout(() => (error.style.display = "none"), 3000);
    return;
  }

  const subject = { name, progress: 0 };
  renderSubject(subject);
  saveSubject(subject);
  input.value = "";
}

function renderSubject(subject) {
  const list = document.getElementById("fachListe");
  const li = document.createElement("li");
  li.style.marginBottom = "15px";

  const title = document.createElement("strong");
  title.textContent = subject.name;
  li.appendChild(title);
  li.appendChild(document.createElement("br"));

  const bar = document.createElement("progress");
  bar.value = subject.progress;
  bar.max = 100;
  bar.style.width = "200px";
  bar.style.marginRight = "10px";
  li.appendChild(bar);

  const percent = document.createElement("span");
  percent.textContent = subject.progress + "%";
  li.appendChild(percent);

  const plus = createSmallButton("+", () => {
    subject.progress = Math.min(subject.progress + 20, 100);
    bar.value = subject.progress;
    percent.textContent = subject.progress + "%";
    updateSubjectStorage();
  });

  const minus = createSmallButton("-", () => {
    subject.progress = Math.max(subject.progress - 20, 0);
    bar.value = subject.progress;
    percent.textContent = subject.progress + "%";
    updateSubjectStorage();
  });

  const remove = createSmallButton("❌", () => {
    li.remove();
    removeSubject(subject.name);
  });

  li.appendChild(plus);
  li.appendChild(minus);
  li.appendChild(remove);
  list.appendChild(li);
}

function createSmallButton(text, onClick) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.className = "small-btn";
  btn.onclick = onClick;
  return btn;
}

function saveSubject(subject) {
  const subjects = JSON.parse(localStorage.getItem("subjects")) || [];
  subjects.push(subject);
  localStorage.setItem("subjects", JSON.stringify(subjects));
}

function loadSubjects() {
  const subjects = JSON.parse(localStorage.getItem("subjects")) || [];
  subjects.forEach(renderSubject);
}

function updateSubjectStorage() {
  const subjects = [];
  document.querySelectorAll("#fachListe li").forEach(li => {
    const name = li.querySelector("strong").textContent;
    const progress = parseInt(li.querySelector("progress").value);
    subjects.push({ name, progress });
  });
  localStorage.setItem("subjects", JSON.stringify(subjects));
}

function removeSubject(name) {
  let subjects = JSON.parse(localStorage.getItem("subjects")) || [];
  subjects = subjects.filter(s => s.name !== name);
  localStorage.setItem("subjects", JSON.stringify(subjects));
}

// ========== TASK FUNCTIONS ==========

function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  const error = document.getElementById("errorMsg");

  if (!text) {
    error.style.display = "block";
    setTimeout(() => (error.style.display = "none"), 3000);
    return;
  }

  const task = { text, completed: false };
  renderTask(task);
  saveTask(task);
  input.value = "";
}

function renderTask(task) {
  const list = document.getElementById("taskList");
  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;

  const span = document.createElement("span");
  span.textContent = task.text;
  if (task.completed) {
    span.style.textDecoration = "line-through";
    span.style.color = "gray";
  }

  checkbox.onchange = () => {
    task.completed = checkbox.checked;
    span.style.textDecoration = checkbox.checked ? "line-through" : "none";
    span.style.color = checkbox.checked ? "gray" : "black";
    updateTaskStorage();
  };

  const del = createSmallButton("❌", () => {
    li.remove();
    updateTaskStorage();
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(del);
  list.appendChild(li);
}

function saveTask(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(renderTask);
}

function updateTaskStorage() {
  const listItems = document.querySelectorAll("#taskList li");
  const tasks = [];

  listItems.forEach(li => {
    const checkbox = li.querySelector("input[type='checkbox']");
    const span = li.querySelector("span");
    tasks.push({ text: span.textContent, completed: checkbox.checked });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}
