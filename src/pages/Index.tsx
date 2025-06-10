
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Clock, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Time Slot Scheduler
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Find the perfect time that works for everyone
          </p>
          
          <div className="flex gap-4 justify-center mb-12">
            <Link to="/admin">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Calendar className="mr-2 h-5 w-5" />
                Create New Calendar
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Calendar className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Set Date Range</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Define the available date range and time slots for participants to choose from
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Share Link</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Send the calendar link to participants so they can select their available times
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="h-8 w-8 text-orange-600 mb-2" />
              <CardTitle>Collect Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Participants select multiple time slots when they're available
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CheckCircle className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Find Best Time</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Automatically find the optimal time slot that works for the most people
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            How it works
          </h2>
          <div className="max-w-3xl mx-auto text-gray-600 space-y-4">
            <p>
              1. <strong>Admin Setup:</strong> Create a calendar with your desired date range and maximum selections per user
            </p>
            <p>
              2. <strong>Share:</strong> Send the generated link to all participants
            </p>
            <p>
              3. <strong>Collect:</strong> Participants select all time slots when they're available
            </p>
            <p>
              4. <strong>Analyze:</strong> View results and see the optimal time slots with the most availability
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
