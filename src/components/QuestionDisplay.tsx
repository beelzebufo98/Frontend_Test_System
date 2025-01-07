import { Flex, Text } from '@gravity-ui/uikit';
import CodeBlock from './CodeBlock';

interface QuestionDisplayProps {
  question: string;
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

const QuestionDisplay = ({ question }: QuestionDisplayProps) => {
  const { questionText, codeBlock } = processQuestionText(question);
  
  return (
    <Flex direction="column" gap={4}>
      <Text variant="body-1" style={{ fontSize: '1.1rem' }}>
        {questionText}
      </Text>
      {codeBlock && <CodeBlock code={codeBlock} />}
    </Flex>
  );
};

export default QuestionDisplay;