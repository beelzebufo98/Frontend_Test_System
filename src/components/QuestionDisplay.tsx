
import { useState, useEffect } from 'react';
import { Flex, Text, TextArea, Button, Checkbox } from '@gravity-ui/uikit';
import { Check, X } from 'lucide-react';
import CodeBlock from './CodeBlock';
import { TestModel } from '../api';

interface QuestionDisplayProps {
  test: TestModel;
  onSubmit: (answer: string | number[]) => void;
  onReset: () => void;
  disabled?: boolean;
  answerResult?: {
    correct: boolean;
    correctAnswer?: string;
    correctOptions?: number[];
  } | null;
}

const processQuestionText = (text: string): { questionText: string; codeBlock: string | null } => {
  const cleanText = text.replace(/\\n/g, '\n');
  const codeMatch = cleanText.match(/```csharp([\s\S]*?)```/);
  
  if (codeMatch) {
    const questionText = cleanText.split('```')[0].trim();
    const codeBlock = codeMatch[1].trim();
    return { questionText, codeBlock };
  }
  
  return { questionText: cleanText, codeBlock: null };
};

const QuestionDisplay = ({ test, onSubmit, onReset, disabled = false, answerResult }: QuestionDisplayProps) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [codeAnswer, setCodeAnswer] = useState<string>('');
  const { questionText, codeBlock } = processQuestionText(test.question);

  useEffect(() => {
    setSelectedOptions([]);
    setCodeAnswer('');
  }, [test.id]);

  const handleOptionToggle = (optionId: number) => {    
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  const handleSubmit = () => {
    if (test.isCodeTest) {
      onSubmit(codeAnswer);
    } else {
      onSubmit(selectedOptions);
    }
  };

  const handleReset = () => {
    setSelectedOptions([]);
    setCodeAnswer('');
    onReset(); // Вызываем родительский обработчик для сброса answerResult
  };

  const getOptionStyle = (optionId: number) => {
    if (!answerResult || !answerResult.correctOptions) return {};
    
    const isSelected = selectedOptions.includes(optionId);
    const isCorrect = answerResult.correctOptions.includes(optionId);
    
    if (isSelected) {
      if (isCorrect) {
        return {
          backgroundColor: 'var(--g-color-success-light)',
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid var(--g-color-success)'
        };
      } else {
        return {
          backgroundColor: 'var(--g-color-danger-light)',
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid var(--g-color-danger)'
        };
      }
    } else if (isCorrect) {
      return {
        backgroundColor: 'var(--g-color-success-light)',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid var(--g-color-success)',
        opacity: 0.7
      };
    }
    
    return {
      padding: '8px',
      borderRadius: '4px'
    };
  };

  return (
    <Flex direction="column" gap={4}>
      <Text variant="body-1" style={{ fontSize: '1.1rem' }}>
        {questionText}
      </Text>
      
      {codeBlock && (
        <Flex direction="column" gap={2}>
          <CodeBlock code={codeBlock} />
          <Text variant="caption" color="secondary">
            * - compilation error ** - runtime error
          </Text>
        </Flex>
      )}

      {answerResult && (
        <Flex alignItems="center" gap={2} className="mb-2 p-4 rounded-lg" 
              style={{ backgroundColor: answerResult.correct ? 'var(--g-color-success-light)' : 'var(--g-color-danger-light)' }}>
          {answerResult.correct ? (
            <Check className="text-green-500" size={24} />
          ) : (
            <X className="text-red-500" size={24} />
          )}
          <Text variant="body-1" className="font-medium">
            {answerResult.correct ? 'Correct!' : 'Incorrect'}
          </Text>
        </Flex>
      )}

      {test.isCodeTest ? (
        <Flex direction="column" gap={2}>
          <Text variant="subheader-1">Your Answer:</Text>
          <TextArea
            value={codeAnswer}
            onChange={(e) => setCodeAnswer(e.target.value)}
            placeholder="Write your answer here..."
            rows={8}
            size="l"
            disabled={disabled || (answerResult !== null)}
          />
          {answerResult && !answerResult.correct && answerResult.correctAnswer && (
            <Text variant="body-2" color="secondary">
              Expected answer: {answerResult.correctAnswer}
            </Text>
          )}
        </Flex>
      ) : (
        <Flex direction="column" gap={2}>
          <Text variant="subheader-1">Select all correct answers:</Text>
          <Flex direction="column" gap={2}>
            {test.options.map((option) => (
              <div key={option.id} style={getOptionStyle(option.id)}>
                <Checkbox
                  checked={selectedOptions.includes(option.id)}
                  onChange={() => handleOptionToggle(option.id)}
                  disabled={disabled || (answerResult !== null)}
                >
                  {option.optionText}
                </Checkbox>
              </div>
            ))}
          </Flex>
        </Flex>
      )}

      <Flex gap={2}>
        {!answerResult ? (
          <Button
            view="action"
            size="l"
            onClick={handleSubmit}
            disabled={disabled || 
                     (test.isCodeTest ? !codeAnswer : selectedOptions.length === 0)}
          >
            Submit Answer
          </Button>
        ) : (
          <Button
            view="action"
            size="l"
            onClick={handleReset}
            disabled={disabled}
          >
            Try Again
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default QuestionDisplay;
