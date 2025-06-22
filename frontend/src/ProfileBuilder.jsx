import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


let userGoals = {
  name: '',
  age: 0,
  weight: 0,
  height: 0,
  fitnessGoal: '',
};

const questions = [
  "What is your name?",
  "What is your age?",
  "What is your current weight?",
  "What is your height?(inches)" ,
  "What is your primary fitness goal?",
];

function ProfileBuilder() {
  
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0); 
  const [messages, setMessages] = useState([
    { sender: "HealthBru", text: "What is your name?" },
  ]);

  async function handleComplete(msgs) {

  userGoals.name = msgs[1]?.text || '';
  userGoals.age = parseInt(msgs[3]?.text, 10) || 0;
  userGoals.weight = parseInt(msgs[5]?.text, 10) || 0;
  userGoals.height = parseInt(msgs[7]?.text, 10) || 0;
  userGoals.fitnessGoal = msgs[9]?.text || '';

  console.log("User Goals:", userGoals);

    const mainURL =  "http://127.0.0.1:8000" ;

    try { // catch error 
      const response = await axios.post(mainURL, JSON.stringify(userGoals), { // asynchronously sends post to server, but first we need to turn javascript object into a JSON type
        responseType: 'blob', // expect binary data in response
        headers: {
          "Content-Type": 'application/json', // what type of data to expect
        },
      });

      if (response.status === 200) { // success
        console.log("Data uploaded successfully");
        navigate("/home"); // navigate to home page after successful upload
      }
    } catch (error) {
      console.error("Error uploading data:", error);
    }
}

function handleNext() {
  if (input.trim() === "") return;

  const nextStep = step + 1;
  const newMessages = [...messages, { sender: "User", text: input }];

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

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Build Your Profile</h1>

      <div className="space-y-4 mb-6">
        {messages.map((msg, idx) => (
          <div key={idx} className="flex gap-3 items-start">
            <Avatar>
              <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
            </Avatar>
            <Card className="bg-muted">
              <CardContent className="p-4 text-sm">
                <p className="font-semibold mb-1">{msg.sender}</p>
                <p>{msg.text}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <div className="border rounded-full flex items-center px-4 py-2 shadow-sm">
        <Input
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Type here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}

          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // Prevent form submission
              handleNext();
            }
          }   
        }
        />
        <Button onClick={handleNext}>Next</Button>
      </div>

      <span className="text-sm text-muted-foreground ml-4">
        Step {step} of 5
      </span>

      <div className="mt-2 h-1 w-full bg-gray-200 rounded-full">
        <div
          className="h-1 bg-purple-500 rounded-full"
          style={{ width: `${(step / 5) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default ProfileBuilder;
