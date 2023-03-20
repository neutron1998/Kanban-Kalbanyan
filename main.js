// Global Variables
const kanbanTasks = document.querySelectorAll(".kanban-col .kanban-tasks");
const kanbanBorad = document.querySelector(".kanban-container");
const addBtns = document.querySelectorAll(".btn-add");
const tasks = []; // to handle element with localStorage

// Create Task
addBtns.forEach((addBtn) => {
  addBtn.addEventListener("click", (e) => createTask(e));
});
function createTask(e) {
  const taskContainer = e.target.parentElement.querySelector(".kanban-tasks");
  //-> create task container
  const taskDiv = document.createElement("div");
  taskDiv.classList.add("task", "active");
  taskDiv.setAttribute("draggable", true);
  //-> Create task Content
  const taskContent = document.createElement("input");
  taskContent.classList = "task-content";
  taskContent.value = "Enter Your Task";
  //-> create Task Controls
  const taskControls = document.createElement("span");
  taskControls.classList = "task-controls";
  //--> Create Task Controls icons [delete, update]
  const delIcon = document.createElement("i");
  const updIcon = document.createElement("i");
  updIcon.classList = "fa-regular fa-pen-to-square upd";
  delIcon.classList = "fa-solid fa-trash-can del";
  taskControls.append(updIcon, delIcon);
  //-> Attach task Content & task Controls to Task container
  taskDiv.appendChild(taskContent);
  taskDiv.appendChild(taskControls);
  //-> Add Task To Task Container
  taskContainer.append(taskDiv);
  //-> Make Task Content Foucs
  foucsTask(taskContent, taskDiv);
  // Add Lister To update and Delte
  delIcon.addEventListener("click", (e) => deleteTask(taskDiv));
  updIcon.addEventListener("click", (e) => update(taskContent));
  // drag Drop Logic
  dragDrop(taskDiv);
}
// foucs Task
function foucsTask(taskInput, taskDiv) {
  taskInput.focus();
  taskInput.addEventListener("focusout", (e) => {
    taskDiv.classList.remove("active");
    taskInput.disabled = true;
  });
  taskInput.addEventListener("focus", (e) => {
    taskDiv.classList.add("active");
  });
}
// Delete Task and Update Task
function update(taskInput) {
  taskInput.disabled = false;
  taskInput.focus();
}
function deleteTask(taskContainer) {
  taskContainer.remove();
}

// Drag And Drop
function dragDrop(ele) {
  ele.addEventListener("dragstart", (e) => {
    console.log("start");
    ele.classList.add("dragging");
  });
  ele.addEventListener("dragend", (e) => {
    console.log("end");
    ele.classList.remove("dragging");
  });
}

// Solve Porblem in drag Cursor between dragList
kanbanBorad.addEventListener("dragover", (e) => {
  e.preventDefault();
});

// Drop Position
kanbanTasks.forEach((kanbanTask) => {
  kanbanTask.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (!e.target.classList.contains("kanban-tasks")) return;
    const dragContainer = e.target;
    const dragEle = document.querySelector(".dragging");
    const dragAfterEle = getAfterElement(dragContainer, e.clientY);
    if (dragAfterEle !== null) {
      dragContainer.insertBefore(dragEle, dragAfterEle);
    } else if (dragAfterEle == null) {
      dragContainer.append(dragEle);
    }
  });
  kanbanTask.addEventListener("dragenter", (e) => {
    e.preventDefault();
  });
  kanbanTask.addEventListener("dragleave", (e) => {
    e.preventDefault();
  });
  kanbanTask.addEventListener("dragdrop", () => {
    console.log("dragdrop");
  });
});

function getAfterElement(dragContainer, y) {
  const dragContainerChild = [
    ...dragContainer.querySelectorAll(".task:not(.dragging)"),
  ];
  return dragContainerChild.reduce(
    (closest, child) => {
      const childRect = child.getBoundingClientRect();
      const offset = y - childRect.top - childRect.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}
