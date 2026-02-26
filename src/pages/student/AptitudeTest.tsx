import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, ArrowRight, BrainCircuit } from 'lucide-react';
import { logger } from '@/lib/logger';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number; // index of the correct option
  category: 'Quantitative' | 'General Knowledge';
}

const questions: Question[] = [
  // Quantitative
  {
    id: 1,
    text: "If a shirt costs $20 after a 20% discount, what was the original price?",
    options: ["$24", "$25", "$30", "$40"],
    correctAnswer: 1,
    category: 'Quantitative'
  },
  {
    id: 2,
    text: "What is the next number in the series: 2, 6, 12, 20, ...?",
    options: ["28", "30", "32", "42"],
    correctAnswer: 1,
    category: 'Quantitative'
  },
  {
    id: 3,
    text: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
    options: ["120 metres", "150 metres", "180 metres", "324 metres"],
    correctAnswer: 1,
    category: 'Quantitative'
  },
  {
    id: 4,
    text: "The average of first 50 natural numbers is?",
    options: ["25.30", "25.5", "25.00", "12.25"],
    correctAnswer: 1,
    category: 'Quantitative'
  },
  {
    id: 5,
    text: "If A is the brother of B; B is the sister of C; and C is the father of D, how D is related to A?",
    options: ["Brother", "Sister", "Nephew", "Cannot be determined"],
    correctAnswer: 3, // D's gender is not known
    category: 'Quantitative'
  },

  // General Knowledge
  {
    id: 6,
    text: "Which is the largest organ in the human body?",
    options: ["Heart", "Skin", "Liver", "Kidney"],
    correctAnswer: 1,
    category: 'General Knowledge'
  },
  {
    id: 7,
    text: "Who is known as the 'Father of the Nation' in India?",
    options: ["Jawaharlal Nehru", "Subhash Chandra Bose", "Mahatma Gandhi", "Sardar Vallabhbhai Patel"],
    correctAnswer: 2,
    category: 'General Knowledge'
  },
  {
    id: 8,
    text: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    category: 'General Knowledge'
  },
  {
    id: 9,
    text: "What is the capital of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Perth"],
    correctAnswer: 2,
    category: 'General Knowledge'
  },
  {
    id: 10,
    text: "Who wrote 'Discovery of India'?",
    options: ["Mahatma Gandhi", "Jawaharlal Nehru", "Indira Gandhi", "Rabindranath Tagore"],
    correctAnswer: 1,
    category: 'General Knowledge'
  }
];

const AptitudeTest = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / questions.length) * 100;

  const handleOptionSelect = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: parseInt(value)
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    let newScore = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        newScore++;
      }
    });
    setScore(newScore);
    setShowResult(true);
    logger.info(`Aptitude test completed. Score: ${newScore}/${questions.length}`);
  };

  const getRecommendation = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return "Excellent! You have a strong aptitude. You might excel in Engineering, Data Science, or Research fields.";
    if (percentage >= 60) return "Good job! You have a balanced aptitude. Consider Management, Commerce, or Applied Sciences.";
    return "Keep practicing! You might find your strength in Creative Arts, Humanities, or Vocational courses.";
  };

  if (showResult) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Card className="text-center p-8">
          <CardHeader>
            <div className="mx-auto bg-indigo-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
              <BrainCircuit className="h-10 w-10 text-indigo-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">Test Completed!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-5xl font-extrabold text-indigo-600">
              {score} / {questions.length}
            </div>
            <p className="text-xl text-gray-600">
              Your Score
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Recommendation</h3>
              <p className="text-gray-700">{getRecommendation()}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4 mt-6">
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              Back to Dashboard
            </Button>
            <Button onClick={() => navigate('/career-selection')} className="bg-indigo-600 hover:bg-indigo-700">
              Explore Career Paths <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-indigo-600">
            {currentQuestion.category}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            {currentQuestion.text}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            key={currentQuestion.id}
            value={answers[currentQuestion.id]?.toString() ?? ""} 
            onValueChange={handleOptionSelect}
            className="space-y-4"
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <RadioGroupItem value={index.toString()} id={`q${currentQuestion.id}-option-${index}`} />
                <Label htmlFor={`q${currentQuestion.id}-option-${index}`} className="flex-grow cursor-pointer font-normal text-base">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between mt-4">
          <Button 
            variant="outline" 
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          <Button 
            onClick={handleNext}
            disabled={answers[currentQuestion.id] === undefined}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish Test' : 'Next Question'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AptitudeTest;
