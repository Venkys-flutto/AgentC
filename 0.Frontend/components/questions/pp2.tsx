// 'use client'

// import { useState, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Progress } from "@/components/ui/progress"
// import { Target, GraduationCap, BookOpen, Eye, HandMetal, Headphones, PlayCircle, FileText, Dumbbell, Lightbulb, BarChart2, Book, Briefcase, Code, PenTool, CheckCircle2 } from 'lucide-react'
// import confetti from 'canvas-confetti'

// const generateSubQueries = (objective: string, technology: string) => {
//   const baseQueries = [
//     `What are the core skills or concepts in ${technology}?`,
//     `How can ${technology} be applied to achieve ${objective}?`,
//     `What resources would you recommend for mastering ${technology}?`,
//     `What are best practices when working with ${technology}?`,
//     `How can I integrate ${technology} into my current projects or work?`,
//     `What are advanced use cases of ${technology} in ${objective}?`,
//     "What are the fundamental concepts of [topic]?",
//     "How can I apply [topic] in real-world scenarios?",
//     "What are the best practices for [topic]?",
//     "What are common challenges in learning [topic]?",
//     "How does [topic] relate to other areas in the field?",
//   ]
//   return baseQueries.map(query => query.replace('[topic]', objective || 'your chosen topic'))
// }

// export default function Component() {
//   const [step, setStep] = useState(1)
//   const [objective, setObjective] = useState('')
//   const [customObjective, setCustomObjective] = useState('')
//   const [subQueries, setSubQueries] = useState<string[]>([])
//   const [selectedSubQueries, setSelectedSubQueries] = useState<string[]>([])
//   const [learningStyle, setLearningStyle] = useState('')
//   const [resourcePreference, setResourcePreference] = useState('')
//   const [responseDepth, setResponseDepth] = useState('')
//   const [technologies, setTechnologies] = useState('')
//   const [isCompleted, setIsCompleted] = useState(false)
//   const [progressColors, setProgressColors] = useState({
//     background: 'bg-gray-200',
//     foreground: 'bg-blue-600'
//   })

//   useEffect(() => {
//     const currentObjective = objective === 'custom' ? customObjective : objective
//     setSubQueries(generateSubQueries(currentObjective, technologies))
//   }, [objective, customObjective, technologies])

//   const handleNext = () => {
//     if (step < 6) {
//       setStep(step + 1)
//     } else {
//       setIsCompleted(true)
//       confetti({
//         particleCount: 100,
//         spread: 70,
//         origin: { y: 0.6 }
//       })
//     }
//   }

//   const handlePrevious = () => {
//     if (step > 1) setStep(step - 1)
//   }

//   const updateProgressColors = (background: string, foreground: string) => {
//     setProgressColors({ background, foreground })
//   }
  

//   const renderStep = () => {
//     const fadeInOut = {
//       initial: { opacity: 0, y: 20 },
//       animate: { opacity: 1, y: 0 },
//       exit: { opacity: 0, y: -20 }
//     }

