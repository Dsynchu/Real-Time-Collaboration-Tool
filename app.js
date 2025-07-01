 const boards = [
  { id: 1, name: "Todo", tasks: [] },
  { id: 2, name: "In Progress", tasks: [] },
  { id: 3, name: "Done", tasks: [] }
];

const boardsContainer = document.getElementById("boards");

// Render boards
function renderBoards() {
  boardsContainer.innerHTML = "";
  boards.forEach(board => {
    const boardDiv = document.createElement("div");
    boardDiv.className = "board";
    boardDiv.dataset.boardId = board.id;

    const title = document.createElement("h2");
    title.textContent = board.name;

    const taskList = document.createElement("div");
    taskList.className = "task-list";

    board.tasks.forEach(task => {
      const taskDiv = createTaskElement(task);
      taskList.appendChild(taskDiv);
    });

    const addForm = document.createElement("form");
    addForm.className = "add-task";
    addForm.innerHTML = `
      <input type="text" placeholder="New task title..." required />
      <button>Add</button>
    `;
    addForm.onsubmit = (e) => {
      e.preventDefault();
      const input = addForm.querySelector("input");
      const title = input.value.trim();
      if (title) {
        const newTask = {
          id: Date.now().toString(),
          title,
          comments: []
        };
        board.tasks.push(newTask);
        renderBoards();
      }
    };

    boardDiv.appendChild(title);
    boardDiv.appendChild(taskList);
    boardDiv.appendChild(addForm);
    boardsContainer.appendChild(boardDiv);

    // Drag & Drop Events
    boardDiv.ondragover = (e) => e.preventDefault();
    boardDiv.ondrop = (e) => {
      const taskId = e.dataTransfer.getData("text/plain");
      const fromBoard = boards.find(b => b.tasks.find(t => t.id === taskId));
      const task = fromBoard.tasks.find(t => t.id === taskId);
      fromBoard.tasks = fromBoard.tasks.filter(t => t.id !== taskId);
      board.tasks.push(task);
      renderBoards();
    };
  });
}

// Create a task DOM element
function createTaskElement(task) {
  const div = document.createElement("div");
  div.className = "task";
  div.textContent = task.title;
  div.draggable = true;
  div.ondragstart = (e) => {
    e.dataTransfer.setData("text/plain", task.id);
  };

  // Comment placeholder
  const commentsDiv = document.createElement("div");
  commentsDiv.className = "comments";
  commentsDiv.textContent = `${task.comments.length} comment(s)`;

  div.appendChild(commentsDiv);
  return div;
}

renderBoards();
