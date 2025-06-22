import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ExcersiseChart } from "./components/ExcersiseChart"; // Corrected spelling to ExerciseChart
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

function Home({ children }) {
  const [fitnessPlan, setFitnessPlan] = useState("");
  const [userGoals, setUserGoals] = useState(null);

  useEffect(() => {
    const storedFitnessPlan = localStorage.getItem('fitnessPlan');
    const storedUserGoals = localStorage.getItem('userGoals');
    
    if (storedFitnessPlan) {
      setFitnessPlan(storedFitnessPlan);
    }
    
    if (storedUserGoals) {
      setUserGoals(JSON.parse(storedUserGoals));
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <SidebarProvider>
        <AppSidebar />

        <main className="flex-1 p-8 overflow-y-auto relative">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
          </div>

          <div className="relative z-10 container mx-auto max-w-7xl">
            <SidebarTrigger className="mb-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-2 hover:bg-white/20 transition-colors" />
            
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Welcome to Your Fitness Journey
              </h1>
              <p className="text-purple-200 text-xl">Your personalized workout plan is ready!</p>
            </div>

            {/* User Info Card */}
            {userGoals && (
              <Card className="mb-8 bg-white/10 backdrop-blur-sm border-purple-500/30 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {userGoals.name.charAt(0).toUpperCase()}
                    </div>
                    {userGoals.name}'s Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <p className="text-purple-300 text-sm font-medium">Age</p>
                      <p className="text-white text-xl font-bold">{userGoals.age}</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <p className="text-purple-300 text-sm font-medium">Weight</p>
                      <p className="text-white text-xl font-bold">{userGoals.weight} lbs</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <p className="text-purple-300 text-sm font-medium">Height</p>
                      <p className="text-white text-xl font-bold">{userGoals.height}</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <p className="text-purple-300 text-sm font-medium">Goal</p>
                      <p className="text-white text-lg font-bold truncate">{userGoals.fitnessGoal}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Fitness Plan Section */}
            {fitnessPlan && (
              <Card className="bg-white/10 backdrop-blur-sm border-purple-500/30 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    Your Personalized Fitness Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                    <div className="prose prose-invert max-w-none">
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed text-purple-100 font-mono bg-black/20 rounded-xl p-6 border border-purple-500/30 overflow-x-auto">
                        {fitnessPlan}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border-purple-500/30 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Start Workout</h3>
                  <p className="text-purple-200">Begin your fitness journey today</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border-blue-500/30 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Track Progress</h3>
                  <p className="text-blue-200">Monitor your fitness achievements</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border-green-500/30 shadow-2xl hover:shadow-green-500/25 transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Update Profile</h3>
                  <p className="text-green-200">Modify your fitness goals</p>
                </CardContent>
              </Card>
            </div>

            {children}
          </div>
        </main>
      </SidebarProvider>

      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default Home;