'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
//import { motion, AnimatePresence } from "framer-motion"
//import { saveAs } from 'file-saver'
import { Input } from "@/components/ui/input"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  hasInput?: boolean
}

interface ObjectiveParameter {
  id: number
  parameter: string
  options: string[]
  hasInput: true
}

// Add new interface for domain questions
interface DomainQuestion {
  id: number
  question: string
}

const questions: Question[] = [
  {
    id: 1,
    question: "When trying to remember information, I am most likely to recall:",
    options: [
      "The picture or diagram I saw",
      "The experience or activity I was part of",
      "The explanation I heard"
    ],
    correctAnswer: 0,
    hasInput: true
  },
  {
    id: 2,
    question: "If I were learning how to assemble something, I would prefer:",
    options: [
      "Seeing an illustrated guide or watching a demonstration",
      "Doing it myself step-by-step with guidance",
      "Hearing step-by-step verbal instructions"
    ],
    correctAnswer: 0,
    hasInput: true
  },
  {
    id: 3,
    question: "To understand complex ideas best, I prefer:",
    options: [
      "Seeing charts, graphs, and visual examples",
      "Engaging in simulations or physical activities",
      "Listening to in-depth explanations or discussions"
    ],
    correctAnswer: 0,
    hasInput: true
  },
  {
    id: 4,
    question: "When recalling a conversation, I am most likely to remember:",
    options: [
      "The expressions and body language I saw",
      "How it felt to be part of that conversation",
      "The specific words and tone that were used"
    ],
    correctAnswer: 0,
    hasInput: true
  },
  {
    id: 5,
    question: "When I want to explain something complex to others, I usually:",
    options: [
      "Draw or show visual examples",
      "Demonstrate or have them practice it hands-on",
      "Talk them through it in detail, describing each part"
    ],
    correctAnswer: 0,
    hasInput: true
  }
]

const objectiveParameters: ObjectiveParameter[] = [
  {
    id: 1,
    parameter: "What is your primary focus in this learning experience?",
    options: [
      "Build foundational skills (e.g., Programming, Basics of a Subject)",
      "Prepare specifically for an upcoming exam or interview",
      "Advance my knowledge and expertise for career growth"
    ],
    hasInput: true
  },
  {
    id: 2,
    parameter: "Which learning format do you find most effective?",
    options: [
      "Structured courses with detailed lessons and explanations",
      "Practice-focused sessions like mock interviews or exam simulations",
      "Hands-on projects or real-world case studies"
    ],
    hasInput: true
  },
  {
    id: 3,
    parameter: "How would you rate your current knowledge level in this area?",
    options: [
      "Beginner - Just starting and learning basics",
      "Intermediate - Have some experience and looking to improve",
      "Advanced - Strong understanding, seeking depth and refinement"
    ],
    hasInput: true
  },
  {
    id: 4,
    parameter: "What is your main motivation for pursuing this learning?",
    options: [
      "To gain skills and confidence for a job or career shift",
      "To perform well in an upcoming exam or interview",
      "To gain personal expertise and deepen my interest in the field"
    ],
    hasInput: true
  }
]

// Add domain-specific questions
const domainQuestions: DomainQuestion[] = [
  {
    id: 1,
    question: "What specific technologies or tools do you want to focus on learning?"
  },
  {
    id: 2,
    question: "What are your current challenges in this domain?"
  },
  {
    id: 3,
    question: "What are your learning goals for the next 3 months?"
  },
  {
    id: 4,
    question: "What previous experience do you have in this domain?"
  }
]

// export default function PP1() {
//   // Separate state arrays for each section with clear naming
//   const [personalAnswers, setPersonalAnswers] = useState<(number | null)[]>(
//     new Array(questions.length).fill(null)
//   )
//   const [objectiveAnswers, setObjectiveAnswers] = useState<(string | null)[]>(
//     new Array(objectiveParameters.length).fill(null)
//   )
//   const [customInputs, setCustomInputs] = useState<string[]>(
//     new Array(objectiveParameters.length).fill('')
//   )
//   const [domainAnswers, setDomainAnswers] = useState<string[]>(
//     new Array(domainQuestions.length).fill('')
//   )

//   // Section visibility states

//   const [showObjective, setShowObjective] = useState(false)
//   const [showDomain, setShowDomain] = useState(false)
//   const [showResult, setShowResult] = useState(false)
//   const [optionplaceholder, setOptionplaceholder] = useState('')

