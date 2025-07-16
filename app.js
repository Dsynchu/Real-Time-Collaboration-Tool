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
    boardDiv.className = "board bg-white rounded-lg shadow-md p-6 w-80 flex flex-col";
    boardDiv.dataset.boardId = board.id;

    const title = document.createElement("h2");
    title.className = "text-xl font-semibold mb-4 text-gray-800 border-b pb-2";
    title.textContent = board.name;

    const taskList = document.createElement("div");
    taskList.className = "flex-1 space-y-3 overflow-y-auto max-h-[70vh] pr-2";

    board.tasks.forEach(task => {
      const taskDiv = createTaskElement(task);
      taskList.appendChild(taskDiv);
    });

    const addForm = document.createElement("form");
    addForm.className = "add-task mt-4 flex gap-2";
    addForm.innerHTML = `
      <input type="text" class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="New task title..." required />
      <button class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">Add</button>
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
        input.value = "";
        renderBoards();
      }
    };

    boardDiv.appendChild(title);
    boardDiv.appendChild(taskList);
    boardDiv.appendChild(addForm);
    boardsContainer.appendChild(boardDiv);

    // Drag & Drop Events
    boardDiv.ondragover = (e) => {
      e.preventDefault();
      boardDiv.classList.add("highlight");
    };

    boardDiv.ondragleave = () => {
      boardDiv.classList.remove("highlight");
    };

    boardDiv.ondrop = (e) => {
      e.preventDefault();
      boardDiv.classList.remove("highlight");
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
  div.className = "task bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing";
  div.dataset.taskId = task.id;
  
  const title = document.createElement("div");
  title.className = "text-gray-800 font-medium";
  title.textContent = task.title;
  
  div.appendChild(title);

  // Comment section
  if (task.comments.length > 0) {
    const commentsDiv = document.createElement("div");
    commentsDiv.className = "comments mt-2 flex items-center text-sm text-gray-500";
    commentsDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      ${task.comments.length} comment${task.comments.length !== 1 ? 's' : ''}
    `;
    div.appendChild(commentsDiv);
  }

  div.draggable = true;
  div.ondragstart = (e) => {
    e.dataTransfer.setData("text/plain", task.id);
    div.classList.add("dragging");
  };

  div.ondragend = () => {
    div.classList.remove("dragging");
  };

  return div;
}

renderBoards();