//     switch (step) {
//       case 1:
//         return (
//           <motion.div key="step1" {...fadeInOut}>
//             <Card className="w-full max-w-md">
//               <CardContent className="p-6">
//                 <h2 className="text-3xl font-bold mb-4 flex items-center">
//                   <Target className="mr-2" /> Your Objective
//                 </h2>
//                 <div className="space-y-4">
//                   <Label className="text-lg">What would you like to achieve?</Label>
//                   <RadioGroup value={objective} onValueChange={setObjective} className="flex flex-col space-y-2">
//                     {[
//                       { value: 'interview', label: 'Interview preparation', icon: Briefcase },
//                       { value: 'skill', label: 'Skill upgradation', icon: GraduationCap },
//                       { value: 'project', label: 'To build projects', icon: Code },
//                       { value: 'custom', label: 'Custom objective', icon: PenTool },
//                     ].map(({ value, label, icon: Icon }) => (
//                       <motion.div key={value} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                         <div className="flex items-center space-x-2">
//                           <RadioGroupItem value={value} id={value} />
//                           <Label htmlFor={value} className="flex items-center cursor-pointer text-lg">
//                             <Icon className="mr-2 h-4 w-4" /> {label}
//                           </Label>
//                         </div>
//                       </motion.div>
//                     ))}
//                   </RadioGroup>
//                   {objective === 'custom' && (
//                     <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4">
//                       <Label htmlFor="customObjective" className="text-lg">Enter your custom objective:</Label>
//                       <Input
//                         id="customObjective"
//                         placeholder="e.g., College Exam Preparation"
//                         value={customObjective}
//                         onChange={(e) => setCustomObjective(e.target.value)}
//                         className="w-full mt-2 text-lg"
//                       />
//                     </motion.div>
//                   )}
//                   <p className="text-sm text-muted-foreground">
//                     Select or specify your goal to help us tailor the experience for you.
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         )
//       case 2:
//         return (
//           <motion.div key="step2" {...fadeInOut}>
//             <Card className="w-full max-w-md">
//               <CardContent className="p-6">
//                 <h2 className="text-3xl font-bold mb-4 flex items-center">
//                   <Target className="mr-2" /> Technology Focus
//                 </h2>
//                 <div className="space-y-4">
//                   <Label htmlFor="technologies" className="text-lg">What technologies or tools do you want to focus on?</Label>
//                   <Input
//                     id="technologies"
//                     placeholder="e.g., Python, JavaScript, AWS, Machine Learning"
//                     value={technologies}
//                     onChange={(e) => setTechnologies(e.target.value)}
//                     className="w-full text-lg"
//                   />
//                   <p className="text-sm text-muted-foreground">
//                     Enter the technologies you&apos;re interested in, separated by commas.
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         )
//       case 3:
//         return (
//           <motion.div key="step3" {...fadeInOut}>
//             <Card className="w-full max-w-md">
//               <CardContent className="p-6">
//                 <h2 className="text-3xl font-bold mb-4 flex items-center">
//                   <BookOpen className="mr-2" /> Learning Style
//                 </h2>
//                 <div className="space-y-4">
//                   <Label className="text-lg">How do you find it easiest to learn new information?</Label>
//                   <RadioGroup value={learningStyle} onValueChange={setLearningStyle} className="flex flex-col space-y-2">
//                     {[
//                       { value: 'visual', label: 'By seeing visuals or diagrams', icon: Eye },
//                       { value: 'kinesthetic', label: 'By doing hands-on activities', icon: HandMetal },
//                       { value: 'auditory', label: 'By hearing explanations or discussing', icon: Headphones },
//                     ].map(({ value, label, icon: Icon }) => (
//                       <motion.div key={value} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                         <div className="flex items-center space-x-2">
//                           <RadioGroupItem value={value} id={value} />
//                           <Label htmlFor={value} className="flex items-center cursor-pointer text-lg">
//                             <Icon className="mr-2 h-4 w-4" /> {label}
//                           </Label>
//                         </div>
//                       </motion.div>
//                     ))}
//                   </RadioGroup>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         )
//       case 4:
//         return (
//           <motion.div key="step4" {...fadeInOut}>
//             <Card className="w-full max-w-md">
//               <CardContent className="p-6">
//                 <h2 className="text-3xl font-bold mb-4 flex items-center">
//                   <BookOpen className="mr-2" /> Resource Preference
//                 </h2>
//                 <div className="space-y-4">
//                   <Label className="text-lg">What type of resource do you prefer when learning a new concept?</Label>
//                   <RadioGroup value={resourcePreference} onValueChange={setResourcePreference} className="flex flex-col space-y-2">
//                     {[
//                       { value: 'videos', label: 'Quick videos or graphics', icon: PlayCircle },
//                       { value: 'guides', label: 'Step-by-step guides', icon: FileText },
//                       { value: 'exercises', label: 'Interactive exercises or projects', icon: Dumbbell },
//                     ].map(({ value, label, icon: Icon }) => (
//                       <motion.div key={value} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                         <div className="flex items-center space-x-2">
//                           <RadioGroupItem value={value} id={value} />
//                           <Label htmlFor={value} className="flex items-center cursor-pointer text-lg">
//                             <Icon className="mr-2 h-4 w-4" /> {label}
//                           </Label>
//                         </div>
//                       </motion.div>
//                     ))}
//                   </RadioGroup>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         )
//       case 5:
//         return (
//           <motion.div key="step5" {...fadeInOut}>
//             <Card className="w-full max-w-md">
//               <CardContent className="p-6">
//                 <h2 className="text-3xl font-bold mb-4 flex items-center">
//                   <BarChart2 className="mr-2" /> Response Depth
//                 </h2>
//                 <div className="space-y-4">
//                   <Label className="text-lg">How much detail do you want in the responses?</Label>
//                   <RadioGroup value={responseDepth} onValueChange={setResponseDepth} className="flex flex-col space-y-2">
//                     {[
//                       { value: 'overview', label: 'Just the key points and highlights', icon: Lightbulb },
//                       { value: 'balanced', label: 'A balanced amount of detail with examples', icon: BarChart2 },
//                       { value: 'indepth', label: 'An in-depth explanation with comprehensive coverage', icon: Book },
//                     ].map(({ value, label, icon: Icon }) => (
//                       <motion.div key={value} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                         <div className="flex items-center space-x-2">
//                           <RadioGroupItem value={value} id={value} />
//                           <Label htmlFor={value} className="flex items-center cursor-pointer text-lg">
//                             <Icon className="mr-2 h-4 w-4" /> {label}
//                           </Label>
//                         </div>
//                       </motion.div>
//                     ))}
//                   </RadioGroup>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         )
//       case 6:
//         return (
//           <motion.div key="step6" {...fadeInOut}>
//             <Card className="w-full max-w-md">
//               <CardContent className="p-6">
//                 <h2 className="text-3xl font-bold mb-4 flex items-center">
//                   <GraduationCap className="mr-2" /> Refine Your Goals
//                 </h2>
//                 <div className="space-y-4">
//                   <p className="text-sm text-muted-foreground">
//                     Select additional areas you&apos;d like to focus on:
//                   </p>
//                   {subQueries.map((query, index) => (
//                     <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//                       <div className="flex items-center space-x-2">
//                         <Checkbox
//                           id={`subquery-${index}`}
//                           checked={selectedSubQueries.includes(query)}
//                           onCheckedChange={(checked) => {
//                             if (checked) {
//                               setSelectedSubQueries(prev => [...prev, query])
//                             } else {
//                               setSelectedSubQueries(prev => prev.filter(q => q !== query))
//                             }
//                           }}
//                         />
//                         <Label htmlFor={`subquery-${index}`} className="cursor-pointer text-lg">{query}</Label>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         )
//       default:
//         return null
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex flex-col items-center justify-center p-4">
//       <div className="w-full max-w-md space-y-8">
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="text-center"
//         >
//           <h1 className="text-4xl font-bold text-black">Adaptive Learning Assessment</h1>
//           <p className="text-muted-foreground text-black">Help us tailor the learning experience for you</p>
//         </motion.div>
//         <AnimatePresence mode="wait">
//           {isCompleted ? (
//             <motion.div
//               key="completion"
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.8 }}
//               className="text-center space-y-4"
//             >
//               <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
//               <h2 className="text-3xl font-bold">Assessment Completed!</h2>
//               <p>Thank you for completing the assessment. We&apos;ll use this information to personalize your learning experience.</p>
//             </motion.div>
//           ) : (
//             renderStep()
//           )}
//         </AnimatePresence>

//         {!isCompleted && (
//           <div className="space-y-4">
//             <Progress 
//               value={(step / 6) * 100} 
//               className={`w-full ${progressColors.background}`}
//             />
//             <div className="flex justify-between items-center">
//               <Button onClick={handlePrevious} disabled={step === 1} variant="outline" className="text-lg">
//                 Previous
//               </Button>
//               <div className="space-x-1">
//                 {[1, 2, 3, 4, 5, 6].map((i) => (
//                   <motion.span
//                     key={i}
//                     className={`inline-block w-2 h-2 rounded-full ${
//                       i === step ? 'bg-primary' : 'bg-muted'
//                     }`}
//                     animate={{ scale: i === step ? 1.2 : 1 }}
//                     transition={{ duration: 0.2 }}
//                   />
//                 ))}
//               </div>
//               <Button onClick={handleNext} className="text-lg">
//                 {step === 6 ? 'Submit' : 'Next'}
//               </Button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }