import { Calendar, Home, BarChart3 } from "lucide-react"
import Logo from "./Logo"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
    description: "Your fitness dashboard"
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
    description: "Track your progress"
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
    description: "Detailed workout calendar"
  },
]

export function AppSidebar() {
  return (
    <Sidebar className="bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 border-r border-purple-500/30" collapsible="none">
      <SidebarContent className="p-6">
        {/* Logo/Brand Section */}
        <div className="mb-8">
          <Logo size="default" />
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-purple-300 font-semibold text-sm uppercase tracking-wider mb-4">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className="group bg-white/5 hover:bg-white/10 border border-transparent hover:border-purple-500/30 rounded-xl transition-all duration-200 mb-2 !w-full !h-auto !p-3"
                  >
                    <a href={item.url} className="flex items-center gap-3 !w-full">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-200 flex-shrink-0">
                        <item.icon className="w-4 h-4 text-purple-300 group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-white font-medium group-hover:text-purple-200 transition-colors block">
                          {item.title}
                        </span>
                        <p className="text-purple-400 text-xs block">
                          {item.description}
                        </p>
                      </div>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-white/5 rounded-xl border border-purple-500/20">
          <h3 className="text-purple-300 font-semibold text-sm mb-3">Quick Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-purple-400 text-xs">This Week</span>
              <span className="text-white text-sm font-medium">5 workouts</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-400 text-xs">Calories</span>
              <span className="text-white text-sm font-medium">2,850</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-400 text-xs">Minutes</span>
              <span className="text-white text-sm font-medium">390</span>
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}