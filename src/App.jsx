import  { useState } from "react";

function App() {
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [undoStack, setUndoStack] = useState([]);

  const handleInput = (newTask) => {
    setNewTask(newTask);
  };

  const handleAddTask = () => {
    if (newTask.trim() === "") return;
    const newUndoStack = [...undoStack, { type: "add", tasks: [...tasks] }];
    if (newUndoStack.length > 5) newUndoStack.shift();
    setUndoStack(newUndoStack);
    const newTaskObj = { id: Date.now(), task: newTask, isCompleted: false, isDeleted: false };
    setTasks([...tasks, newTaskObj]);
    setNewTask("");
  };

  const handleComplete = (id) => {
    const updatedTasks = tasks.map((task) => 
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
    );
    const newUndoStack = [...undoStack, { type: "complete", tasks: [...tasks] }];
    if (newUndoStack.length > 5) newUndoStack.shift();
    setUndoStack(newUndoStack);
    setTasks(updatedTasks);
  };

  const handleDelete = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    const newUndoStack = [...undoStack, { type: "delete", tasks: [...tasks] }];
    if (newUndoStack.length > 5) newUndoStack.shift();
    setUndoStack(newUndoStack);
    setTasks(updatedTasks);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const newUndoStack = [...undoStack];
    const lastAction = newUndoStack.pop();
    setUndoStack(newUndoStack);
    setTasks(lastAction.tasks);
  };

  return (
    <div>
      <input
        value={newTask}
        onChange={(e) => handleInput(e.target.value)}
        type="text"
        placeholder="New Task"
      />
      <button onClick={handleAddTask}>Add Task</button>
      <button onClick={handleUndo} disabled={undoStack.length === 0}>
        Global Undo
      </button>
      <div style={{ display: "grid", marginTop: "20px" }}>
        {tasks.length === 0 ? (
          <p>No tasks yet. Add a task to get started!</p>
        ) : (
          tasks.map((t) => (
            <div style={{ display: "flex", alignItems: "center" }} key={t.id}>
              <span
                style={{
                  textDecoration: t.isCompleted ? "line-through" : "none",
                  marginRight: "10px",
                }}
              >
                {t.task}
              </span>
              <button onClick={() => handleComplete(t.id)}>
                {t.isCompleted ? "Undo Complete" : "Complete"}
              </button>
              <button onClick={() => handleDelete(t.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;