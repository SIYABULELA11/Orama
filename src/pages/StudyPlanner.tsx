import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, Calendar, Clock, Target, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudyPlan {
  id: number;
  subject: string;
  topic: string;
  duration: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed";
  dueDate: string;
  notes?: string;
}

const StudyPlanner = () => {
  const { toast } = useToast();
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [studentNumber, setStudentNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    subject: "",
    topic: "",
    duration: "",
    priority: "medium",
    status: "pending",
    dueDate: "",
    notes: "",
  });

  useEffect(() => {
    const storedStudentNumber = localStorage.getItem('student_number');
    if (storedStudentNumber) {
      setStudentNumber(storedStudentNumber);
      fetchPlans(storedStudentNumber);
    }
  }, []);

  const fetchPlans = async (studentNum: string) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/study-plans?studentNumber=${studentNum}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch study plans");
      }

      const mappedPlans = data.map((p: any) => ({
        id: p.id,
        subject: p.subject,
        topic: p.topic,
        duration: p.duration,
        priority: p.priority,
        status: p.status,
        dueDate: p.due_date,
        notes: p.notes,
      }));
      setStudyPlans(mappedPlans);
    } catch (err: any) {
      console.error("Failed to fetch study plans:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to load study plans.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrEdit = async () => {
    if (!studentNumber) {
      toast({
        title: "Student Number Required",
        description: "Please set up your profile first.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingId !== null) {
        const res = await fetch(`http://localhost:5000/api/study-plans/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentNumber, ...form })
        });

        if (!res.ok) throw new Error("Failed to update study plan");

        await fetchPlans(studentNumber);
        
        toast({
          title: "Success",
          description: "Study plan updated successfully.",
        });
      } else {
        const res = await fetch("http://localhost:5000/api/study-plans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentNumber, ...form })
        });

        if (!res.ok) throw new Error("Failed to create study plan");

        await fetchPlans(studentNumber);
        
        toast({
          title: "Success",
          description: "Study plan created successfully.",
        });
      }

      setForm({ subject: "", topic: "", duration: "", priority: "medium", status: "pending", dueDate: "", notes: "" });
      setEditingId(null);
      setShowAddForm(false);
    } catch (err: any) {
      console.error("Error creating/updating plan:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to save study plan.",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (plan: StudyPlan) => {
    setEditingId(plan.id);
    setForm({
      subject: plan.subject,
      topic: plan.topic,
      duration: plan.duration,
      priority: plan.priority,
      status: plan.status,
      dueDate: plan.dueDate,
      notes: plan.notes || "",
    });
    setShowAddForm(true);
  };

  const handleUpdateStatus = async (plan: StudyPlan, newStatus: "pending" | "in-progress" | "completed") => {
    if (!studentNumber) return;

    try {
      const res = await fetch(`http://localhost:5000/api/study-plans/${plan.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          studentNumber,
          subject: plan.subject,
          topic: plan.topic,
          duration: plan.duration,
          priority: plan.priority,
          status: newStatus,
          dueDate: plan.dueDate,
          notes: plan.notes
        }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setStudyPlans(studyPlans.map(p => (p.id === plan.id ? { ...p, status: newStatus } : p)));
      
      toast({
        title: "Success",
        description: "Status updated successfully.",
      });
    } catch (err) {
      console.error("Error updating status:", err);
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!studentNumber) return;

    try {
      const res = await fetch(`http://localhost:5000/api/study-plans/${id}?studentNumber=${studentNumber}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Failed to delete study plan");

      setStudyPlans(studyPlans.filter(p => p.id !== id));
      
      toast({
        title: "Success",
        description: "Study plan deleted successfully.",
      });
    } catch (err) {
      console.error("Error deleting plan:", err);
      toast({
        title: "Error",
        description: "Failed to delete study plan.",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700";
      case "medium": return "bg-yellow-100 text-yellow-700";
      case "low": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700";
      case "in-progress": return "bg-orama-primary/10 text-orama-primary";
      case "pending": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getButtonText = (status: "pending" | "in-progress" | "completed") => {
    switch (status) {
      case "pending": return "Start Study";
      case "in-progress": return "Complete";
      case "completed": return "Restart";
    }
  };

  const getNextStatus = (status: "pending" | "in-progress" | "completed"): "pending" | "in-progress" | "completed" => {
    switch (status) {
      case "pending": return "in-progress";
      case "in-progress": return "completed";
      case "completed": return "pending";
    }
  };

  if (!studentNumber) {
    return (
      <div className="space-y-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Student Number Required</h3>
                <p className="text-sm text-blue-700">
                  Please set up your profile first by entering your student number on the Profile page.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading study plans...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-orama-primary flex items-center gap-3">
            <BookOpen className="h-8 w-8" /> Study Planner
          </h1>
          <p className="text-muted-foreground mt-2">Organize your study sessions and track your progress</p>
          <p className="text-xs text-green-600 font-medium mt-1">✓ Linked to student: {studentNumber}</p>
        </div>
        <Button onClick={() => { setShowAddForm(!showAddForm); setEditingId(null); }} className="bg-orama-primary hover:bg-orama-primary-light text-white">
          <Plus className="h-4 w-4 mr-2" /> Add Study Plan
        </Button>
      </div>

      {showAddForm && (
        <Card className="bg-white shadow-lg">
          <CardHeader className="bg-orama-primary text-white">
            <CardTitle>{editingId ? "Edit Study Plan" : "Create New Study Plan"}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <Input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Enter subject" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Topic</label>
                <Input value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} placeholder="Enter topic" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Duration</label>
                <Input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="e.g., 2 hours" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <Select value={form.priority} onValueChange={value => setForm({ ...form, priority: value as "high" | "medium" | "low" })}>
                  <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Due Date</label>
                <Input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <Select value={form.status} onValueChange={value => setForm({ ...form, status: value as "pending" | "in-progress" | "completed" })}>
                  <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
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
              <Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Additional notes..." />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              <Button className="bg-orama-primary hover:bg-orama-primary-light text-white" onClick={handleCreateOrEdit}>
                {editingId ? "Update Plan" : "Create Plan"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-white shadow-lg">
          <CardContent className="p-6 flex items-center gap-3">
            <Target className="h-8 w-8 text-orama-primary" />
            <div>
              <p className="text-2xl font-bold text-orama-primary">{studyPlans.filter(p => p.status === 'completed').length}</p>
              <p className="text-sm text-muted-foreground">Completed Plans</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-lg">
          <CardContent className="p-6 flex items-center gap-3">
            <Clock className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold text-orange-500">{studyPlans.filter(p => p.status === 'in-progress').length}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-lg">
          <CardContent className="p-6 flex items-center gap-3">
            <Calendar className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold text-red-500">{studyPlans.filter(p => p.status === 'pending').length}</p>
              <p className="text-sm text-muted-foreground">Pending Plans</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-lg">
        <CardHeader className="bg-orama-primary text-white">
          <CardTitle>Your Study Plans</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {studyPlans.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No study plans yet. Create one to get started!</p>
              </div>
            ) : (
              studyPlans.map(plan => (
                <div key={plan.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-orama-primary">{plan.subject}</h3>
                        <Badge className={getPriorityColor(plan.priority)}>{plan.priority}</Badge>
                        <Badge className={getStatusColor(plan.status)}>{plan.status}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-1">{plan.topic}</p>
                      {plan.notes && <p className="text-sm text-muted-foreground mb-2 italic">{plan.notes}</p>}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{plan.duration}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />Due: {new Date(plan.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(plan)}
                        className="border-orama-primary text-orama-primary hover:bg-orama-primary/10"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(plan, getNextStatus(plan.status))}
                        className="border-green-600 text-green-600 hover:bg-green-50"
                      >
                        {getButtonText(plan.status)}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(plan.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyPlanner;