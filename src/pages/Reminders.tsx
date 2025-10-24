import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell, Plus, Calendar, Clock, AlertTriangle } from "lucide-react";

interface Reminder {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  priority: 'high' | 'medium' | 'low';
  type: 'assignment' | 'exam' | 'meeting' | 'study' | 'other';
  completed: boolean;
}

const Reminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    dueDate: '',
    dueTime: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    type: 'other' as 'assignment' | 'exam' | 'meeting' | 'study' | 'other'
  });

  const handleAddReminder = () => {
    if (newReminder.title && newReminder.dueDate && newReminder.dueTime) {
      const reminder: Reminder = {
        id: Date.now(),
        title: newReminder.title,
        description: newReminder.description,
        dueDate: newReminder.dueDate,
        dueTime: newReminder.dueTime,
        priority: newReminder.priority,
        type: newReminder.type,
        completed: false
      };
      setReminders([...reminders, reminder]);
      setNewReminder({
        title: '',
        description: '',
        dueDate: '',
        dueTime: '',
        priority: 'medium',
        type: 'other'
      });
      setShowAddForm(false);
    }
  };

  const handleDeleteReminder = (id: number) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'assignment': return 'bg-orama-primary/10 text-orama-primary border-orama-primary/20';
      case 'exam': return 'bg-red-100 text-red-700 border-red-200';
      case 'meeting': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'study': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const toggleReminder = (id: number) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id 
          ? { ...reminder, completed: !reminder.completed }
          : reminder
      )
    );
  };

  const isOverdue = (dueDate: string, dueTime: string) => {
    const now = new Date();
    const due = new Date(`${dueDate}T${dueTime}`);
    return due < now;
  };

  const sortedReminders = [...reminders].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1; // Completed items go to bottom
    }
    return new Date(`${a.dueDate}T${a.dueTime}`).getTime() - new Date(`${b.dueDate}T${b.dueTime}`).getTime();
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-orama-primary flex items-center gap-2 sm:gap-3">
            <Bell className="h-6 w-6 sm:h-8 sm:w-8" />
            Reminders
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">Stay on top of your assignments and important dates</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-orama-primary hover:bg-orama-primary-light text-white w-full sm:w-auto text-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Reminder
        </Button>
      </div>

      {/* Add Reminder Form */}
      {showAddForm && (
        <Card className="bg-white shadow-lg">
          <CardHeader className="bg-orama-primary text-white p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Create New Reminder</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">Title</label>
                <Input 
                  placeholder="Enter reminder title" 
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <Select value={newReminder.type} onValueChange={(value: 'assignment' | 'exam' | 'meeting' | 'study' | 'other') => setNewReminder({ ...newReminder, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assignment">Assignment</SelectItem>
                    <SelectItem value="exam">Exam</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="study">Study</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Due Date</label>
                <Input 
                  type="date" 
                  value={newReminder.dueDate}
                  onChange={(e) => setNewReminder({ ...newReminder, dueDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Due Time</label>
                <Input 
                  type="time" 
                  value={newReminder.dueTime}
                  onChange={(e) => setNewReminder({ ...newReminder, dueTime: e.target.value })}
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium mb-2">Priority</label>
                <Select value={newReminder.priority} onValueChange={(value: 'high' | 'medium' | 'low') => setNewReminder({ ...newReminder, priority: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea 
                placeholder="Add details about this reminder..." 
                value={newReminder.description}
                onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-orama-primary hover:bg-orama-primary-light text-white"
                onClick={handleAddReminder}
                disabled={!newReminder.title || !newReminder.dueDate || !newReminder.dueTime}
              >
                Create Reminder
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Bell className="h-8 w-8 text-orama-primary" />
              <div>
                <p className="text-2xl font-bold text-orama-primary">{reminders.length}</p>
                <p className="text-sm text-muted-foreground">Total Reminders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold text-orange-500">
                  {reminders.filter(r => !r.completed).length}
                </p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-red-500">
                  {reminders.filter(r => !r.completed && isOverdue(r.dueDate, r.dueTime)).length}
                </p>
                <p className="text-sm text-muted-foreground">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-green-500">
                  {reminders.filter(r => r.completed).length}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reminders List */}
      <Card className="bg-white shadow-lg">
        <CardHeader className="bg-orama-primary text-white">
          <CardTitle>Your Reminders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {sortedReminders.map((reminder) => {
              const overdue = !reminder.completed && isOverdue(reminder.dueDate, reminder.dueTime);
              
              return (
                <div 
                  key={reminder.id} 
                  className={`p-6 transition-colors ${
                    reminder.completed ? 'bg-gray-50 opacity-75' : 'hover:bg-gray-50'
                  } ${overdue ? 'bg-red-50 border-l-4 border-red-500' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={reminder.completed}
                      onCheckedChange={() => toggleReminder(reminder.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className={`font-semibold ${
                          reminder.completed ? 'line-through text-gray-500' : 'text-orama-primary'
                        }`}>
                          {reminder.title}
                        </h3>
                        {overdue && (
                          <Badge className="bg-red-100 text-red-700 border-red-200">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Overdue
                          </Badge>
                        )}
                        <Badge className={getPriorityColor(reminder.priority)}>
                          {reminder.priority}
                        </Badge>
                        <Badge className={getTypeColor(reminder.type)}>
                          {reminder.type}
                        </Badge>
                      </div>
                      <p className={`mb-2 ${
                        reminder.completed ? 'text-gray-500' : 'text-muted-foreground'
                      }`}>
                        {reminder.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(reminder.dueDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {reminder.dueTime}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteReminder(reminder.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reminders;
