
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Calendar, Eye, BarChart3 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/auth/AuthModal";

interface Calendar {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  max_selections: number;
  created_at: string;
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    maxSelections: 5,
  });

  useEffect(() => {
    if (!loading && !user) {
      setShowAuthModal(true);
    } else if (user) {
      fetchCalendars();
    }
  }, [user, loading]);

  const fetchCalendars = async () => {
    try {
      const { data, error } = await supabase
        .from('calendars')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCalendars(data || []);
    } catch (error) {
      console.error('Error fetching calendars:', error);
      toast.error('Failed to load calendars');
    }
  };

  const createCalendar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('calendars')
        .insert({
          name: formData.name,
          description: formData.description || null,
          start_date: formData.startDate,
          end_date: formData.endDate,
          max_selections: formData.maxSelections,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Calendar created successfully!');
      setShowCreateForm(false);
      setFormData({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        maxSelections: 5,
      });
      fetchCalendars();
    } catch (error) {
      console.error('Error creating calendar:', error);
      toast.error('Failed to create calendar');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
              <p className="text-muted-foreground mt-2">
                Manage your availability calendars
              </p>
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Calendar
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Create New Calendar</CardTitle>
              <CardDescription>
                Set up a new availability calendar for your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={createCalendar} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Calendar Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Team Meeting"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxSelections">Max Selections per Person</Label>
                    <Input
                      id="maxSelections"
                      type="number"
                      min="1"
                      max="20"
                      value={formData.maxSelections}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxSelections: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description (optional)</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Weekly team sync meeting"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">Create Calendar</Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {calendars.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No calendars yet. Create your first one!</p>
              </CardContent>
            </Card>
          ) : (
            calendars.map(calendar => (
              <Card key={calendar.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{calendar.name}</CardTitle>
                      {calendar.description && (
                        <CardDescription>{calendar.description}</CardDescription>
                      )}
                      <CardDescription>
                        {format(new Date(calendar.start_date), 'MMM d')} - {format(new Date(calendar.end_date), 'MMM d, yyyy')}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/calendar/${calendar.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/results/${calendar.id}`)}
                      >
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Results
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default AdminPanel;
