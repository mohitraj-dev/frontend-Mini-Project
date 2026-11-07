// ======================================
// TASKPILOT TODO APP
// Vanilla JavaScript
// ======================================


// DOM ELEMENTS

const form = document.querySelector("#task-form");

const taskInput = document.querySelector("#task-input");

const dueDateInput = document.querySelector("#due-date");

const priorityInput = document.querySelector("#priority");

const taskList = document.querySelector("#task-list");

const searchInput = document.querySelector("#search-input");

const filters = document.querySelectorAll(".filter-button");

const emptyState = document.querySelector("#empty-state");

const emptyTitle = document.querySelector("#empty-title");

const emptyCopy = document.querySelector("#empty-copy");

const editDialog = document.querySelector("#edit-dialog");

const editForm = document.querySelector("#edit-form");

const editTaskInput = document.querySelector("#edit-task-input");

const editDueDate = document.querySelector("#edit-due-date");

const editPriority = document.querySelector("#edit-priority");

const toast = document.querySelector("#toast");


// GLOBAL VARIABLES

const STORAGE_KEY = "taskpilot-tasks-v1";

let currentFilter = "all";

let editingTaskId = null;

let toastTimer = null;


// ======================================
// CURRENT DATE
// ======================================

function getTodayISO() {

    const now = new Date();

    const local = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000
    );

    return local.toISOString().slice(0, 10);

}


function formatDate(isoDate) {

    if (!isoDate) return "";

    return new Date(isoDate + "T00:00:00").toLocaleDateString("en-IN", {

        day: "numeric",

        month: "short"

    });

}


document.querySelector("#current-date").textContent =

    new Date().toLocaleDateString("en-IN", {

        weekday: "long",

        day: "numeric",

        month: "long",

        year: "numeric"

    });


dueDateInput.min = getTodayISO();


// ======================================
// LOCAL STORAGE
// ======================================

function loadTasks() {

    try {

        const saved = JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        );

        if (!Array.isArray(saved)) return [];

        return saved

            .filter(task => task && typeof task.text === "string")

            .map(task => ({

                id: String(task.id || createId()),

                text: task.text,

                completed: Boolean(task.completed),

                priority: ["low", "medium", "high"].includes(task.priority)
                    ? task.priority
                    : "medium",

                dueDate: typeof task.dueDate === "string"
                    ? task.dueDate
                    : "",

                createdAt: Number(task.createdAt) || Date.now()

            }));

    }

    catch {

        return [];

    }

}


let tasks = loadTasks();


function saveTasks() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(tasks)
        );

    }

    catch {

        showToast("Could not save changes in this browser.");

    }

}


// ======================================
// CREATE UNIQUE ID
// ======================================

function createId() {

    return (window.crypto && crypto.randomUUID)

        ? crypto.randomUUID()

        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

}


// ======================================
// TOAST MESSAGE
// ======================================

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("is-visible");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(function() {

        toast.classList.remove("is-visible");

    }, 2400);

}


// ======================================
// CREATE BUTTON
// ======================================

function makeButton(label, className, action, id, ariaLabel) {

    const button = document.createElement("button");

    button.type = "button";

    button.className = className;

    button.textContent = label;

    button.dataset.action = action;

    button.dataset.id = id;

    button.setAttribute("aria-label", ariaLabel);

    return button;

}


// ======================================
// CHECK OVERDUE TASK
// ======================================

function isOverdue(task) {

    return Boolean(

        task.dueDate &&

        !task.completed &&

        task.dueDate < getTodayISO()

    );

}


// ======================================
// FILTER AND SORT TASKS
// ======================================

function getVisibleTasks() {

    const query = searchInput.value.trim().toLocaleLowerCase();


    return tasks

        .filter(function(task) {

            const matchesSearch =

                task.text.toLocaleLowerCase().includes(query);


            const matchesFilter =

                currentFilter === "all" ||

                (currentFilter === "active" && !task.completed) ||

                (currentFilter === "completed" && task.completed);


            return matchesSearch && matchesFilter;

        })


        .sort(function(a, b) {

            // Pending tasks first

            if (a.completed !== b.completed) {

                return Number(a.completed) - Number(b.completed);

            }


            // Priority sorting

            const priorityRank = {

                high: 0,

                medium: 1,

                low: 2

            };


            if (priorityRank[a.priority] !== priorityRank[b.priority]) {

                return priorityRank[a.priority] - priorityRank[b.priority];

            }


            // Due date sorting

            if (a.dueDate && b.dueDate) {

                return a.dueDate.localeCompare(b.dueDate);

            }


            if (a.dueDate) return -1;

            if (b.dueDate) return 1;


            return a.createdAt - b.createdAt;

        });

}


