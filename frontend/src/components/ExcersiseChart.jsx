"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

const exerciseData = [
  { day: "Mon", workoutMinutes: 45, caloriesBurned: 320, workouts: 2 },
  { day: "Tue", workoutMinutes: 60, caloriesBurned: 450, workouts: 3 },
  { day: "Wed", workoutMinutes: 30, caloriesBurned: 220, workouts: 1 },
  { day: "Thu", workoutMinutes: 75, caloriesBurned: 550, workouts: 3 },
  { day: "Fri", workoutMinutes: 50, caloriesBurned: 380, workouts: 2 },
  { day: "Sat", workoutMinutes: 90, caloriesBurned: 650, workouts: 4 },
  { day: "Sun", workoutMinutes: 40, caloriesBurned: 280, workouts: 1 },
]

export function ExcersiseChart() {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={exerciseData}>
          <defs>
            <linearGradient id="workoutGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="caloriesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="day" 
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(17, 24, 39, 0.9)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '8px',
              color: '#f3f4f6'
            }}
            labelStyle={{ color: '#9ca3af' }}
            formatter={(value, name) => {
              if (name === 'workoutMinutes') return [value, 'Workout Minutes'];
              if (name === 'caloriesBurned') return [value, 'Calories Burned'];
              return [value, name];
            }}
          />
          <Area
            type="monotone"
            dataKey="workoutMinutes"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="url(#workoutGradient)"
            name="Workout Minutes"
          />
          <Area
            type="monotone"
            dataKey="caloriesBurned"
            stroke="#ec4899"
            strokeWidth={2}
            fill="url(#caloriesGradient)"
            name="Calories Burned"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
