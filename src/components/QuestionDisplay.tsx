
// import { useState, useEffect } from 'react';
// import { Flex, Text, TextArea, Button, Checkbox } from '@gravity-ui/uikit';
// import { Check, X } from 'lucide-react';
// import CodeBlock from './CodeBlock';
// import { TestModel } from '../api';

// interface QuestionDisplayProps {
//   test: TestModel;
//   onSubmit: (answer: string | number[]) => void;
//   onReset: () => void;
//   disabled?: boolean;
//   answerResult?: {
//     correct: boolean;
//     correctAnswer?: string;
//     correctOptions?: number[];
//   } | null;
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

// const QuestionDisplay = ({ test, onSubmit, onReset, disabled = false, answerResult }: QuestionDisplayProps) => {
//   const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
//   const [codeAnswer, setCodeAnswer] = useState<string>('');
//   const { questionText, codeBlock } = processQuestionText(test.question);

//   useEffect(() => {
//     setSelectedOptions([]);
//     setCodeAnswer('');
//   }, [test.id]);

//   const handleOptionToggle = (optionId: number) => {    
//     setSelectedOptions(prev => {
//       if (prev.includes(optionId)) {
//         return prev.filter(id => id !== optionId);
//       } else {
//         return [...prev, optionId];
//       }
//     });
//   };

//   const handleSubmit = () => {
//     if (test.isCodeTest) {
//       onSubmit(codeAnswer);
//     } else {
//       onSubmit(selectedOptions);
//     }
//   };

//   const handleReset = () => {
//     setSelectedOptions([]);
//     setCodeAnswer('');
//     onReset(); // Вызываем родительский обработчик для сброса answerResult
//   };

//   const getOptionStyle = (optionId: number) => {
//     if (!answerResult || !answerResult.correctOptions) return {};
    
//     const isSelected = selectedOptions.includes(optionId);
//     const isCorrect = answerResult.correctOptions.includes(optionId);
    
//     if (isSelected) {
//       if (isCorrect) {
//         return {
//           backgroundColor: 'var(--g-color-success-light)',
//           padding: '8px',
//           borderRadius: '4px',
//           border: '1px solid var(--g-color-success)'
//         };
//       } else {
//         return {
//           backgroundColor: 'var(--g-color-danger-light)',
//           padding: '8px',
//           borderRadius: '4px',
//           border: '1px solid var(--g-color-danger)'
//         };
//       }
//     } else if (isCorrect) {
//       return {
//         backgroundColor: 'var(--g-color-success-light)',
//         padding: '8px',
//         borderRadius: '4px',
//         border: '1px solid var(--g-color-success)',
//         opacity: 0.7
//       };
//     }
    
//     return {
//       padding: '8px',
//       borderRadius: '4px'
//     };
//   };

//   return (
//     <Flex direction="column" gap={4}>
//       <Text variant="body-1" style={{ fontSize: '1.1rem' }}>
//         {questionText}
//       </Text>
      
//       {codeBlock && (
//         <Flex direction="column" gap={2}>
//           <CodeBlock code={codeBlock} />
//           <Text variant="caption" color="secondary">
//             * - compilation error ** - runtime error
//           </Text>
//         </Flex>
//       )}

//       {answerResult && (
//         <Flex alignItems="center" gap={2} className="mb-2 p-4 rounded-lg" 
//               style={{ backgroundColor: answerResult.correct ? 'var(--g-color-success-light)' : 'var(--g-color-danger-light)' }}>
//           {answerResult.correct ? (
//             <Check className="text-green-500" size={24} />
//           ) : (
//             <X className="text-red-500" size={24} />
//           )}
//           <Text variant="body-1" className="font-medium">
//             {answerResult.correct ? 'Correct!' : 'Incorrect'}
//           </Text>
//         </Flex>
//       )}

//       {test.isCodeTest ? (
//         <Flex direction="column" gap={2}>
//           <Text variant="subheader-1">Your Answer:</Text>
//           <TextArea
//             value={codeAnswer}
//             onChange={(e) => setCodeAnswer(e.target.value)}
//             placeholder="Write your answer here..."
//             rows={8}
//             size="l"
//             disabled={disabled || (answerResult !== null)}
//           />
//           {answerResult && !answerResult.correct && answerResult.correctAnswer && (
//             <Text variant="body-2" color="secondary">
//               Expected answer: {answerResult.correctAnswer}
//             </Text>
//           )}
//         </Flex>
//       ) : (
//         <Flex direction="column" gap={2}>
//           <Text variant="subheader-1">Select all correct answers:</Text>
//           <Flex direction="column" gap={2}>
//             {test.options.map((option) => (
//               <div key={option.id} style={getOptionStyle(option.id)}>
//                 <Checkbox
//                   checked={selectedOptions.includes(option.id)}
//                   onChange={() => handleOptionToggle(option.id)}
//                   disabled={disabled || (answerResult !== null)}
//                 >
//                   {option.optionText}
//                 </Checkbox>
//               </div>
//             ))}
//           </Flex>
//         </Flex>
//       )}

