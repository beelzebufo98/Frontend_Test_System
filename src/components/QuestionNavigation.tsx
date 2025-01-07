import { useState } from 'react';
import { Card, Flex, Text, TextInput, Button } from '@gravity-ui/uikit';

interface QuestionNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  onNavigate: (questionNumber: number) => void;
}

const QuestionNavigation = ({ currentQuestion, totalQuestions, onNavigate }: QuestionNavigationProps) => {
  const [inputValue, setInputValue] = useState(String(currentQuestion + 1));

  const handleNavigate = () => {
    const questionNumber = Math.min(Math.max(1, parseInt(inputValue) || 1), totalQuestions);
    onNavigate(questionNumber - 1);
    setInputValue(String(questionNumber));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNavigate();
    }
  };

  return (
    <Card className="w-full">
      <Flex direction="column" gap={2} className="p-4">
        <Text variant="subheader-1" className="mb-2">
          Question Navigation
        </Text>
        <Flex gap={2} alignItems="center">
          <TextInput
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter question number"
            size="m"
            className="w-24"
          />
          <Text variant="body-2" color="secondary">
            of {totalQuestions}
          </Text>
          <Button view="normal" size="m" onClick={handleNavigate}>
            Go to Question
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};

export default QuestionNavigation;