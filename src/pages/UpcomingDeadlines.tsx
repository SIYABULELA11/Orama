import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Calendar, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface Deadline {
  id: number;
  title: string;
  subject: string;
  dueDate: string;
  dueTime: string;
  priority: 'high' | 'medium' | 'low';
  type: 'assignment' | 'exam' | 'project' | 'quiz';
  status: 'pending' | 'submitted' | 'overdue';
  description?: string;
}

const UpcomingDeadlines = () => {
  const [deadlines] = useState<Deadline[]>([
    {
      id: 1,
      title: "Calculus Assignment",
      subject: "Mathematics",
      dueDate: "2025-09-18",
      dueTime: "23:59",
      priority: "high",
      type: "assignment",
      status: "pending",
      description: "Integration problems from chapter 5"
    },
    {
      id: 2,
      title: "Physics Midterm Exam",
      subject: "Physics",
      dueDate: "2025-09-20",
      dueTime: "14:00",
      priority: "high",
      type: "exam",
      status: "pending",
      description: "Quantum mechanics and thermodynamics"
    },
    {
      id: 3,
      title: "Chemistry Lab Report",
      subject: "Chemistry",
      dueDate: "2025-09-22",
      dueTime: "17:00",
      priority: "medium",
      type: "assignment",
      status: "pending",
      description: "Organic synthesis experiment results"
    },
    {
      id: 4,
      title: "History Essay",
      subject: "History",
      dueDate: "2025-09-15",
      dueTime: "12:00",
      priority: "medium",
      type: "assignment",
      status: "overdue",
      description: "World War II impact analysis"
    },
    {
      id: 5,
      title: "Biology Quiz",
      subject: "Biology",
      dueDate: "2025-09-19",
      dueTime: "10:00",
      priority: "low",
      type: "quiz",
      status: "pending",
      description: "Cell structure and functions"
    },
    {
      id: 6,
      title: "Programming Project",
      subject: "Computer Science",
      dueDate: "2025-09-16",
      dueTime: "23:59",
      priority: "high",
      type: "project",
      status: "submitted",
      description: "Web application development"
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'pending' | 'overdue' | 'submitted'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'subject'>('dueDate');

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
      case 'exam': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'project': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'quiz': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-orange-500" />;
      case 'submitted': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'overdue': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const isOverdue = (dueDate: string, dueTime: string, status: string) => {
    if (status === 'submitted') return false;
    const now = new Date();
    const due = new Date(`${dueDate}T${dueTime}`);
    return due < now;
  };

  const getDaysUntilDue = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredDeadlines = deadlines.filter(deadline => {
    if (filter === 'all') return true;
    if (filter === 'overdue') return isOverdue(deadline.dueDate, deadline.dueTime, deadline.status);
    return deadline.status === filter;
  });

  const sortedDeadlines = [...filteredDeadlines].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        return new Date(`${a.dueDate}T${a.dueTime}`).getTime() - new Date(`${b.dueDate}T${b.dueTime}`).getTime();
      case 'priority': {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      case 'subject':
        return a.subject.localeCompare(b.subject);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-orama-primary flex items-center gap-3">
            <Clock className="h-8 w-8" />
            Upcoming Deadlines
          </h1>
          <p className="text-muted-foreground mt-2">Track all your assignments, exams, and project deadlines</p>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex gap-4 items-center">
        <div>
          <label className="block text-sm font-medium mb-2">Filter by Status</label>
          <Select value={filter} onValueChange={(value: 'all' | 'pending' | 'overdue' | 'submitted') => setFilter(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Sort by</label>
          <Select value={sortBy} onValueChange={(value: 'dueDate' | 'priority' | 'subject') => setSortBy(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="subject">Subject</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-orama-primary" />
              <div>
                <p className="text-2xl font-bold text-orama-primary">{deadlines.length}</p>
                <p className="text-sm text-muted-foreground">Total Deadlines</p>
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
                  {deadlines.filter(d => d.status === 'pending').length}
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
                  {deadlines.filter(d => isOverdue(d.dueDate, d.dueTime, d.status)).length}
                </p>
                <p className="text-sm text-muted-foreground">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-green-500">
                  {deadlines.filter(d => d.status === 'submitted').length}
                </p>
                <p className="text-sm text-muted-foreground">Submitted</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deadlines List */}
      <Card className="bg-white shadow-lg">
        <CardHeader className="bg-orama-primary text-white">
          <CardTitle>Deadline Management</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">Task</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Subject</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Due Date</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Priority</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedDeadlines.map((deadline) => {
                  const overdue = isOverdue(deadline.dueDate, deadline.dueTime, deadline.status);
                  const daysUntil = getDaysUntilDue(deadline.dueDate);
                  
                  return (
                    <tr 
                      key={deadline.id} 
                      className={`hover:bg-gray-50 transition-colors ${
                        overdue ? 'bg-red-50' : deadline.status === 'submitted' ? 'bg-green-50' : ''
                      }`}
                    >
                      <td className="p-4">
                        <div>
                          <h3 className="font-semibold text-orama-primary">{deadline.title}</h3>
                          {deadline.description && (
                            <p className="text-sm text-muted-foreground mt-1">{deadline.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-medium">{deadline.subject}</span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div className="font-medium">
                            {new Date(deadline.dueDate).toLocaleDateString()}
                          </div>
                          <div className="text-muted-foreground">{deadline.dueTime}</div>
                          <div className={`text-xs mt-1 ${
                            daysUntil < 0 ? 'text-red-600' : 
                            daysUntil <= 1 ? 'text-orange-600' : 'text-green-600'
                          }`}>
                            {daysUntil < 0 ? 
                              `${Math.abs(daysUntil)} days overdue` :
                              daysUntil === 0 ? 'Due today' :
                              daysUntil === 1 ? 'Due tomorrow' :
                              `${daysUntil} days left`
                            }
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Badge className={getPriorityColor(deadline.priority)}>
                            {deadline.priority}
                          </Badge>
                          <Badge className={getTypeColor(deadline.type)}>
                            {deadline.type}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(deadline.status)}
                          <span className={`text-sm font-medium ${
                            deadline.status === 'submitted' ? 'text-green-600' :
                            overdue ? 'text-red-600' : 'text-orange-600'
                          }`}>
                            {overdue && deadline.status === 'pending' ? 'Overdue' : 
                             deadline.status.charAt(0).toUpperCase() + deadline.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Accept
                          </Button>
                          <Button variant="outline" size="sm">
                            Reschedule
                          </Button>
                          <Button variant="outline" size="sm">
                            Replace
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpcomingDeadlines;
