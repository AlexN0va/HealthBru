import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

function DepthPlan({ children }) {
  return (
    // Use a flex container for the overall layout (sidebar + main content)
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <SidebarProvider>
        {/*
          AppSidebar: This will be your fixed-width sidebar on the left.
          Ensure AppSidebar itself has a width (e.g., w-64, or explicit px width).
          If it's meant to be collapsible, its internal logic should handle that.
        */}
        <AppSidebar />

        {/* Main content area: This will take the remaining space */}
        <main className="flex-1 p-8 overflow-y-auto"> {/* p-8 for padding, overflow-y-auto for scrollable content */}
          <SidebarTrigger className="mb-4" /> {/* Add some margin below the trigger */}
          
          {/*
            Inner container for your main content to control its width.
            Use `mx-auto` to center it horizontally.
            `max-w-screen-lg` (or `max-w-3xl`, `max-w-5xl`, etc.) sets the max width.
          */}
          <div className="container mx-auto max-w-screen-lg"> {/* You can adjust max-w-screen-lg */}
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
             In-Depth Plan
            </h1>

            {/*
              Your chart component
              Ensure ExcersiseChart (now ExerciseChart) has its own height or its parent provides it.
              Adding some margin bottom for spacing.
            */}

            <div>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">In-Depth Plan</p>
                
            </div>

            {/* Any other children passed to the Dashboard component */}
            {children}
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}

export default DepthPlan;