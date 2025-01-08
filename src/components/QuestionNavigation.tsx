// import { useState } from 'react';
// import { Card, Flex, Text, TextInput, Button } from '@gravity-ui/uikit';

// interface QuestionNavigationProps {
//   currentQuestion: number;
//   totalQuestions: number;
//   onNavigate: (questionNumber: number) => void;
// }

// const QuestionNavigation = ({ currentQuestion, totalQuestions, onNavigate }: QuestionNavigationProps) => {
//   const [inputValue, setInputValue] = useState(String(currentQuestion + 1));

//   const handleNavigate = () => {
//     const questionNumber = Math.min(Math.max(1, parseInt(inputValue) || 1), totalQuestions);
//     onNavigate(questionNumber - 1);
//     setInputValue(String(questionNumber));
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value.replace(/[^0-9]/g, '');
//     setInputValue(value);
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       handleNavigate();
//     }
//   };

//   return (
//     <Card className="w-full">
//       <Flex direction="column" gap={2} className="p-4">
//         <Text variant="subheader-1" className="mb-2">
//           Question Navigation
//         </Text>
//         <Flex gap={2} alignItems="center">
//           <TextInput
//             value={inputValue}
//             onChange={handleInputChange}
//             onKeyPress={handleKeyPress}
//             placeholder="Enter question number"
//             size="m"
//             className="w-24"
//           />
//           <Text variant="body-2" color="secondary">
//             of {totalQuestions}
//           </Text>
//           <Button view="normal" size="m" onClick={handleNavigate}>
//             Go to Question
//           </Button>
//         </Flex>
//       </Flex>
//     </Card>
//   );
// };

// export default QuestionNavigation;
// First, let's create a type for tracking question attempts
type QuestionAttempt = {
    questionId: number;
    lastAttemptCorrect: boolean;
    attempted: boolean;
  };
  
  // QuestionNavigation.tsx
  import { useState, useRef, useEffect } from 'react';
  import { Card, Flex, Text, Button } from '@gravity-ui/uikit';
  import { Check, X, HelpCircle } from 'lucide-react';
  
  interface QuestionNavigationProps {
    currentQuestion: number;
    totalQuestions: number;
    onNavigate: (questionNumber: number) => void;
    questionAttempts: QuestionAttempt[];
  }
  
  const QuestionNavigation = ({
    currentQuestion,
    totalQuestions,
    onNavigate,
    questionAttempts
  }: QuestionNavigationProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
  
    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
  
    const getStatusIcon = (questionIndex: number) => {
      const attempt = questionAttempts[questionIndex];
      if (!attempt || !attempt.attempted) {
        return <HelpCircle size={16} className="text-gray-400" />;
      }
      return attempt.lastAttemptCorrect ? 
        <Check size={16} className="text-green-500" /> : 
        <X size={16} className="text-red-500" />;
    };
  
    const generateQuestionList = () => {
      const items = [];
      for (let i = 0; i < totalQuestions; i++) {
        items.push(
          <button
            key={i}
            onClick={() => {
              onNavigate(i);
              setIsOpen(false);
            }}
            className={`w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center justify-between ${
              currentQuestion === i ? 'bg-gray-50' : ''
            }`}
          >
            <span>Question {i + 1}</span>
            {getStatusIcon(i)}
          </button>
        );
      }
      return items;
    };
  
    return (
      <Card className="w-full">
        <div className="relative" ref={dropdownRef}>
          <Flex direction="column" gap={2} className="p-4">
            <Text variant="subheader-1" className="mb-2">
              Question Navigation
            </Text>
            <Button
              view="normal"
              size="m"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full"
            >
              Question {currentQuestion + 1} of {totalQuestions}
            </Button>
            
            {isOpen && (
              <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1 max-h-80 overflow-y-auto">
                {generateQuestionList()}
              </div>
            )}
          </Flex>
        </div>
      </Card>
    );
  };
  
  export default QuestionNavigation;