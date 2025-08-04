import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, AlertCircle, CheckCircle, Plus, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

interface ComplianceEvent {
  id: string;
  title: string;
  date: Date;
  type: 'deadline' | 'renewal' | 'filing' | 'inspection';
  status: 'pending' | 'completed' | 'overdue';
  description: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

const ComplianceCalendar: React.FC = () => {
  const { t } = useLanguage();
  const { dispatch } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as 'high' | 'medium' | 'low'
  });

  // Sample compliance events
  const events: ComplianceEvent[] = [
    {
      id: '1',
      title: 'GST Return Filing',
      date: new Date(2025, 0, 20),
      type: 'filing',
      status: 'pending',
      description: 'Monthly GST return filing deadline'
    },
    {
      id: '2',
      title: 'Trade License Renewal',
      date: new Date(2025, 0, 25),
      type: 'renewal',
      status: 'pending',
      description: 'Annual trade license renewal'
    },
    {
      id: '3',
      title: 'Fire Safety Inspection',
      date: new Date(2025, 0, 15),
      type: 'inspection',
      status: 'completed',
      description: 'Annual fire safety compliance check'
    }
  ];

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setDate(prev.getDate() - 7);
      } else {
        newDate.setDate(prev.getDate() + 7);
      }
      return newDate;
    });
  };

  const handleAddTask = () => {
    if (!newTask.title || !newTask.dueDate) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate,
      priority: newTask.priority,
      completed: false
    };

    setTasks([...tasks, task]);
    
    // Add to app events for dashboard
    const calendarEvent = {
      id: task.id,
      title: task.title,
      date: task.dueDate,
      type: 'deadline' as const,
      priority: task.priority,
      description: task.description,
      completed: false
    };
    
    dispatch({ type: 'ADD_EVENT', payload: calendarEvent });
    
    setNewTask({ title: '', description: '', dueDate: '', priority: 'medium' });
    setShowTaskModal(false);
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
  };

  const getEventsForDate = (date: Date) => {
    const eventList = [...events];
    const taskEvents = tasks.map(task => ({
      id: task.id,
      title: task.title,
      date: new Date(task.dueDate),
      type: 'deadline' as const,
      status: task.completed ? 'completed' as const : 'pending' as const,
      description: task.description
    }));
    
    return [...eventList, ...taskEvents].filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200 dark:border-gray-700"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <div key={day} className={`h-24 border border-gray-200 dark:border-gray-700 p-1 ${isToday ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800'}`}>
          <div className={`text-sm font-medium ${isToday ? 'text-blue-600 dark:text-blue-300' : 'text-gray-900 dark:text-gray-100'}`}>
            {day}
          </div>
          <div className="space-y-1 mt-1">
            {dayEvents.slice(0, 2).map(event => (
              <div key={event.id} className={`text-xs px-1 py-0.5 rounded truncate ${getStatusColor(event.status)}`}>
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-0">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-gray-50 dark:bg-gray-800 p-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDays.push(date);
    }

    return (
      <div className="grid grid-cols-7 gap-0">
        {weekDays.map((date, index) => {
          const dayEvents = getEventsForDate(date);
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <div key={index} className={`border border-gray-200 dark:border-gray-700 ${isToday ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800'}`}>
              <div className={`p-2 text-center border-b border-gray-200 dark:border-gray-700 ${isToday ? 'bg-blue-100 dark:bg-blue-800/50' : 'bg-gray-50 dark:bg-gray-700'}`}>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className={`text-lg font-medium ${isToday ? 'text-blue-600 dark:text-blue-300' : 'text-gray-900 dark:text-gray-100'}`}>
                  {date.getDate()}
                </div>
              </div>
              <div className="p-2 space-y-1 min-h-[200px]">
                {dayEvents.map(event => (
                  <div key={event.id} className={`text-xs px-2 py-1 rounded ${getStatusColor(event.status)}`}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(event.status)}
                      <span className="font-medium">{event.title}</span>
                    </div>
                    <div className="mt-1 text-xs opacity-75">
                      {event.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors overflow-x-hidden">
      <div className="container max-w-full px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('calendar.title')}
                </h1>
              </div>
              
              <div className="hidden sm:flex items-center gap-4">
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setView('month')}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                      view === 'month'
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {t('calendar.month')}
                  </button>
                  <button
                    onClick={() => setView('week')}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                      view === 'week'
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {t('calendar.week')}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {view === 'month' ? getMonthName(currentDate) : 
                 `Week of ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
              </h2>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => view === 'month' ? navigateMonth('prev') : navigateWeek('prev')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                >
                  {t('common.today')}
                </button>
                <button
                  onClick={() => view === 'month' ? navigateMonth('next') : navigateWeek('next')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <Button
                  size="sm"
                  icon={Plus}
                  onClick={() => setShowTaskModal(true)}
                  className="ml-4"
                >
                  Add Task
                </Button>
              </div>
            </div>
            
            {/* Mobile View Toggle */}
            <div className="sm:hidden mt-4">
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 w-full">
                <button
                  onClick={() => setView('month')}
                  className={`flex-1 px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    view === 'month'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {t('calendar.month')}
                </button>
                <button
                  onClick={() => setView('week')}
                  className={`flex-1 px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    view === 'week'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {t('calendar.week')}
                </button>
              </div>
            </div>
          </div>

          <div className="p-2 sm:p-6">
            <div className="overflow-x-auto">
            {view === 'month' ? renderMonthView() : renderWeekView()}
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('calendar.upcomingDeadlines')}
            </h3>
            <div className="space-y-3">
              {events.filter(event => event.status === 'pending').map(event => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(event.status)}
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{event.title}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{event.description}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {event.date.toLocaleDateString()}
                  </div>
                </div>
              ))}
              {tasks.filter(task => !task.completed).map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskComplete(task.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{task.title}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{task.description}</div>
                      <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {task.priority}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Task Modal */}
        {showTaskModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Task</h3>
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Enter task title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    className="input-field resize-none"
                    rows={3}
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Enter task description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    className="input-field"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    className="input-field"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'high' | 'medium' | 'low' })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowTaskModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddTask}
                  disabled={!newTask.title || !newTask.dueDate}
                  className="flex-1"
                >
                  Add Task
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplianceCalendar;