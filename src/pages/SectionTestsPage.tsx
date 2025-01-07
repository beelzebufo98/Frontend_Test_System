
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Flex, Text, Link, Button } from '@gravity-ui/uikit';
import { axiosClient, TestModel } from '../api';
import QuestionDisplay from '../components/QuestionDisplay';
import QuestionNavigation from '../components/QuestionNavigation';

interface AnswerResult {
  correct: boolean;
  correctAnswer?: string;
  correctOptions?: number[];
}

const SectionTestsPage = () => {
  const { sectionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState<Array<TestModel>>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!sectionId) return;
    loadTests();
  }, [sectionId]);

  const loadTests = async () => {
    try {
      setLoading(true);
      setCurrentQuestionIndex(0);
      const response = await axiosClient.get(`/test/section/${sectionId}`);
      setTests(response.data);
    } catch (error) {
      console.error('Error loading tests:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Text>Loading tests...</Text>;
  if (tests.length === 0) return <Text>No tests found in this section</Text>;

  const currentTest = tests[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === tests.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const handleNextQuestion = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(prev => prev + 1);
      setAnswerResult(null);
    }
  };

  const handlePreviousQuestion = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(prev => prev - 1);
      setAnswerResult(null);
    }
  };

  const handleQuestionNavigation = (questionIndex: number) => {
    setCurrentQuestionIndex(questionIndex);
    setAnswerResult(null);
  };

  const handleAnswerSubmit = async (answer: string | number[]) => {
    try {
      setSubmitting(true);
      const response = await axiosClient.post('/test/check-answer', {
        testId: currentTest.id,
        selectedOptions: Array.isArray(answer) ? answer : [],
        userAnswer: typeof answer === 'string' ? answer : '',
      });
      
      setAnswerResult({
        correct: response.data,
        correctAnswer: currentTest.isCodeTest ? response.data.correctAnswer : undefined,
        correctOptions: !currentTest.isCodeTest ? response.data.correctOptions : undefined
      });
    } catch (error) {
      console.error('Error checking answer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Flex direction="column" gap={4} className="w-full max-w-3xl mx-auto p-6">
      <Link href="/" view="secondary" className="mb-2">
        ← Back to Sections
      </Link>
      
      <Flex gap={4}>
        <Flex direction="column" className="flex-grow">
          <Card className="w-full">
            <Flex direction="column" className="p-6">
              <Flex justifyContent="space-between" alignItems="center" className="mb-6">
                <Text variant="header-2">
                  Question {currentQuestionIndex + 1}
                </Text>
                <Text variant="body-2" color="secondary">
                  {currentTest.isCodeTest ? 'Code Test' : 'Multiple Choice Test'}
                </Text>
              </Flex>
              
              <QuestionDisplay
                test={currentTest}
                onSubmit={handleAnswerSubmit}
                disabled={submitting}
                answerResult={answerResult}
              />
            </Flex>
          </Card>

          <Flex gap={4} justifyContent="space-between" className="mt-4">
            <Button
              view="normal"
              size="l"
              onClick={handlePreviousQuestion}
              disabled={isFirstQuestion}
            >
              Previous Question
            </Button>

            <Text variant="body-1" color="secondary" className="self-center">
              {currentQuestionIndex + 1} / {tests.length}
            </Text>

            <Button
              view="action"
              size="l"
              onClick={handleNextQuestion}
              disabled={isLastQuestion}
            >
              Next Question
            </Button>
          </Flex>
        </Flex>

        <Flex direction="column" className="w-64">
          <QuestionNavigation
            currentQuestion={currentQuestionIndex}
            totalQuestions={tests.length}
            onNavigate={handleQuestionNavigation}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default SectionTestsPage;
