function TaskList({ tasks, toggleTask }) {
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr; // fallback if not a valid date
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const sortedDates = Object.keys(tasks || {}).sort((a, b) => {
    const ta = Date.parse(a);
    const tb = Date.parse(b);
    if (!isNaN(ta) && !isNaN(tb)) return ta - tb; // earliest first
    return a.localeCompare(b);
  });

  return (
    <div>
      {sortedDates.map(date => (
        <div key={date} className="mb-4">
          <h2 className="font-semibold">{formatDate(date)}</h2>
          <ul>
            {tasks[date].map(task => (
              <li key={task.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(date, task.id)}
                />
                <span className={task.completed ? "line-through" : ""}>{task.text}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
