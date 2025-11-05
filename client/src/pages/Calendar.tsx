import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { CustomCalendar } from "@/components/CustomCalendar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CalendarIcon, Plus } from "lucide-react";

export default function Calendar() {
  // Sample events for demonstration
  const events = [
    {
      id: "1",
      title: "Board Meeting",
      start: new Date(2025, 10, 5, 10, 0),
      end: new Date(2025, 10, 5, 11, 30),
      color: "#1A2EFF",
    },
    {
      id: "2",
      title: "Investor Call",
      start: new Date(2025, 10, 7, 14, 0),
      end: new Date(2025, 10, 7, 15, 0),
      color: "#10B981",
    },
  ];

  const handleDateClick = (date: Date) => {
    console.log("Date clicked:", date);
    // TODO: Open create event modal
  };

  const handleEventClick = (event: any) => {
    console.log("Event clicked:", event.title);
    // TODO: Open event details modal
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Calendar</h1>
            <p className="text-muted-foreground mt-1">
              Unified view of your work and personal calendars
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </Button>
        </div>

        {/* Calendar Connections */}
        <Card className="p-6 bg-white">
          <h2 className="text-lg font-semibold mb-4">Connected Calendars</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Google Calendar</p>
                  <p className="text-sm text-muted-foreground">Not connected</p>
                </div>
              </div>
              <Button variant="outline">Connect</Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Microsoft 365</p>
                  <p className="text-sm text-muted-foreground">Not connected</p>
                </div>
              </div>
              <Button variant="outline">Connect</Button>
            </div>
          </div>
        </Card>

        {/* Custom Calendar Component */}
        <CustomCalendar
          events={events}
          onDateClick={handleDateClick}
          onEventClick={handleEventClick}
        />
      </div>
    </DashboardLayout>
  );
}
