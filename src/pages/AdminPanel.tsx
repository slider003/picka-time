
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Copy, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AdminPanel = () => {
  const [calendarName, setCalendarName] = useState("");
  const [maxSelections, setMaxSelections] = useState(5);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [generatedLink, setGeneratedLink] = useState("");
  const navigate = useNavigate();

  const generateCalendar = () => {
    if (!calendarName || !startDate || !endDate) {
      toast.error("Please fill in all fields");
      return;
    }

    const calendarId = Date.now().toString();
    const calendarData = {
      id: calendarId,
      name: calendarName,
      maxSelections,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      responses: []
    };

    // Store calendar data in localStorage
    const calendars = JSON.parse(localStorage.getItem("calendars") || "{}");
    calendars[calendarId] = calendarData;
    localStorage.setItem("calendars", JSON.stringify(calendars));

    const link = `${window.location.origin}${window.location.pathname}#/calendar/${calendarId}`;
    setGeneratedLink(link);
    toast.success("Calendar created successfully!");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    toast.success("Link copied to clipboard!");
  };

  const viewResults = () => {
    if (generatedLink) {
      const calendarId = generatedLink.split("/").pop();
      navigate(`/results/${calendarId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Create a new time slot calendar</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Calendar Configuration</CardTitle>
            <CardDescription>
              Set up your calendar parameters and date range
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="calendarName">Calendar Name</Label>
              <Input
                id="calendarName"
                placeholder="Team Meeting Availability"
                value={calendarName}
                onChange={(e) => setCalendarName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="maxSelections">Maximum Selections Per User</Label>
              <Input
                id="maxSelections"
                type="number"
                min="1"
                max="50"
                value={maxSelections}
                onChange={(e) => setMaxSelections(parseInt(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Button onClick={generateCalendar} className="w-full">
              Generate Calendar Link
            </Button>

            {generatedLink && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">Calendar Created!</h3>
                <div className="flex items-center gap-2 mb-3">
                  <Input value={generatedLink} readOnly className="flex-1" />
                  <Button onClick={copyLink} size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={viewResults} variant="outline" className="w-full">
                  View Results
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
