import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ExcersiseChart } from "./components/ExcersiseChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Target, Activity } from "lucide-react";

function Analytics({ children }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <SidebarProvider>
        <AppSidebar />

        <main className="flex-1 p-8 overflow-y-auto relative">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
          </div>

          <div className="relative z-10 container mx-auto max-w-7xl">
            <SidebarTrigger className="mb-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-2 hover:bg-white/20 transition-colors" />
            
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-purple-200 text-xl">Track your fitness progress and performance</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border-purple-500/30 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-purple-300 text-sm font-medium">Total Workouts</p>
                      <p className="text-white text-2xl font-bold">24</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border-blue-500/30 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-blue-300 text-sm font-medium">Calories Burned</p>
                      <p className="text-white text-2xl font-bold">12,450</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border-green-500/30 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-green-300 text-sm font-medium">Avg. Duration</p>
                      <p className="text-white text-2xl font-bold">52min</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border-orange-500/30 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-orange-300 text-sm font-medium">Success Rate</p>
                      <p className="text-white text-2xl font-bold">87%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Exercise Progress Chart */}
            <Card className="mb-8 bg-white/10 backdrop-blur-sm border-purple-500/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  Exercise Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <ExcersiseChart />
                </div>
              </CardContent>
            </Card>

            {/* Additional Analytics Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Workout Type Distribution */}
              <Card className="bg-white/10 backdrop-blur-sm border-purple-500/30 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Workout Type Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
                        <span className="text-purple-200">Strength Training</span>
                      </div>
                      <span className="text-white font-semibold">45%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded"></div>
                        <span className="text-blue-200">Cardio</span>
                      </div>
                      <span className="text-white font-semibold">35%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded"></div>
                        <span className="text-green-200">Flexibility</span>
                      </div>
                      <span className="text-white font-semibold">20%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Goals Progress */}
              <Card className="bg-white/10 backdrop-blur-sm border-purple-500/30 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Weekly Goals Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-purple-200 text-sm">Workouts</span>
                        <span className="text-white text-sm">4/5</span>
                      </div>
                      <div className="w-full bg-purple-800 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-blue-200 text-sm">Calories</span>
                        <span className="text-white text-sm">2,850/3,000</span>
                      </div>
                      <div className="w-full bg-blue-800 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-green-200 text-sm">Minutes</span>
                        <span className="text-white text-sm">390/420</span>
                      </div>
                      <div className="w-full bg-green-800 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full" style={{ width: '93%' }}></div>
                      </div>
                    </div>
                  </div>
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

export default Analytics;