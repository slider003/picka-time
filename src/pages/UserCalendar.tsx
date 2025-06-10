
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import { format, addDays, isSameDay, parseISO } from "date-fns";
import { toast } from "sonner";

interface CalendarData {
  id: string;
  name: string;
  maxSelections: number;
  startDate: string;
  endDate: string;
  responses: any[];
}

interface TimeSlot {
  date: Date;
  time: string;
  id: string;
}

const UserCalendar = () => {
  const { calendarId } = useParams();
  const [calendar, setCalendar] = useState<CalendarData | null>(null);
  const [userName, setUserName] = useState("");
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
  const [timeSlots] = useState([
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ]);

  useEffect(() => {
    if (calendarId) {
      const calendars = JSON.parse(localStorage.getItem("calendars") || "{}");
      const calendarData = calendars[calendarId];
      if (calendarData) {
        setCalendar(calendarData);
      }
    }
  }, [calendarId]);

  const generateDateRange = () => {
    if (!calendar) return [];
    const start = parseISO(calendar.startDate);
    const end = parseISO(calendar.endDate);
    const dates = [];
    let current = start;
    
    while (current <= end) {
      dates.push(new Date(current));
      current = addDays(current, 1);
    }
    
    return dates;
  };

  const toggleTimeSlot = (date: Date, time: string) => {
    const slotId = `${format(date, 'yyyy-MM-dd')}-${time}`;
    const existingIndex = selectedSlots.findIndex(slot => slot.id === slotId);
    
    if (existingIndex >= 0) {
      setSelectedSlots(prev => prev.filter((_, index) => index !== existingIndex));
    } else {
      if (selectedSlots.length >= (calendar?.maxSelections || 5)) {
        toast.error(`You can only select up to ${calendar?.maxSelections} time slots`);
        return;
      }
      setSelectedSlots(prev => [...prev, { date, time, id: slotId }]);
    }
  };

  const isSlotSelected = (date: Date, time: string) => {
    const slotId = `${format(date, 'yyyy-MM-dd')}-${time}`;
    return selectedSlots.some(slot => slot.id === slotId);
  };

  const submitResponse = () => {
    if (!userName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    
    if (selectedSlots.length === 0) {
      toast.error("Please select at least one time slot");
      return;
    }

    if (!calendar || !calendarId) return;

    const response = {
      id: Date.now().toString(),
      userName: userName.trim(),
      selectedSlots: selectedSlots.map(slot => ({
        date: format(slot.date, 'yyyy-MM-dd'),
        time: slot.time,
        datetime: `${format(slot.date, 'yyyy-MM-dd')} ${slot.time}`
      })),
      submittedAt: new Date().toISOString()
    };

    const calendars = JSON.parse(localStorage.getItem("calendars") || "{}");
    calendars[calendarId].responses.push(response);
    localStorage.setItem("calendars", JSON.stringify(calendars));

    toast.success("Your availability has been submitted!");
    setUserName("");
    setSelectedSlots([]);
  };

  if (!calendar) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-600">Calendar not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const dateRange = generateDateRange();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{calendar.name}</h1>
          <p className="text-gray-600">Select all the time slots when you're available</p>
          <div className="flex gap-4 mt-4">
            <Badge variant="outline">
              <Calendar className="mr-1 h-3 w-3" />
              {format(parseISO(calendar.startDate), 'MMM d')} - {format(parseISO(calendar.endDate), 'MMM d')}
            </Badge>
            <Badge variant="outline">
              <User className="mr-1 h-3 w-3" />
              Max {calendar.maxSelections} selections
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Available Time Slots</CardTitle>
                <CardDescription>
                  Click on time slots when you're available. Selected: {selectedSlots.length}/{calendar.maxSelections}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {dateRange.map(date => (
                    <div key={date.toISOString()}>
                      <h3 className="font-semibold text-lg mb-3">
                        {format(date, 'EEEE, MMMM d')}
                      </h3>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {timeSlots.map(time => (
                          <Button
                            key={`${date.toISOString()}-${time}`}
                            variant={isSlotSelected(date, time) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleTimeSlot(date, time)}
                            className="text-xs"
                          >
                            <Clock className="mr-1 h-3 w-3" />
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Submit Your Availability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="userName">Your Name</Label>
                  <Input
                    id="userName"
                    placeholder="Enter your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Selected Time Slots ({selectedSlots.length})</Label>
                  <div className="max-h-40 overflow-y-auto space-y-1 mt-2">
                    {selectedSlots.length === 0 ? (
                      <p className="text-sm text-gray-500">No slots selected</p>
                    ) : (
                      selectedSlots.map(slot => (
                        <div key={slot.id} className="text-sm bg-blue-50 p-2 rounded">
                          {format(slot.date, 'MMM d')} at {slot.time}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <Button onClick={submitResponse} className="w-full">
                  Submit Availability
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCalendar;
