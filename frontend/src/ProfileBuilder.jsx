import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

let userGoals = {
  name: '',
  age: 0,
  weight: 0,
  height: 0,
  sex: '',
  fitnessLevel: '',
  fitnessGoal: '',
};

const questions = [
  "YOOO wsg g, was your name?",
  "fye. NO weird shi, but how old are you?",
  "BET wb current weight (in pounds)?",
  "Wild. okay wat about your height (e.g., 5'7)?",
  "Igh n wat is your sex? (male/female/other)",
  "Wat about your fitness level? (beginner/intermediate/advanced)",
  "Igh, finally wat is your primary fitness goal? What we tryna achieve jow",
];

function ProfileBuilder() {
  
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0); 
  const [scheduleWorkouts, setScheduleWorkouts] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [userName, setUserName] = useState("User"); // Track user's name
  const [messages, setMessages] = useState([
    { sender: "HealthBru", text: "What is your name?" },
  ]);

  // Auto-scroll ref
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Clear old data when component mounts (fresh session)
  useEffect(() => {
    localStorage.removeItem('fitnessPlan');
    localStorage.removeItem('userGoals');
  }, []);

  async function handleComplete(msgs) {

  userGoals.name = msgs[1]?.text || '';
  userGoals.age = parseInt(msgs[3]?.text, 10) || 0;
  userGoals.weight = parseInt(msgs[5]?.text, 10) || 0;
  userGoals.height = msgs[7]?.text || '';
  userGoals.sex = msgs[9]?.text || '';
  userGoals.fitnessLevel = msgs[11]?.text || '';
  userGoals.fitnessGoal = msgs[13]?.text || '';

  console.log("User Goals:", userGoals);

    const mainURL =  "http://127.0.0.1:8000/" ;

    try { // catch error 
      const response = await axios.post(mainURL, userGoals, { // Remove JSON.stringify and responseType
        headers: {
          "Content-Type": 'application/json', // what type of data to expect
        },
      });

      if (response.status === 200) { // success
        console.log("Data uploaded successfully");
        console.log("Fitness Plan:", response.data.fitness_plan);
        console.log("Workout Schedule:", response.data.workout_schedule);
        
        // Store the fitness plan and workout schedule in localStorage
        localStorage.setItem('fitnessPlan', response.data.fitness_plan);
        localStorage.setItem('workoutSchedule', JSON.stringify(response.data.workout_schedule));
        localStorage.setItem('userGoals', JSON.stringify(userGoals));
        
        navigate("/home"); // navigate to home page after successful upload
      }
    } catch (error) {
      console.error("Error uploading data:", error);
    }
}

function handleNext() {
  if (input.trim() === "") return;

  // Validate inputs based on step
  if (step === 3) { // Height input
    const height = input.trim();
    // Validate height format: should be like "5'7", "6'0", "5'11", etc.
    const heightPattern = /^\d+'(\d{1,2})?$/;
    if (!heightPattern.test(height)) {
      alert("Please enter height in the format: feet'inches (e.g., 5'7, 6'0, 5'11)");
      return;
    }
    // Additional validation for reasonable height ranges
    const parts = height.split("'");
    const feet = parseInt(parts[0]);
    const inches = parts[1] ? parseInt(parts[1]) : 0;
    if (feet < 3 || feet > 8 || inches < 0 || inches > 11) {
      alert("Please enter a reasonable height (between 3'0 and 8'11)");
      return;
    }
  }
  
  if (step === 4) { // Sex input
    const sex = input.trim().toLowerCase();
    if (!['male', 'female', 'other'].includes(sex)) {
      alert("Please enter 'male', 'female', or 'other'");
      return;
    }
  }
  
  if (step === 5) { // Fitness level input
    const level = input.trim().toLowerCase();
    if (!['beginner', 'intermediate', 'advanced'].includes(level)) {
      alert("Please enter 'beginner', 'intermediate', or 'advanced'");
      return;
    }
  }

  const nextStep = step + 1;
  const newMessages = [...messages, { sender: userName, text: input }];

  // If this is the first step (name input), update the user's name
  if (step === 0) {
    const newUserName = input.trim();
    setUserName(newUserName);
    // Update the last message to use the new name
    newMessages[newMessages.length - 1] = { sender: newUserName, text: input };
  }

  if (nextStep < questions.length) {
    newMessages.push({ sender: "HealthBru", text: questions[nextStep] });
    setMessages(newMessages);
  } else {
    setMessages(newMessages);
    handleComplete(newMessages); 
  }

  setInput("");
  setStep(nextStep);
}

  const getPlaceholderText = () => {
    switch (step) {
      case 0: return "Enter your name...";
      case 1: return "Enter your age (e.g., 25)...";
      case 2: return "Enter your weight in pounds (e.g., 150)...";
      case 3: return "Enter your height (e.g., 5'7)...";
      case 4: return "Enter 'male', 'female', or 'other'...";
      case 5: return "Enter 'beginner', 'intermediate', or 'advanced'...";
      case 6: return "Describe your fitness goal (e.g., build muscle, lose weight)...";
      default: return "Type your answer here...";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-6 h-screen flex flex-col">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Build Your Profile
          </h1>
          <p className="text-purple-200 text-lg">Let's create your personalized fitness journey</p>
        </div>

        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-purple-200 font-medium">Step {Math.min(step + 1, questions.length)} of {questions.length}</span>
            <span className="text-purple-200 font-medium">{Math.min(Math.round(((step + 1) / questions.length) * 100), 100)}%</span>
          </div>
          <div className="w-full bg-purple-800 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-400 to-pink-400 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(((step + 1) / questions.length) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Messages container with scroll */}
        <div className="flex-1 space-y-4 mb-6 overflow-y-auto bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 items-start ${msg.sender !== "HealthBru" ? "justify-end" : "justify-start"}`}>
              {msg.sender === "HealthBru" && (
                <Avatar className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-purple-400 shadow-lg">
                  <AvatarImage 
                    src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=150&h=150&fit=crop&crop=face" 
                    alt="HealthBru"
                  />
                  <AvatarFallback className="text-white font-bold text-lg">HB</AvatarFallback>
                </Avatar>
              )}
              <Card className={`max-w-xs lg:max-w-md ${msg.sender !== "HealthBru" ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : "bg-white/10 backdrop-blur-sm text-purple-100 border-purple-500/30"}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-sm opacity-80">{msg.sender}</span>
                    {msg.sender === "HealthBru" && (
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </CardContent>
              </Card>
              {msg.sender !== "HealthBru" && (
                <Avatar className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 border-2 border-blue-400 shadow-lg">
                  <AvatarImage 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" 
                    alt="User"
                  />
                  <AvatarFallback className="text-white font-bold text-lg">
                    {userName !== "User" ? userName.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {/* Auto-scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input section */}
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
          <div className="flex items-center gap-4">
            <Input
              className="flex-1 bg-white/10 border-purple-500/30 text-white placeholder-purple-300 focus:border-purple-400 focus:ring-purple-400 rounded-xl"
              placeholder={getPlaceholderText()}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleNext();
                }
              }}
            />
            <Button 
              onClick={handleNext}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-2 rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
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

export default ProfileBuilder;
