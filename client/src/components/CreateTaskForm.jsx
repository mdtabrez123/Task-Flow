import React, { useState } from 'react';
import FormInput from './FormInput.jsx';
import PrimaryButton from './PrimaryButton.jsx';
import { Button } from './ui/button.jsx';

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const CreateTaskForm = ({ onAddTask, onSuccess }) => {
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState(getTodayDate());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskName.trim()) {
      setError('Task title is required.');
      return;
    }

    setError('');
    setLoading(true);
    
    const newTask = {
      name: taskName,
      date: dueDate,
    };

    try {
      await onAddTask(newTask);
      setTaskName('');
      setDueDate(getTodayDate());
      onSuccess?.();
    } catch (error) {
      setError(error.message || 'Failed to add task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_20px_45px_rgba(28,25,23,0.08)] backdrop-blur-md">
      <h2 className="font-serif text-3xl tracking-tight text-[var(--foreground)]">Create New Task</h2>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">
        Keep details focused and clear. Priority comes from naming and timeline.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <FormInput
            id="taskName"
            label="Task Name"
            type="text"
            placeholder="e.g., Finish project report"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
        </div>

        <div>
          <FormInput
            id="dueDate"
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        {error && (
          <p className="rounded-lg border border-[rgba(194,65,12,0.35)] bg-[rgba(194,65,12,0.08)] px-3 py-2 text-sm text-[var(--accent)]">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={() => onSuccess?.()}>
            Cancel
          </Button>
          <PrimaryButton type="submit" disabled={loading} className="w-auto min-w-32">
            {loading ? 'Adding...' : 'Add Task'}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};

export default CreateTaskForm;