// ======================================
// RENDER TASKS
// ======================================

function renderTasks() {

    taskList.replaceChildren();


    const visibleTasks = getVisibleTasks();


    visibleTasks.forEach(function(task) {


        // TASK CONTAINER

        const item = document.createElement("article");

        item.className = `task-item${task.completed ? " is-completed" : ""}`;


        // MAIN CONTENT

        const main = document.createElement("div");

        main.className = "task-main";


        // CHECK BUTTON

        const check = makeButton(

            task.completed ? "✓" : "",

            "check-button",

            "toggle",

            task.id,

            task.completed
                ? `Mark ${task.text} as pending`
                : `Complete ${task.text}`

        );


        // TASK TEXT CONTAINER

        const copy = document.createElement("div");

        copy.className = "task-copy";


        // TASK NAME

        const name = document.createElement("span");

        name.className = "task-name";

        name.textContent = task.text;


        // TASK DETAILS

        const meta = document.createElement("div");

        meta.className = "task-meta";


        // PRIORITY

        const priority = document.createElement("span");

        priority.className = `priority-pill ${task.priority}`;

        priority.textContent = `${task.priority} priority`;

        meta.append(priority);


        // DUE DATE

        if (task.dueDate) {

            const due = document.createElement("span");

            due.className = `due-pill${isOverdue(task) ? " is-overdue" : ""}`;

            due.textContent = isOverdue(task)

                ? `Overdue · ${formatDate(task.dueDate)}`

                : `Due · ${formatDate(task.dueDate)}`;

            meta.append(due);

        }


        // APPEND TEXT

        copy.append(name, meta);

        main.append(check, copy);


        // ACTION BUTTONS

        const actions = document.createElement("div");

        actions.className = "task-actions";


        // EDIT BUTTON

        const editButton = makeButton(

            "Edit",

            "small-action",

            "edit",

            task.id,

            `Edit ${task.text}`

        );


        // DELETE BUTTON

        const deleteButton = makeButton(

            "Delete",

            "small-action delete",

            "delete",

            task.id,

            `Delete ${task.text}`

        );


        actions.append(editButton, deleteButton);


        // FINAL TASK

        item.append(main, actions);

        taskList.append(item);

    });


    // EMPTY STATE

    const noTasks = visibleTasks.length === 0;

    emptyState.classList.toggle("is-visible", noTasks);


    if (noTasks && searchInput.value.trim()) {

        emptyTitle.textContent = "No matching tasks";

        emptyCopy.textContent = "Try another search term.";

    }

    else if (noTasks && currentFilter === "completed") {

        emptyTitle.textContent = "Nothing completed yet";

        emptyCopy.textContent = "Your finished tasks will appear here.";

    }

    else if (noTasks && currentFilter === "active") {

        emptyTitle.textContent = "You're all caught up";

        emptyCopy.textContent = "There are no pending tasks. Nice work!";

    }

    else {

        emptyTitle.textContent = "Nothing on your list yet";

        emptyCopy.textContent = "Add a task and make your day count.";

    }


    // TASK SUMMARY

    document.querySelector("#list-summary").textContent =

        `${visibleTasks.length} ${visibleTasks.length === 1 ? "task" : "tasks"}`;


    updateStats();

}


// ======================================
// UPDATE STATISTICS
// ======================================

function updateStats() {

    const total = tasks.length;


    const completed = tasks.filter(function(task) {

        return task.completed;

    }).length;


    const pending = total - completed;


    // OVERDUE

    const overdue = tasks.filter(function(task) {

        return isOverdue(task);

    }).length;


    // PROGRESS

    const progress = total === 0

        ? 0

        : Math.round((completed / total) * 100);


    // UPDATE COUNTERS

    document.querySelector("#total-count").textContent = total;

    document.querySelector("#pending-count").textContent = pending;

    document.querySelector("#completed-count").textContent = completed;

    document.querySelector("#overdue-count").textContent = overdue;


    // UPDATE PROGRESS

    document.querySelector("#progress-text").textContent = progress + "%";

    document.querySelector("#progress-fill").style.width = progress + "%";


    const track = document.querySelector("#progress-track");

    track.setAttribute("aria-valuenow", String(progress));


    // PROGRESS MESSAGE

    const caption = document.querySelector("#progress-caption");


    if (total === 0) {

        caption.textContent = "Start with one small task.";

    }

    else if (progress === 100) {

        caption.textContent = "Everything is complete. Amazing work!";

    }

    else {

        caption.textContent = `${completed} of ${total} tasks completed. Keep going.`;

    }

}


