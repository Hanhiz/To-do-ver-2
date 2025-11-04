import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import Timetable from './components/Timetable';
import './App.css';

function App() {
  const [tasksByDate, setTasksByDate] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTasks() {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('date', { ascending: true })
        .order('position', { ascending: true });

      if (error) {
        console.error('fetch tasks error', error);
        setTasksByDate({});
        setLoading(false);
        return;
      }

      const grouped = {};
      (data || []).forEach(row => {
        const key = row.date ? row.date.toString().slice(0, 10) : 'no-date';
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push({
          id: row.id,
          text: row.text,
          completed: row.completed,
          position: row.position,
          created_at: row.created_at,
        });
      });

      setTasksByDate(grouped);
      setLoading(false);
    }

    loadTasks();
  }, []);

  const createTask = async ({ date, text }) => {
    const dateIso = new Date(date).toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ date: dateIso, text, completed: false, position: 0 }])
      .select()
      .single();

    if (error) {
      console.error('insert task error', error);
      return { error };
    }

    setTasksByDate(prev => {
      const key = data.date ? data.date.toString().slice(0, 10) : 'no-date';
      const next = { ...(prev || {}) };
      next[key] = next[key]
        ? [...next[key], { id: data.id, text: data.text, completed: data.completed, position: data.position }]
        : [{ id: data.id, text: data.text, completed: data.completed, position: data.position }];
      return next;
    });

    return { data };
  };

  const toggleTask = async (dateKey, taskId) => {
    // find current task from state
    const current = tasksByDate[dateKey]?.find(t => t.id === taskId);
    if (!current) {
      console.error('toggleTask: task not found', { dateKey, taskId });
      return;
    }

    const newCompleted = !current.completed;

    // optimistic update
    setTasksByDate(prev => {
      const copy = { ...prev };
      copy[dateKey] = copy[dateKey].map(t => (t.id === taskId ? { ...t, completed: newCompleted } : t));
      return copy;
    });

    // persist change to Supabase
    const { data, error } = await supabase
      .from('tasks')
      .update({ completed: newCompleted })
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      console.error('Supabase update failed', error);
      // revert optimistic update
      setTasksByDate(prev => {
        const copy = { ...prev };
        copy[dateKey] = copy[dateKey].map(t => (t.id === taskId ? { ...t, completed: current.completed } : t));
        return copy;
      });
      return;
    }

    // optionally apply returned row data (keep local copy in sync)
    setTasksByDate(prev => {
      const copy = { ...prev };
      copy[dateKey] = copy[dateKey].map(t => (t.id === taskId ? { ...t, ...data } : t));
      return copy;
    });
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Todo Timetable</h1>
      </header>

      <div className="controls">
        <TaskInput onCreate={createTask} />
      </div>

      <div className="layout">
        <div className="left-pane">
          {loading ? <div>Loading tasks…</div> : <TaskList tasks={tasksByDate} toggleTask={toggleTask} />}
        </div>

        <div className="right-pane">
          <Timetable tasks={tasksByDate} />
        </div>
      </div>
    </div>
  );
}

export default App;