//   // Handle PP answers
//   const handlePersonalAnswerSelect = (questionIndex: number, value: string) => {
//     const newAnswers = [...personalAnswers]
//     newAnswers[questionIndex] = parseInt(value)
//     setPersonalAnswers(newAnswers)

//   }
//   // Handle OP answers
//   const handleObjectiveSelect = (paramIndex: number, value: string) => {
//     const newAnswers = [...objectiveAnswers]
//     newAnswers[paramIndex] = value
//     setObjectiveAnswers(newAnswers)// 

//   }

//   // Handle custom inputs
//   const handleCustomInput = (paramIndex: number, value: string) => {
//     const newInputs = [...customInputs]
//     newInputs[paramIndex] = value
//     setCustomInputs(newInputs)
//     handleObjectiveSelect(paramIndex, '3')
//   }

//   // Handle domain answers
//   const handleDomainAnswer = (index: number, value: string) => {
//     const newAnswers = [...domainAnswers]
//     newAnswers[index] = value
//     setDomainAnswers(newAnswers)
//   }

//   // Handle final submission
//   const handleSubmit = async () => {
//     const results = {
//       prompt: "You are a helpful assistant. Based on this parameters file, where Profile Parameters describe the personality of the learner, Domain parameters is the subject they want to learn, and objective parameters are the outcomes they expect, generate only a prompt, that can be used in other LLMs, fullfilling all criteria, on the subject mentioned in domain.",
//       PersonalParameters: questions.map((question, index) => ({
//         question: question.question,
//         userAnswer: question.options[personalAnswers[index] || 0]
//       })),
//       ObjectiveParameters: objectiveParameters.map((param, index) => ({
//         question: param.parameter,
//         userAnswer: objectiveAnswers[index] === '3' ? 
//           customInputs[index] : 
//           param.options[parseInt(objectiveAnswers[index] || '0')]
//       })),
//       DomainParameters: domainQuestions.map((question, index) => ({
//         question: question.question,
//         answer: domainAnswers[index]
//       }))
//     }

//     try {
//       const response = await fetch('http://localhost:5500/datacollector', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(results)
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log('Server response:', data);
//       setShowResult(true);
//     } catch (error) {
//       console.error('Error sending data:', error);
//       alert('Failed to submit quiz results. Please try again.');
//     }
//   }

//   // Add a function to reset objective answers when moving to that section
//   const handleMoveToObjective = () => {
//     setObjectiveAnswers(new Array(objectiveParameters.length).fill(null))
//     setCustomInputs(new Array(objectiveParameters.length).fill(''))
//     setShowObjective(true)

//   }

//   // Add a function to reset domain answers when moving to that section
//   const handleMoveToDomain = () => {
//     setDomainAnswers(new Array(domainQuestions.length).fill(''))
//     setShowDomain(true)
//   }

//   // Personal Parameters Section
//   if (!showObjective && !showDomain) {
//     return (
//       <div className="min-h-screen p-4 bg-gradient-to-br from-primary via-accent-purple to-accent-pink">
//         <div className="max-w-2xl mx-auto space-y-6">
//           <Card className="w-full shadow-lg border border-white/20 bg-white/80 backdrop-blur-md">
//             <CardHeader className="bg-gradient-to-r from-primary/10 to-accent-purple/10">
//               <CardTitle className="text-2xl text-center text-primary">Personal Parameters</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6 p-8">
//               {questions.map((question, index) => (
//                 <div key={question.id} className="space-y-4 p-6 bg-white/50 rounded-lg border border-white/20 backdrop-blur-sm">
//                   <div className="flex items-center gap-2">
//                     <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
//                       {index + 1}
//                     </span>
//                     <h3 className="text-lg font-medium text-gray-700">{question.question}</h3>
//                   </div>
//                   <RadioGroup
//                     value={personalAnswers[index]?.toString()}
//                     onValueChange={(value) => handlePersonalAnswerSelect(index, value)}
//                     className="space-y-3 ml-10"
//                   >
//                     {question.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="flex items-center space-x-2">
//                         <RadioGroupItem
//                           value={optionIndex.toString()}
//                           id={`pp-question-${index}-option-${optionIndex}`}
//                           className="border-2"
//                         />
//                         <Label
//                           htmlFor={`pp-question-${index}-option-${optionIndex}`}
//                           className="text-base cursor-pointer"
//                         >
//                           {option}
//                         </Label>
//                       </div>
//                     ))}
//                   </RadioGroup>
//                 </div>
//               ))}
//               <div className="flex justify-end pt-6">
//                 <Button
//                   onClick={handleMoveToObjective}
//                   disabled={personalAnswers.includes(null)}
//                   className="bg-gradient-to-r from-primary to-accent-purple hover:from-primary/90 hover:to-accent-purple/90 text-white"
//                 >
//                   Next
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     )
//   }