// ======================================
// ADD TASK
// ======================================

form.addEventListener("submit", function(event) {

    event.preventDefault();


    const text = taskInput.value.trim();


    if (!text) {

        showToast("Please enter a task name.");

        taskInput.focus();

        return;

    }


    const newTask = {

        id: createId(),

        text: text,

        completed: false,

        priority: priorityInput.value,

        dueDate: dueDateInput.value,

        createdAt: Date.now()

    };


    tasks.push(newTask);


    saveTasks();


    // RESET FORM

    form.reset();

    priorityInput.value = "medium";

    dueDateInput.min = getTodayISO();


    // SHOW ALL TASKS

    currentFilter = "all";

    filters.forEach(function(button) {

        button.classList.toggle(

            "is-active",

            button.dataset.filter === "all"

        );

    });


    searchInput.value = "";


    renderTasks();

    taskInput.focus();

    showToast("Task added to your list.");

});


// ======================================
// TASK ACTIONS
// EVENT DELEGATION
// ======================================

taskList.addEventListener("click", function(event) {

    const button = event.target.closest("button[data-action]");


    if (!button || !taskList.contains(button)) {

        return;

    }


    const action = button.dataset.action;

    const id = button.dataset.id;


    const task = tasks.find(function(item) {

        return item.id === id;

    });


    if (!task) return;


    // COMPLETE TASK

    if (action === "toggle") {

        task.completed = !task.completed;

        saveTasks();

        renderTasks();


        showToast(

            task.completed

                ? "Task completed. Well done!"

                : "Task moved back to to-do."

        );

    }


    // DELETE TASK

    else if (action === "delete") {

        tasks = tasks.filter(function(item) {

            return item.id !== id;

        });


        saveTasks();

        renderTasks();

        showToast("Task deleted.");

    }


    // EDIT TASK

    else if (action === "edit") {

        openEditDialog(task);

    }

});


// ======================================
// OPEN EDIT MODAL
// ======================================

function openEditDialog(task) {

    editingTaskId = task.id;


    editTaskInput.value = task.text;

    editDueDate.value = task.dueDate;

    editPriority.value = task.priority;


    editDialog.showModal();

    editTaskInput.focus();

}


// ======================================
// SAVE EDITED TASK
// ======================================

editForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const task = tasks.find(function(item) {

        return item.id === editingTaskId;

    });


    const updatedText = editTaskInput.value.trim();


    if (!task || !updatedText) {

        showToast("Task name cannot be empty.");

        return;

    }


    task.text = updatedText;

    task.dueDate = editDueDate.value;

    task.priority = editPriority.value;


    saveTasks();


    editDialog.close();

    editingTaskId = null;


    renderTasks();

    showToast("Task updated.");

});


// CLOSE EDIT MODAL

document.querySelector("#cancel-edit").addEventListener("click", function() {

    editDialog.close();

    editingTaskId = null;

});


editDialog.addEventListener("close", function() {

    editingTaskId = null;

});


// ======================================
// SEARCH TASKS
// ======================================

searchInput.addEventListener("input", function() {

    renderTasks();

});


// ======================================
// FILTER TASKS
// ======================================

filters.forEach(function(button) {

    button.addEventListener("click", function() {


        currentFilter = button.dataset.filter;


        filters.forEach(function(item) {

            item.classList.toggle(

                "is-active",

                item === button

            );

        });


        renderTasks();

    });

});


// ======================================
// KEYBOARD SHORTCUT
// CTRL + K / CMD + K
// ======================================

document.addEventListener("keydown", function(event) {

    if (

        (event.ctrlKey || event.metaKey) &&

        event.key.toLowerCase() === "k"

    ) {

        event.preventDefault();

        searchInput.focus();

    }


    if (event.key === "Escape" && editDialog.open) {

        editDialog.close();

    }

});


// ======================================
// CLEAR COMPLETED TASKS
// ======================================

document.querySelector("#clear-completed").addEventListener("click", function() {


    const completedCount = tasks.filter(function(task) {

        return task.completed;

    }).length;


    if (completedCount === 0) {

        showToast("There are no completed tasks to clear.");

        return;

    }


    const confirmed = window.confirm(

        `Delete ${completedCount} completed ${completedCount === 1 ? "task" : "tasks"}? This cannot be undone.`

    );


    if (!confirmed) return;


    tasks = tasks.filter(function(task) {

        return !task.completed;

    });


    saveTasks();

    renderTasks();

    showToast("Completed tasks cleared.");

});


// ======================================
// INITIALIZE APPLICATION
// ======================================

renderTasks();