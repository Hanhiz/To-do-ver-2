import { useState } from "react";
import "../App.css";

function TaskInput({ onCreate }) {
  const [text, setText] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Please enter a task.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await onCreate({ date, text: text.trim() });
      if (result?.error) {
        setError("Failed to add task.");
        console.error(result.error);
      } else {
        setText("");
      }
    } catch (err) {
      setError("Failed to add task.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="task-input" onSubmit={submit} aria-label="Add task">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="task-date"
        aria-label="Task date"
      />
      <input
        type="text"
        placeholder="What do you need to do?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="task-text"
        aria-label="Task description"
      />
      <button type="submit" className="task-submit" disabled={loading}>
        {loading ? "Adding…" : "Add"}
      </button>
      {error && (
        <div className="task-error" role="alert">
          {error}
        </div>
      )}
    </form>
  );
}

export default TaskInput;
