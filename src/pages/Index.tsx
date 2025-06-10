
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, Clock, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Calendar Scheduler</h1>
              <p className="text-muted-foreground mt-2">
                Create and share availability calendars with your team
              </p>
            </div>
            <Button onClick={() => navigate("/admin")}>
              Admin Panel
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            Coordinate schedules effortlessly
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create availability calendars, share them with your team, and find the best meeting times instantly.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CalendarDays className="h-8 w-8 mb-2" />
              <CardTitle>Easy Scheduling</CardTitle>
              <CardDescription>
                Create custom time slots and date ranges for any event or meeting
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 mb-2" />
              <CardTitle>Team Collaboration</CardTitle>
              <CardDescription>
                Share calendar links with your team and collect availability responses
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="h-8 w-8 mb-2" />
              <CardTitle>Real-time Results</CardTitle>
              <CardDescription>
                See responses update in real-time and identify the best meeting times
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Create your first availability calendar in minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/admin")} className="w-full">
                Create Calendar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
