import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Restart dev server after editing .env');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fetch tasks for a user (or all tasks)
export async function fetchTasks(userId = null) {
  let q = supabase
    .from('tasks')
    .select('*')
    .order('date', { ascending: true }).order('position', { ascending: true });
  if (userId) q = q.eq('user_id', userId);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

export async function upsertTask(task) {
  const { data, error } = await supabase.from('tasks').upsert(task).select().single();
  if (error) throw error;
  return data;
}

export async function updateTask(id, changes) {
  const { data, error } = await supabase.from('tasks').update(changes).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteTask(id) {
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// Realtime subscription example (call subscribeTasks and handle callbacks)
export function subscribeTasks(onChange) {
  const channel = supabase
    .channel('public:tasks')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'tasks' },
      (payload) => onChange && onChange(payload)
    )
    .subscribe();
  return () => supabase.removeChannel(channel);
}

export async function testConnection() {
  try {
    const { data, error } = await supabase.from('tasks').select('*').limit(1);
    console.log('Supabase test:', { data, error });
    return { data, error };
  } catch (err) {
    console.error('Supabase test error', err);
    throw err;
  }
}