//   // Objective Parameters Section
//   if (showObjective && !showDomain) {
//     return (
//       <div className="min-h-screen p-4 bg-gradient-to-br from-primary via-accent-purple to-accent-pink">
//         <div className="max-w-2xl mx-auto space-y-6">
//           <Card className="w-full shadow-lg border border-white/20 bg-white/80 backdrop-blur-md">
//             <CardHeader className="bg-gradient-to-r from-primary/10 to-accent-purple/10">
//               <CardTitle className="text-2xl text-center text-primary">Objective Parameters</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6 p-8">
//               {objectiveParameters.map((param, index) => (
//                 <div key={param.id} className="space-y-4 p-6 bg-white/50 rounded-lg border border-white/20 backdrop-blur-sm">
//                   <div className="flex items-center gap-2">
//                     <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
//                       {index + 1}
//                     </span>
//                     <h3 className="text-lg font-medium text-gray-700">{param.parameter}</h3>
//                   </div>
//                   <RadioGroup
//                     value={objectiveAnswers[index]?.toString()}
//                     onValueChange={(value) => handleObjectiveSelect(index, value)}
//                     className="space-y-3 ml-10"
//                   >
//                     {param.options.map((option, optionIndex) => (
//                       <div key={optionIndex} className="flex items-center space-x-2">
//                         <RadioGroupItem
//                           value={optionIndex.toString()}
//                           id={`op-param-${index}-option-${optionIndex}`}
//                           className="border-2"
//                         />
//                         <Label
//                           htmlFor={`op-param-${index}-option-${optionIndex}`}
//                           className="text-base cursor-pointer"
//                         >
//                           {option}
//                         </Label>
//                       </div>
//                     ))}
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem
//                         value="3"
//                         id={`op-param-${index}-custom`}
//                         className="border-2"
//                       />
//                       <Input
//                         placeholder="Other (please specify)"
//                         value={customInputs[index]}
//                         onChange={(e) => handleCustomInput(index, e.target.value)}
//                         className="flex-1"
//                       />
//                     </div>
//                   </RadioGroup>
//                 </div>
//               ))}
//               <div className="flex justify-between pt-6">
//                 <Button
//                   onClick={() => setShowObjective(false)}
//                   variant="outline"
//                 >
//                   Previous
//                 </Button>
//                 <Button
//                   onClick={handleMoveToDomain}
//                   disabled={objectiveAnswers.includes(null)}
//                   className="bg-gradient-to-r from-primary to-accent-purple hover:from-primary/90 hover:to-accent-purple/90 text-white"
//                 >
//                   Next
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     )
//   }

//   // Domain Parameters Section
//   if (showDomain) {
//     return (
//       <div className="min-h-screen p-4 bg-gradient-to-br from-primary via-accent-purple to-accent-pink">
//         <div className="max-w-2xl mx-auto space-y-6">
//           <Card className="w-full shadow-lg border border-white/20 bg-white/80 backdrop-blur-md">
//             <CardHeader className="bg-gradient-to-r from-primary/10 to-accent-purple/10">
//               <CardTitle className="text-2xl text-center text-primary">Domain Parameters</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6 p-8">
//               {domainQuestions.map((question, index) => (
//                 <div key={question.id} className="space-y-4 p-6 bg-white/50 rounded-lg border border-white/20 backdrop-blur-sm">
//                   <div className="flex items-center gap-2">
//                     <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
//                       {index + 1}
//                     </span>
//                     <h3 className="text-lg font-medium text-gray-700">{question.question}</h3>
//                   </div>
//                   <div className="ml-10">
//                     <Input
//                       value={domainAnswers[index]}
//                       onChange={(e) => handleDomainAnswer(index, e.target.value)}
//                       placeholder="Enter your answer"
//                       className="w-full"
//                     />
//                   </div>
//                 </div>
//               ))}
//               <div className="flex justify-between pt-6">
//                 <Button
//                   onClick={() => setShowDomain(false)}
//                   variant="outline"
//                 >
//                   Previous
//                 </Button>
//                 <Button
//                   onClick={handleSubmit}
//                   disabled={domainAnswers.includes('')}
//                   className="bg-gradient-to-r from-primary to-accent-purple hover:from-primary/90 hover:to-accent-purple/90 text-white"
//                 >
//                   Submit
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     )
//   }

