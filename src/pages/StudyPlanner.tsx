import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { BookOpen, Plus, Calendar, Clock, Target } from "lucide-react";

interface StudyPlan {
  id: number;
  subject: string;
  topic: string;
  duration: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
}

const StudyPlanner = () => {
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlan, setNewPlan] = useState({
    subject: '',
    topic: '',
    duration: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    status: 'pending' as 'pending' | 'in-progress' | 'completed',
    dueDate: '',
    notes: ''
  });

  const handleAddPlan = () => {
    if (newPlan.subject && newPlan.topic) {
      const plan: StudyPlan = {
        id: Date.now(),
        subject: newPlan.subject,
        topic: newPlan.topic,
        duration: newPlan.duration,
        priority: newPlan.priority,
        status: newPlan.status,
        dueDate: newPlan.dueDate
      };
      setStudyPlans([...studyPlans, plan]);
      setNewPlan({
        subject: '',
        topic: '',
        duration: '',
        priority: 'medium',
        status: 'pending',
        dueDate: '',
        notes: ''
      });
      setShowAddForm(false);
    }
  };

  const handleDeletePlan = (id: number) => {
    setStudyPlans(studyPlans.filter(plan => plan.id !== id));
  };

  const handleUpdateStatus = (id: number, status: 'pending' | 'in-progress' | 'completed') => {
    setStudyPlans(studyPlans.map(plan => 
      plan.id === id ? { ...plan, status } : plan
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-orama-primary/10 text-orama-primary';
      case 'pending': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-orama-primary flex items-center gap-2 sm:gap-3">
            <BookOpen className="h-6 w-6 sm:h-8 sm:w-8" />
            Study Planner
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">Organize your study sessions and track your progress</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-orama-primary hover:bg-orama-primary-light text-white w-full sm:w-auto text-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Study Plan
        </Button>
      </div>

      {/* Add Study Plan Form */}
      {showAddForm && (
        <Card className="bg-white shadow-lg">
          <CardHeader className="bg-orama-primary text-white p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Create New Study Plan</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">Subject</label>
                <Input 
                  placeholder="Enter subject name" 
                  value={newPlan.subject}
                  onChange={(e) => setNewPlan({ ...newPlan, subject: e.target.value })}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">Topic</label>
                <Input 
                  placeholder="Enter topic to study" 
                  value={newPlan.topic}
                  onChange={(e) => setNewPlan({ ...newPlan, topic: e.target.value })}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">Duration</label>
                <Input 
                  placeholder="e.g., 2 hours" 
                  value={newPlan.duration}
                  onChange={(e) => setNewPlan({ ...newPlan, duration: e.target.value })}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <Select value={newPlan.priority} onValueChange={(value: 'high' | 'medium' | 'low') => setNewPlan({ ...newPlan, priority: value })}>
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
              <div>
                <label className="block text-sm font-medium mb-2">Due Date</label>
                <Input 
                  type="date" 
                  value={newPlan.dueDate}
                  onChange={(e) => setNewPlan({ ...newPlan, dueDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <Select value={newPlan.status} onValueChange={(value: 'pending' | 'in-progress' | 'completed') => setNewPlan({ ...newPlan, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Notes</label>
              <Textarea 
                placeholder="Additional notes or study goals..." 
                value={newPlan.notes}
                onChange={(e) => setNewPlan({ ...newPlan, notes: e.target.value })}
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
                onClick={handleAddPlan}
                disabled={!newPlan.subject || !newPlan.topic}
              >
                Create Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-orama-primary" />
              <div>
                <p className="text-2xl font-bold text-orama-primary">
                  {studyPlans.filter(plan => plan.status === 'completed').length}
                </p>
                <p className="text-sm text-muted-foreground">Completed Plans</p>
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
                  {studyPlans.filter(plan => plan.status === 'in-progress').length}
                </p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-red-500">
                  {studyPlans.filter(plan => plan.status === 'pending').length}
                </p>
                <p className="text-sm text-muted-foreground">Pending Plans</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Study Plans List */}
      <Card className="bg-white shadow-lg">
        <CardHeader className="bg-orama-primary text-white">
          <CardTitle>Your Study Plans</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {studyPlans.map((plan) => (
              <div key={plan.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-orama-primary">{plan.subject}</h3>
                      <Badge className={getPriorityColor(plan.priority)}>
                        {plan.priority}
                      </Badge>
                      <Badge className={getStatusColor(plan.status)}>
                        {plan.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-1">{plan.topic}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {plan.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Due: {new Date(plan.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeletePlan(plan.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-orama-primary text-orama-primary hover:bg-orama-primary hover:text-white"
                      onClick={() => handleUpdateStatus(plan.id, plan.status === 'completed' ? 'pending' : 'in-progress')}
                    >
                      {plan.status === 'completed' ? 'Restart' : 'Start Study'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyPlanner;
