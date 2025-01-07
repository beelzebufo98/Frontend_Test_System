import { useState } from 'react';
import { Flex, Text, TextArea, Button, Checkbox } from '@gravity-ui/uikit';
import CodeBlock from './CodeBlock';
import { TestModel } from '../api';

interface QuestionDisplayProps {
  test: TestModel;
  onSubmit: (answer: string | number[]) => void;
  disabled?: boolean;
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

const QuestionDisplay = ({ test, onSubmit, disabled = false }: QuestionDisplayProps) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [codeAnswer, setCodeAnswer] = useState<string>('');
  const { questionText, codeBlock } = processQuestionText(test.question);

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

  return (
    <Flex direction="column" gap={4}>
      <Text variant="body-1" style={{ fontSize: '1.1rem' }}>
        {questionText}
      </Text>
      
      {codeBlock && <CodeBlock code={codeBlock} />}

      {test.isCodeTest ? (
        // Render code input for code questions
        <Flex direction="column" gap={2}>
          <Text variant="subheader-1">Your Answer:</Text>
          <TextArea
            value={codeAnswer}
            onChange={(e) => setCodeAnswer(e.target.value)}
            placeholder="Write your answer here..."
            rows={8}
            size="l"
            disabled={disabled}
          />
        </Flex>
      ) : (
        // Render checkboxes for multiple choice questions
        <Flex direction="column" gap={2}>
          <Text variant="subheader-1">Select all correct answers:</Text>
          <Flex direction="column" gap={2}>
            {test.options.map((option) => (
              <Checkbox
                key={option.id}
                checked={selectedOptions.includes(option.id)}
                onChange={() => handleOptionToggle(option.id)}
                disabled={disabled}
              >
                {option.optionText}
              </Checkbox>
            ))}
          </Flex>
        </Flex>
      )}

      <Button
        view="action"
        size="l"
        onClick={handleSubmit}
        disabled={disabled || (test.isCodeTest ? !codeAnswer : selectedOptions.length === 0)}
      >
        Submit Answer
      </Button>
    </Flex>
  );
};

export default QuestionDisplay;
// import { Flex, Text } from '@gravity-ui/uikit';
// import CodeBlock from './CodeBlock';

// interface QuestionDisplayProps {
//   question: string;
// }

// const processQuestionText = (text: string): { questionText: string; codeBlock: string | null } => {
//   const cleanText = text.replace(/\\n/g, '\n');
//   const codeMatch = cleanText.match(/```csharp([\s\S]*?)```/);
  
//   if (codeMatch) {
//     const questionText = cleanText.split('```')[0].trim();
//     const codeBlock = codeMatch[1].trim();
//     return { questionText, codeBlock };
//   }
  
//   return { questionText: cleanText, codeBlock: null };
// };

// const QuestionDisplay = ({ question }: QuestionDisplayProps) => {
//   const { questionText, codeBlock } = processQuestionText(question);
  
//   return (
//     <Flex direction="column" gap={4}>
//       <Text variant="body-1" style={{ fontSize: '1.1rem' }}>
//         {questionText}
//       </Text>
//       {codeBlock && <CodeBlock code={codeBlock} />}
//     </Flex>
//   );
// };

// export default QuestionDisplay;