//       <Flex gap={2}>
//         {!answerResult ? (
//           <Button
//             view="action"
//             size="l"
//             onClick={handleSubmit}
//             disabled={disabled || 
//                      (test.isCodeTest ? !codeAnswer : selectedOptions.length === 0)}
//           >
//             Submit Answer
//           </Button>
//         ) : (
//           <Button
//             view="action"
//             size="l"
//             onClick={handleReset}
//             disabled={disabled}
//           >
//             Try Again
//           </Button>
//         )}
//       </Flex>
//     </Flex>
//   );
// };

// export default QuestionDisplay;
// QuestionDisplay.tsx
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
  // Ищем начало кода по ключевым словам
  const keywords = ['using System;', 'using static System.Console;', 'public class', 'class Program','static void Main','public','private','protected','class','struct'];
  let codeStartIndex = -1;
  
  // Проверяем каждое ключевое слово
  for (const keyword of keywords) {
    const index = text.indexOf(keyword);
    if (index !== -1 && (codeStartIndex === -1 || index < codeStartIndex)) {
      codeStartIndex = index;
    }
  }

  // Если не нашли ключевые слова, ищем вхождение "using" отдельно
  if (codeStartIndex === -1) {
    const usingIndex = text.match(/using\s+[A-Za-z.]+;/);
    if (usingIndex) {
      codeStartIndex = usingIndex.index;
    }
  }

  // Если все еще не нашли начало кода, ищем "public class" или "class"
  if (codeStartIndex === -1) {
    const classMatch = text.match(/(?:public\s+)?class\s+[A-Za-z]+/);
    if (classMatch) {
      codeStartIndex = classMatch.index;
    }
  }

  // Если не нашли начало по ключевым словам, ищем фигурную скобку с учетом контекста
  if (codeStartIndex === -1) {
    const braceMatch = text.match(/\s*{/);
    if (braceMatch) {
      // Проверяем, что перед скобкой есть какой-то контекст C#
      const beforeBrace = text.substring(0, braceMatch.index).trim();
      if (beforeBrace.includes('class') || beforeBrace.includes('public') || 
          beforeBrace.includes('private') || beforeBrace.includes('protected')) {
        codeStartIndex = braceMatch.index;
      }
    }
  }

  // Если не нашли начало кода, возвращаем весь текст как вопрос
  if (codeStartIndex === -1) {
    return { questionText: text.trim(), codeBlock: null };
  }

  // Находим текст до кода
  const questionPart = text.substring(0, codeStartIndex).trim();
  
  // Извлекаем код, включая строку с началом кода
  const codePart = text.substring(codeStartIndex);
  
  // Форматируем код
  const formattedCode = formatCSharpCode(codePart);

  return {
    questionText: questionPart,
    codeBlock: formattedCode
  };
};

const formatCSharpCode = (code: string): string => {
  // Разбиваем код на строки
  const lines = code.split('\n');
  
  // Убираем пустые строки в начале и конце
  while (lines.length > 0 && lines[0].trim() === '') lines.shift();
  while (lines.length > 0 && lines[lines.length - 1].trim() === '') lines.pop();

  // Применяем правильные отступы
  let currentIndent = 0;
  const properlyIndentedLines = lines.map((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine === '') return '';
    
    // Уменьшаем отступ для закрывающих скобок
    if (trimmedLine.startsWith('}')) {
      currentIndent = Math.max(0, currentIndent - 1);
    }
    
    // Применяем текущий отступ
    const indentedLine = '    '.repeat(currentIndent) + trimmedLine;
    
    // Увеличиваем отступ после открывающей скобки
    if (trimmedLine.endsWith('{')) {
      currentIndent++;
    }
    
    return indentedLine;
  }).filter(line => line !== ''); // Убираем пустые строки

  return properlyIndentedLines.join('\n');
};

// ... остальной код компонента остается без изменений ...

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
    onReset();
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