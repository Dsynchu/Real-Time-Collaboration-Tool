// app.js
const boards = [
  { id: 1, name: "Todo", tasks: [] },
  { id: 2, name: "In Progress", tasks: [] },
  { id: 3, name: "Done", tasks: [] }
];

const boardsContainer = document.querySelector("#boards .flex");
const newTaskForm = document.getElementById("newTaskForm");

// Add new task to Todo board
newTaskForm.onsubmit = (e) => {
  e.preventDefault();
  const input = newTaskForm.querySelector("input");
  const title = input.value.trim();
  if (title) {
    const newTask = {
      id: Date.now().toString(),
      title,
      comments: []
    };
    boards[0].tasks.push(newTask);
    input.value = "";
    renderBoards();
    input.focus();
  }
};

// Render boards
function renderBoards() {
  boardsContainer.innerHTML = "";
  boards.forEach(board => {
    const boardDiv = document.createElement("div");
    boardDiv.className = `board flex-1 rounded-xl shadow-md p-5 flex flex-col ${board.id === 1 ? 'bg-blue-50 border border-blue-100' : board.id === 2 ? 'bg-amber-50 border border-amber-100' : 'bg-green-50 border border-green-100'}`;
    boardDiv.dataset.boardId = board.id;

    const title = document.createElement("h2");
    title.className = `text-xl font-semibold mb-4 ${board.id === 1 ? 'text-blue-800' : board.id === 2 ? 'text-amber-800' : 'text-green-800'} border-b pb-2 flex items-center gap-2`;
    
    // Add icon based on board
    const iconPath = board.id === 1 ? "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                      : board.id === 2 ? "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                      : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";
    
    title.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${iconPath}" />
      </svg>
      ${board.name}
    `;

    const taskList = document.createElement("div");
    taskList.className = "flex-1 space-y-3 overflow-y-auto max-h-[65vh] pr-2";

    board.tasks.forEach(task => {
      const taskDiv = createTaskElement(task, board.id);
      taskList.appendChild(taskDiv);
    });

    boardDiv.appendChild(title);
    boardDiv.appendChild(taskList);
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
function createTaskElement(task, boardId) {
  const div = document.createElement("div");
  div.className = `task p-4 rounded-lg ${boardId === 1 ? 'bg-blue-100 hover:bg-blue-200' : boardId === 2 ? 'bg-amber-100 hover:bg-amber-200' : 'bg-green-100 hover:bg-green-200'} transition-all duration-200`;
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

  // Delete button for Done board
  if (boardId === 3) {
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "mt-3 text-sm text-red-600 hover:text-red-800 flex items-center gap-1 bg-white/70 px-3 py-1 rounded-lg";
    deleteBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      Complete
    `;
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      const board = boards.find(b => b.id === 3);
      board.tasks = board.tasks.filter(t => t.id !== task.id);
      renderBoards();
    };
    div.appendChild(deleteBtn);
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