//   // Results Section
//   return (
//     <div className="min-h-screen p-4 bg-gradient-to-br from-primary via-accent-purple to-accent-pink">
//       <div className="max-w-2xl mx-auto">
//         <Card className="w-full shadow-lg border border-white/20 bg-white/80 backdrop-blur-md">
//           <CardHeader className="bg-gradient-to-r from-primary/10 to-accent-purple/10">
//             <CardTitle className="text-2xl text-center text-primary">Submission Successful</CardTitle>
//           </CardHeader>
//           <CardContent className="p-8 text-center">
//             <p className="text-lg text-gray-700 mb-6">Your responses have been submitted successfully.</p>
//             <Button
//               onClick={() => window.location.reload()}
//               className="bg-gradient-to-r from-primary to-accent-purple hover:from-primary/90 hover:to-accent-purple/90 text-white"
//             >
//               Start Over
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }
export default function PP1() {
  // Separate state arrays for each section with clear naming
  const [personalAnswers, setPersonalAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  )
  const [objectiveAnswers, setObjectiveAnswers] = useState<(string | null)[]>(
    new Array(objectiveParameters.length).fill(null)
  )
  const [customInputs, setCustomInputs] = useState<string[]>(
    new Array(objectiveParameters.length).fill('')
  )
  const [domainAnswers, setDomainAnswers] = useState<string[]>(
    new Array(domainQuestions.length).fill('')
  )

  // Section visibility states
  const [showObjective, setShowObjective] = useState(false)
  const [showDomain, setShowDomain] = useState(false)
 // const [showResult, setShowResult] = useState(false)

  // Handle PP answers
  const handlePersonalAnswerSelect = (questionIndex: number, value: string) => {
    const newAnswers = [...personalAnswers]
    newAnswers[questionIndex] = parseInt(value)
    setPersonalAnswers(newAnswers)
  }

  // Handle OP answers
  const handleObjectiveSelect = (paramIndex: number, value: string) => {
    const newAnswers = [...objectiveAnswers]
    newAnswers[paramIndex] = value
    setObjectiveAnswers(newAnswers)
  }

  // Handle custom inputs
  const handleCustomInput = (paramIndex: number, value: string) => {
    const newInputs = [...customInputs]
    newInputs[paramIndex] = value
    setCustomInputs(newInputs)
    handleObjectiveSelect(paramIndex, '3')
  }

  // Handle domain answers
  const handleDomainAnswer = (index: number, value: string) => {
    const newAnswers = [...domainAnswers]
    newAnswers[index] = value
    setDomainAnswers(newAnswers)
  }

  // Handle final submission
  const handleSubmit = async () => {
    const results = {
      prompt: "You are a helpful assistant. Based on this parameters file, where Profile Parameters describe the personality of the learner, Domain parameters is the subject they want to learn, and objective parameters are the outcomes they expect, generate only a prompt, that can be used in other LLMs, fulfilling all criteria, on the subject mentioned in domain.",
      parameters: {
        Profile_Parameters: questions.map((_, index) => ({
          id: `PP${index + 1}`,
          value: questions[index].options[personalAnswers[index] || 0]
        })),
        Objective_Parameters: objectiveParameters.map((_, index) => ({
          id: `OP${index + 1}`,
          value: objectiveAnswers[index] === '3' ?
            customInputs[index] :
            objectiveParameters[index].options[parseInt(objectiveAnswers[index] || '0')]
        })),
        Domain_Parameters: domainQuestions.map((_, index) => ({
          id: `DP${index + 1}`,
          value: domainAnswers[index]
        })) 
      }
    }

    try {
      // Store the request data first
      sessionStorage.setItem('quizRequest', JSON.stringify(results))
      
      // Navigate to results page immediately
      window.location.href = '/quiz-results'
      
    } catch (error) {
      console.error('Error preparing data:', error)
      alert('Failed to prepare quiz data. Please try again.')
    }
  }

  // Navigation functions without resetting
  const handleMoveToObjective = () => {
    setShowObjective(true)
    setShowDomain(false)
  }

  const handleMoveToDomain = () => {
    setShowDomain(true)
    setShowObjective(false)
  }

  // Personal Parameters Section
  if (!showObjective && !showDomain) {
    return (
      <div className="min-h-screen p-4 bg-gradient-to-br from-primary via-accent-purple to-accent-pink">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="w-full shadow-lg border border-white/20 bg-white/80 backdrop-blur-md">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent-purple/10">
              <CardTitle className="text-2xl text-center text-primary">Personal Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              {questions.map((question, index) => (
                <div key={question.id} className="space-y-4 p-6 bg-white/50 rounded-lg border border-white/20 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-medium text-gray-700">{question.question}</h3>
                  </div>
                  <RadioGroup
                    value={personalAnswers[index] !== null ? personalAnswers[index]?.toString() : ""}
                    onValueChange={(value) => handlePersonalAnswerSelect(index, value)}
                    className="space-y-3 ml-10"
                  >
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={optionIndex.toString()}
                          id={`pp-question-${index}-option-${optionIndex}`}
                          className="border-2"
                        />
                        <Label
                          htmlFor={`pp-question-${index}-option-${optionIndex}`}
                          className="text-base cursor-pointer"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
              <div className="flex justify-end pt-6">
                <Button
                  onClick={handleMoveToObjective}
                  disabled={personalAnswers.includes(null)}
                  className="bg-gradient-to-r from-primary to-accent-purple hover:from-primary/90 hover:to-accent-purple/90 text-white"
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Objective Parameters Section
  if (showObjective && !showDomain) {
    return (
      <div className="min-h-screen p-4 bg-gradient-to-br from-primary via-accent-purple to-accent-pink">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="w-full shadow-lg border border-white/20 bg-white/80 backdrop-blur-md">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent-purple/10">
              <CardTitle className="text-2xl text-center text-primary">Objective Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              {objectiveParameters.map((param, index) => (
                <div key={param.id} className="space-y-4 p-6 bg-white/50 rounded-lg border border-white/20 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-medium text-gray-700">{param.parameter}</h3>
                  </div>
                  <RadioGroup
                    value={objectiveAnswers[index] || ""}
                    onValueChange={(value) => handleObjectiveSelect(index, value)}
                    className="space-y-3 ml-10"
                  >
                    {param.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={optionIndex.toString()}
                          id={`op-param-${index}-option-${optionIndex}`}
                          className="border-2"
                        />
                        <Label
                          htmlFor={`op-param-${index}-option-${optionIndex}`}
                          className="text-base cursor-pointer"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="3"
                        id={`op-param-${index}-custom`}
                        className="border-2"
                      />
                      <Input
                        placeholder="Other (please specify)"
                        value={customInputs[index]}
                        onChange={(e) => handleCustomInput(index, e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </RadioGroup>
                </div>
              ))}
              <div className="flex justify-between pt-6">
                <Button
                  onClick={() => setShowObjective(false)}
                  variant="outline"
                >
                  Previous
                </Button>
                <Button
                  onClick={handleMoveToDomain}
                  disabled={objectiveAnswers.includes(null)}
                  className="bg-gradient-to-r from-primary to-accent-purple hover:from-primary/90 hover:to-accent-purple/90 text-white"
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Domain Parameters Section
  if (showDomain) {
    return (
      <div className="min-h-screen p-4 bg-gradient-to-br from-primary via-accent-purple to-accent-pink">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="w-full shadow-lg border border-white/20 bg-white/80 backdrop-blur-md">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent-purple/10">
              <CardTitle className="text-2xl text-center text-primary">Domain Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              {domainQuestions.map((question, index) => (
                <div key={question.id} className="space-y-4 p-6 bg-white/50 rounded-lg border border-white/20 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-medium text-gray-700">{question.question}</h3>
                  </div>
                  <div className="ml-10">
                    <Input
                      value={domainAnswers[index]}
                      onChange={(e) => handleDomainAnswer(index, e.target.value)}
                      placeholder="Enter your answer"
                      className="w-full"
                    />
                  </div>
                </div>
              ))}
              <div className="flex justify-between pt-6">
                <Button
                  onClick={() => setShowDomain(false)}
                  variant="outline"
                >
                  Previous
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={domainAnswers.includes('')}
                  className="bg-gradient-to-r from-primary to-accent-purple hover:from-primary/90 hover:to-accent-purple/90 text-white"
                >
                  Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Results Section
  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-primary via-accent-purple to-accent-pink">
      <div className="max-w-2xl mx-auto">
        <Card className="w-full shadow-lg border border-white/20 bg-white/80 backdrop-blur-md">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent-purple/10">
            <CardTitle className="text-2xl text-center text-primary">Submission Successful</CardTitle>
          </CardHeader>
          <CardContent className="p-8 text-center">
            <p className="text-lg text-gray-700 mb-6">Your responses have been submitted successfully.</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-primary to-accent-purple hover:from-primary/90 hover:to-accent-purple/90 text-white"
            >
              Start Over
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
