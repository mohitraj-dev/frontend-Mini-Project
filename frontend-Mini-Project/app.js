// =========================
// SELECT HTML ELEMENTS
// =========================

let form = document.querySelector("#task-form");

let input = document.querySelector("#task-input");

let taskList = document.querySelector("#task-list");

let totalCount = document.querySelector("#total-count");

let pendingCount = document.querySelector("#pending-count");

let completedCount = document.querySelector("#completed-count");

let progressText = document.querySelector("#progress-text");

let progressFill = document.querySelector("#progress-fill");

let emptyMessage = document.querySelector("#empty-message");

let filters = document.querySelectorAll(".filter");


// =========================
// TASK DATA
// =========================

let tasks = JSON.parse(localStorage.getItem("myTasks")) || [];

let currentFilter = "all";


// =========================
// SAVE TASKS
// =========================

function saveTasks() {

    localStorage.setItem("myTasks", JSON.stringify(tasks));

}


// =========================
// DISPLAY TASKS
// =========================

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(function(task) {

        if (currentFilter === "active") {

            return !task.completed;

        }

        if (currentFilter === "completed") {

            return task.completed;

        }

        return true;

    });


    // EMPTY MESSAGE

    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";


    // CREATE TASK ELEMENTS

    filteredTasks.forEach(function(task) {

        let li = document.createElement("div");

        li.classList.add("task-item");

        if (task.completed) {

            li.classList.add("completed");

        }


        // TASK CONTENT

        let content = document.createElement("div");

        content.classList.add("task-content");


        // CHECK BUTTON

        let checkBtn = document.createElement("button");

        checkBtn.classList.add("check-btn");

        checkBtn.textContent = task.completed ? "✓" : "";

        checkBtn.setAttribute("aria-label", "Toggle task completion");

        checkBtn.dataset.action = "toggle";

        checkBtn.dataset.id = task.id;


        // TASK TEXT

        let span = document.createElement("span");

        span.classList.add("task-text");

        span.textContent = task.text;


        // DELETE BUTTON

        let deleteBtn = document.createElement("button");

        deleteBtn.classList.add("delete-btn");

        deleteBtn.textContent = "Delete";

        deleteBtn.dataset.action = "delete";

        deleteBtn.dataset.id = task.id;


        // APPEND ELEMENTS

        content.appendChild(checkBtn);

        content.appendChild(span);

        li.appendChild(content);

        li.appendChild(deleteBtn);

        taskList.appendChild(li);

    });


    updateStats();

}


// =========================
// ADD TASK
// =========================

form.addEventListener("submit", function(event) {

    event.preventDefault();

    let taskText = input.value.trim();

    if (taskText === "") {

        return;

    }


    let newTask = {

        id: Date.now().toString() + Math.random().toString(16).slice(2),

        text: taskText,

        completed: false

    };


    tasks.push(newTask);

    saveTasks();

    renderTasks();

    input.value = "";

    input.focus();

});


// =========================
// DELETE / COMPLETE TASK
// EVENT DELEGATION
// =========================

taskList.addEventListener("click", function(event) {

    let button = event.target.closest("button[data-action]");

    if (!button || !taskList.contains(button)) {

        return;

    }

    let taskId = button.dataset.id;

    let action = button.dataset.action;


    // DELETE TASK

    if (action === "delete") {

        tasks = tasks.filter(function(task) {

            return task.id !== taskId;

        });

    }


    // COMPLETE TASK

    if (action === "toggle") {

        tasks = tasks.map(function(task) {

            if (task.id === taskId) {

                task.completed = !task.completed;

            }

            return task;

        });

    }


    saveTasks();

    renderTasks();

});


// =========================
// FILTER TASKS
// =========================

filters.forEach(function(button) {

    button.addEventListener("click", function() {

        filters.forEach(function(filter) {

            filter.classList.remove("active");

        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();

    });

});


// =========================
// UPDATE STATISTICS
// =========================

function updateStats() {

    let total = tasks.length;

    let completed = tasks.filter(function(task) {

        return task.completed;

    }).length;

    let pending = total - completed;


    // COUNTERS

    totalCount.textContent = total;

    pendingCount.textContent = pending;

    completedCount.textContent = completed;


    // PROGRESS

    let progress = total === 0
        ? 0
        : Math.round((completed / total) * 100);


    progressText.textContent = progress + "%";

    progressFill.style.width = progress + "%";

}


// =========================
// INITIAL RENDER
// =========================

renderTasks();