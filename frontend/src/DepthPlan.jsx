import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, Target, Flame, CalendarDays, CalendarRange } from "lucide-react";

function DepthPlan({ children }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState("month"); // "month" or "week"
  const [workoutData, setWorkoutData] = useState({});

  // Load workout data from localStorage on component mount
  useEffect(() => {
    const storedWorkoutSchedule = localStorage.getItem('workoutSchedule');
    if (storedWorkoutSchedule) {
      try {
        const parsedSchedule = JSON.parse(storedWorkoutSchedule);
        setWorkoutData(parsedSchedule);
        console.log("Loaded workout schedule:", parsedSchedule);
        
        // Log specific workout details to debug
        Object.keys(parsedSchedule).forEach(date => {
          const workout = parsedSchedule[date];
          console.log(`Date ${date}:`, {
            type: workout.type,
            name: workout.name,
            exercises: workout.exercises,
            exerciseCount: workout.exercises?.length
          });
        });
      } catch (error) {
        console.error("Error parsing workout schedule:", error);
      }
    } else {
      console.log("No workout schedule found in localStorage");
    }
  }, []);

  // Sample workout data (fallback if no data from Groq)
  const sampleWorkoutData = {
    "2024-01-15": { type: "Strength", duration: "60min", exercises: ["Bench Press", "Squats", "Deadlifts"] },
    "2024-01-17": { type: "Cardio", duration: "45min", exercises: ["Running", "HIIT"] },
    "2024-01-19": { type: "Strength", duration: "75min", exercises: ["Pull-ups", "Rows", "Overhead Press"] },
    "2024-01-22": { type: "Cardio", duration: "30min", exercises: ["Cycling", "Jump Rope"] },
    "2024-01-24": { type: "Strength", duration: "60min", exercises: ["Leg Press", "Lunges", "Calf Raises"] },
    "2024-01-26": { type: "Rest", duration: "0min", exercises: ["Active Recovery", "Stretching"] },
  };

  const formatExercise = (exercise) => {
    // If exercise already contains sets and reps format, return as is
    if (exercise.includes('sets') && exercise.includes('reps')) {
      return exercise;
    }
    
    // Look for patterns like "3x12", "4x10", etc.
    const setsRepsPattern = /(\d+)\s*x\s*(\d+)/;
    const match = exercise.match(setsRepsPattern);
    if (match) {
      const sets = match[1];
      const reps = match[2];
      // Extract the exercise name (everything before the sets/reps)
      const exerciseName = exercise.replace(setsRepsPattern, '').trim();
      return `${exerciseName}: ${sets} sets x ${reps} reps`;
    }
    
    // Look for patterns like "3 sets 12 reps", "4 sets 10 reps", etc.
    const setsRepsPattern2 = /(\d+)\s*sets?\s+(\d+)\s*reps?/i;
    const match2 = exercise.match(setsRepsPattern2);
    if (match2) {
      const sets = match2[1];
      const reps = match2[2];
      // Extract the exercise name (everything before the sets/reps)
      const exerciseName = exercise.replace(setsRepsPattern2, '').trim();
      return `${exerciseName}: ${sets} sets x ${reps} reps`;
    }
    
    // Look for patterns like "Bench Press 3 12" (exercise name followed by two numbers)
    const exerciseWithNumbers = /^(.+?)\s+(\d+)\s+(\d+)$/;
    const match3 = exercise.match(exerciseWithNumbers);
    if (match3) {
      const exerciseName = match3[1].trim();
      const sets = match3[2];
      const reps = match3[3];
      return `${exerciseName}: ${sets} sets x ${reps} reps`;
    }
    
    // Look for patterns like "Squats: 3 sets x 10 reps" (already formatted)
    const alreadyFormatted = /^(.+?):\s*(\d+)\s*sets?\s*x\s*(\d+)\s*reps?/i;
    const match4 = exercise.match(alreadyFormatted);
    if (match4) {
      return exercise; // Already in correct format
    }
    
    // If it's just an exercise name, add default sets/reps
    return `${exercise}: 3 sets x 12 reps`;
  };

  const truncateWorkoutName = (name, maxLength = 15) => {
    if (!name) return '';
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + '...';
  };

  // Use workout data from Groq if available, otherwise use sample data
  const getWorkoutForDate = (date) => {
    const dateStr = formatDate(date);
    return workoutData[dateStr] || sampleWorkoutData[dateStr];
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getDaysInWeek = (date) => {
    const days = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Start from Sunday
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getWorkoutColor = (type) => {
    switch (type) {
      case "Strength": return "from-purple-500 to-pink-500";
      case "Cardio": return "from-blue-500 to-cyan-500";
      case "Rest": return "from-green-500 to-emerald-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getWorkoutIcon = (type) => {
    switch (type) {
      case "Strength": return <Target className="w-4 h-4" />;
      case "Cardio": return <Flame className="w-4 h-4" />;
      case "Rest": return <Clock className="w-4 h-4" />;
      default: return <CalendarIcon className="w-4 h-4" />;
    }
  };

  const nextPeriod = () => {
    if (viewMode === "month") {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    } else {
      const nextWeek = new Date(currentWeek);
      nextWeek.setDate(currentWeek.getDate() + 7);
      setCurrentWeek(nextWeek);
    }
  };

  const prevPeriod = () => {
    if (viewMode === "month") {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    } else {
      const prevWeek = new Date(currentWeek);
      prevWeek.setDate(currentWeek.getDate() - 7);
      setCurrentWeek(prevWeek);
    }
  };

  const getPeriodTitle = () => {
    if (viewMode === "month") {
      return `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;
    } else {
      const startOfWeek = new Date(currentWeek);
      startOfWeek.setDate(currentWeek.getDate() - currentWeek.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
        return `${monthNames[startOfWeek.getMonth()]} ${startOfWeek.getDate()} - ${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`;
      } else {
        return `${monthNames[startOfWeek.getMonth()]} ${startOfWeek.getDate()} - ${monthNames[endOfWeek.getMonth()]} ${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`;
      }
    }
  };

  const days = viewMode === "month" ? getDaysInMonth(currentMonth) : getDaysInWeek(currentWeek);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <SidebarProvider>
        <AppSidebar />

        <main className="flex-1 p-8 overflow-y-auto relative">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          </div>

          <div className="relative z-10 container mx-auto max-w-7xl">
            <SidebarTrigger className="mb-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-2 hover:bg-white/20 transition-colors" />
            
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                In-Depth Workout Calendar
              </h1>
              <p className="text-purple-200 text-xl">Plan and track your fitness journey</p>
            </div>

            {/* View Mode Toggle */}
            <Card className="mb-8 bg-white/10 backdrop-blur-sm border-purple-500/30 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-purple-200 font-medium">View Mode:</span>
                    <div className="flex bg-white/10 rounded-lg p-1">
                      <Button
                        onClick={() => setViewMode("month")}
                        variant="ghost"
                        className={`px-4 py-2 rounded-md transition-all ${
                          viewMode === "month"
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                            : "text-purple-300 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <CalendarDays className="w-4 h-4 mr-2" />
                        Month
                      </Button>
                      <Button
                        onClick={() => setViewMode("week")}
                        variant="ghost"
                        className={`px-4 py-2 rounded-md transition-all ${
                          viewMode === "week"
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                            : "text-purple-300 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <CalendarRange className="w-4 h-4 mr-2" />
                        Week
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calendar Navigation */}
            <Card className="mb-8 bg-white/10 backdrop-blur-sm border-purple-500/30 shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Button
                    onClick={prevPeriod}
                    variant="ghost"
                    className="text-purple-300 hover:text-white hover:bg-white/10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <CardTitle className="text-2xl text-white">
                    {getPeriodTitle()}
                  </CardTitle>
                  <Button
                    onClick={nextPeriod}
                    variant="ghost"
                    className="text-purple-300 hover:text-white hover:bg-white/10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Calendar Grid */}
            <Card className="mb-8 bg-white/10 backdrop-blur-sm border-purple-500/30 shadow-2xl">
              <CardContent className="p-6">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center p-3">
                      <span className="text-purple-300 font-semibold text-sm">{day}</span>
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className={`grid grid-cols-7 gap-2 ${viewMode === "week" ? "h-96" : ""}`}>
                  {days.map((day, index) => {
                    if (!day) {
                      return <div key={index} className={viewMode === "week" ? "h-96" : "h-24"}></div>;
                    }

                    const workout = getWorkoutForDate(day);
                    const isToday = formatDate(day) === formatDate(new Date());
                    const isSelected = selectedDate && formatDate(day) === formatDate(selectedDate);

                    return (
                      <div
                        key={index}
                        className={`${viewMode === "week" ? "h-96" : "h-24"} p-2 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                          isToday
                            ? "border-purple-400 bg-purple-500/20"
                            : isSelected
                            ? "border-pink-400 bg-pink-500/20"
                            : "border-purple-500/30 hover:border-purple-400/50 hover:bg-white/5"
                        }`}
                        onClick={() => setSelectedDate(day)}
                      >
                        <div className="text-right mb-1">
                          <span className={`text-sm font-medium ${
                            isToday ? "text-purple-200" : "text-purple-300"
                          }`}>
                            {day.getDate()}
                          </span>
                        </div>
                        
                        {workout && (
                          <div className={`bg-gradient-to-r ${getWorkoutColor(workout.type)} rounded-md p-1 text-white ${viewMode === "week" ? "p-2 mb-2" : "p-1"}`}>
                            <div className={`flex items-center gap-1 ${viewMode === "week" ? "mb-1" : "mb-0"}`}>
                              {getWorkoutIcon(workout.type)}
                              <span className={`font-semibold ${viewMode === "week" ? "text-xs" : "text-xs leading-tight"}`}>
                                {viewMode === "week" ? (workout.name || workout.type) : truncateWorkoutName(workout.name || workout.type, 13)}
                              </span>
                            </div>
                            <div className={`opacity-90 ${viewMode === "week" ? "text-xs" : "text-[10px]"}`}>{workout.duration}</div>
                          </div>
                        )}

                        {viewMode === "week" && workout && (
                          <div className="mt-2">
                            <p className="text-purple-200 text-xs font-medium mb-1">Exercises:</p>
                            <ul className="space-y-1">
                              {workout.exercises.map((exercise, idx) => (
                                <li key={idx} className="text-purple-300 text-xs">• {formatExercise(exercise)}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Selected Date Details */}
            {selectedDate && (
              <Card className="bg-white/10 backdrop-blur-sm border-purple-500/30 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center gap-3">
                    <CalendarIcon className="w-6 h-6 text-purple-400" />
                    {selectedDate.toLocaleDateString("en-US", { 
                      weekday: "long", 
                      year: "numeric", 
                      month: "long", 
                      day: "numeric" 
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {getWorkoutForDate(selectedDate) ? (
                    <div className="space-y-4">
                      <div className={`bg-gradient-to-r ${getWorkoutColor(getWorkoutForDate(selectedDate).type)} rounded-xl p-6 text-white`}>
                        <div className="flex items-center gap-3 mb-4">
                          {getWorkoutIcon(getWorkoutForDate(selectedDate).type)}
                          <h3 className="text-xl font-bold">{getWorkoutForDate(selectedDate).name || getWorkoutForDate(selectedDate).type} Workout</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm opacity-90 mb-2">Duration</p>
                            <p className="text-lg font-semibold">{getWorkoutForDate(selectedDate).duration}</p>
                          </div>
                          <div>
                            <p className="text-sm opacity-90 mb-2">Exercises</p>
                            <ul className="space-y-1">
                              {getWorkoutForDate(selectedDate).exercises.map((exercise, idx) => (
                                <li key={idx} className="text-sm">• {formatExercise(exercise)}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CalendarIcon className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
                      <h3 className="text-xl font-semibold text-white mb-2">No Workout Scheduled</h3>
                      <p className="text-purple-300 mb-4">This day is free for rest or spontaneous activity</p>
                      <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Schedule Workout
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {children}
          </div>
        </main>
      </SidebarProvider>

      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}

export default DepthPlan;