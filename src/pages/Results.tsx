
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Users, Calendar, Clock, Trophy } from "lucide-react";
import { format, parseISO } from "date-fns";

interface CalendarData {
  id: string;
  name: string;
  maxSelections: number;
  startDate: string;
  endDate: string;
  responses: any[];
}

interface TimeSlotCount {
  datetime: string;
  date: string;
  time: string;
  count: number;
  participants: string[];
}

const Results = () => {
  const { calendarId } = useParams();
  const [calendar, setCalendar] = useState<CalendarData | null>(null);
  const [timeSlotCounts, setTimeSlotCounts] = useState<TimeSlotCount[]>([]);

  useEffect(() => {
    if (calendarId) {
      const calendars = JSON.parse(localStorage.getItem("calendars") || "{}");
      const calendarData = calendars[calendarId];
      if (calendarData) {
        setCalendar(calendarData);
        calculateTimeSlotCounts(calendarData.responses);
      }
    }
  }, [calendarId]);

  const calculateTimeSlotCounts = (responses: any[]) => {
    const counts: { [key: string]: TimeSlotCount } = {};

    responses.forEach(response => {
      response.selectedSlots.forEach((slot: any) => {
        const key = slot.datetime;
        if (!counts[key]) {
          counts[key] = {
            datetime: key,
            date: slot.date,
            time: slot.time,
            count: 0,
            participants: []
          };
        }
        counts[key].count++;
        counts[key].participants.push(response.userName);
      });
    });

    const sortedCounts = Object.values(counts).sort((a, b) => b.count - a.count);
    setTimeSlotCounts(sortedCounts);
  };

  const getBadgeVariant = (count: number, maxCount: number) => {
    const percentage = count / maxCount;
    if (percentage >= 0.8) return "default";
    if (percentage >= 0.6) return "secondary";
    return "outline";
  };

  const getShareableLink = () => {
    return `${window.location.origin}${window.location.pathname}#/calendar/${calendarId}`;
  };

  const copyShareableLink = () => {
    navigator.clipboard.writeText(getShareableLink());
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

  const maxResponseCount = calendar.responses.length;
  const topTimeSlots = timeSlotCounts.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link to="/admin">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{calendar.name} - Results</h1>
          <div className="flex gap-4">
            <Badge variant="outline">
              <Users className="mr-1 h-3 w-3" />
              {calendar.responses.length} responses
            </Badge>
            <Badge variant="outline">
              <Calendar className="mr-1 h-3 w-3" />
              {format(parseISO(calendar.startDate), 'MMM d')} - {format(parseISO(calendar.endDate), 'MMM d')}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {topTimeSlots.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    Best Time Slots
                  </CardTitle>
                  <CardDescription>
                    Time slots with the highest availability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topTimeSlots.map((slot, index) => (
                      <div key={slot.datetime} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                            index === 1 ? 'bg-gray-100 text-gray-800' :
                            index === 2 ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-50 text-blue-800'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold">
                              {format(parseISO(slot.date), 'EEEE, MMM d')} at {slot.time}
                            </p>
                            <p className="text-sm text-gray-600">
                              {slot.participants.join(', ')}
                            </p>
                          </div>
                        </div>
                        <Badge variant={getBadgeVariant(slot.count, maxResponseCount)}>
                          {slot.count}/{maxResponseCount}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>All Time Slots</CardTitle>
                <CardDescription>
                  Complete availability breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                {timeSlotCounts.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No responses yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Available</TableHead>
                        <TableHead>Participants</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {timeSlotCounts.map(slot => (
                        <TableRow key={slot.datetime}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              {format(parseISO(slot.date), 'MMM d')} at {slot.time}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getBadgeVariant(slot.count, maxResponseCount)}>
                              {slot.count}/{maxResponseCount}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {slot.participants.join(', ')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Share Calendar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Send this link to participants:</p>
                  <div className="flex gap-2">
                    <input
                      readOnly
                      value={getShareableLink()}
                      className="flex-1 px-3 py-2 text-sm border rounded-md bg-gray-50"
                    />
                    <Button size="sm" onClick={copyShareableLink}>
                      Copy
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Responses</CardTitle>
              </CardHeader>
              <CardContent>
                {calendar.responses.length === 0 ? (
                  <p className="text-sm text-gray-500">No responses yet</p>
                ) : (
                  <div className="space-y-3">
                    {calendar.responses.map(response => (
                      <div key={response.id} className="p-3 bg-white rounded border">
                        <div className="font-semibold text-sm">{response.userName}</div>
                        <div className="text-xs text-gray-500">
                          {response.selectedSlots.length} slots selected
                        </div>
                        <div className="text-xs text-gray-400">
                          {format(parseISO(response.submittedAt), 'MMM d, h:mm a')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
