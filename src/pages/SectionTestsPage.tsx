import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {Card, Flex, Text, Link, Button, Icon, Spin} from '@gravity-ui/uikit'
import { ArrowLeft, ArrowRight } from '@gravity-ui/icons'

import { axiosClient, TestModel } from '../api'
import QuestionDisplay from '../components/QuestionDisplay'
import QuestionNavigation from '../components/QuestionNavigation'

interface AnswerResult {
  correct: boolean
  correctAnswer?: string
  correctOptions?: number[]
}

type QuestionAttempt = {
  questionId: number
  lastAttemptCorrect: boolean
  attempted: boolean
}

const SectionTestsPage = () => {
  const { sectionId } = useParams()
  const [loading, setLoading] = useState(true)
  const [tests, setTests] = useState<Array<TestModel>>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [questionAttempts, setQuestionAttempts] = useState<QuestionAttempt[]>([])

  useEffect(() => {
    if (!sectionId) return
    loadTests()
  }, [sectionId])

  const loadTests = async () => {
    try {
      setLoading(true)
      setCurrentQuestionIndex(0)
      const response = await axiosClient.get(`/test/section/${sectionId}`)
      const tests = response.data
      setTests(tests)

      // Initialize question attempts array
      const initialAttempts = tests.map((test: TestModel) => ({
        questionId: test.id,
        lastAttemptCorrect: false,
        attempted: false,
      }))
      setQuestionAttempts(initialAttempts)

      // Try to load previous attempts from localStorage
      const savedAttempts = localStorage.getItem(`section_${sectionId}_attempts`)
      if (savedAttempts) {
        try {
          const parsedAttempts = JSON.parse(savedAttempts)
          // Verify the saved attempts match our current test set
          if (parsedAttempts.length === tests.length) {
            setQuestionAttempts(parsedAttempts)
          }
        } catch (e) {
          console.error('Error parsing saved attempts:', e)
        }
      }
    } catch (error) {
      console.error('Error loading tests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setAnswerResult(null)
  }

  const saveAttemptsToLocalStorage = (attempts: QuestionAttempt[]) => {
    try {
      localStorage.setItem(`section_${sectionId}_attempts`, JSON.stringify(attempts))
    } catch (e) {
      console.error('Error saving attempts to localStorage:', e)
    }
  }

  const handleAnswerSubmit = async (answer: string | number[]) => {
    if (!currentTest) return

    try {
      setSubmitting(true)
      const response = await axiosClient.post('/test/check-answer', {
        testId: currentTest.id,
        selectedOptions: Array.isArray(answer) ? answer : [],
        userAnswer: typeof answer === 'string' ? answer : '',
      })

      const result = {
        correct: response.data.correct || response.data, // Handle both object and boolean responses
        correctAnswer: currentTest.isCodeTest ? response.data.correctAnswer : undefined,
        correctOptions: !currentTest.isCodeTest ? response.data.correctOptions : undefined,
      }

      setAnswerResult(result)

      // Update question attempts
      const newAttempts = [...questionAttempts]
      newAttempts[currentQuestionIndex] = {
        questionId: currentTest.id,
        lastAttemptCorrect: result.correct,
        attempted: true,
      }
      setQuestionAttempts(newAttempts)

      // Save to localStorage
      saveAttemptsToLocalStorage(newAttempts)
    } catch (error) {
      console.error('Error checking answer:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Flex style={{height: '100vh'}} alignItems="center" justifyContent="center" direction={'column'} gap={'2'}>
        <Spin size={'xl'}/>
        <Text variant={'header-1'}>Загрузка тестов</Text>
      </Flex>
    )
  }

  if (tests.length === 0) {
    return (
      <Flex alignItems="center" justifyContent="center" className="h-screen">
        <Text>No tests found in this section</Text>
      </Flex>
    )
  }

  const currentTest = tests[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === tests.length - 1
  const isFirstQuestion = currentQuestionIndex === 0

  const handleNextQuestion = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setAnswerResult(null)
    }
  }

  const handlePreviousQuestion = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex((prev) => prev - 1)
      setAnswerResult(null)
    }
  }

  const handleQuestionNavigation = (questionIndex: number) => {
    setCurrentQuestionIndex(questionIndex - 1)
    setAnswerResult(null)
  }

  const getProgressStats = () => {
    const attempted = questionAttempts.filter((q) => q.attempted).length
    const correct = questionAttempts.filter((q) => q.lastAttemptCorrect).length
    return { attempted, correct, total: tests.length }
  }

  const stats = getProgressStats()

  return (
    <Flex direction="column" gap={4} spacing={{ p: '2' }} className="w-full max-w-4xl mx-auto p-6">
      <Flex justifyContent="space-between" alignItems="center">
        <Link href="/" className="back-button mb-2">
          <span className="arrow">←</span>
          Вернуться к разделам
        </Link>
        <Flex gap={4}>
          <Text variant="body-2" color="secondary">
            Completed: {stats.attempted}/{stats.total}
          </Text>
          <Text variant="body-2" color="utility">
            Correct: {stats.correct}/{stats.total}
          </Text>
        </Flex>
      </Flex>

      <Flex gap={2}>
        <Flex direction="column" className="flex-grow" gap={3} style={{ width: '100%' }}>
          <Card>
            <Flex direction="column" spacing={{ p: 2 }} gap={3}>
              <Flex justifyContent="space-between" alignItems="center">
                <Text variant="body-2" style={{ fontWeight: 'bolder' }}>
                  Вопрос {currentQuestionIndex + 1}
                </Text>
                <Flex gap={2} alignItems="center">
                  <Text variant="body-2" color="secondary">
                    {currentTest.isCodeTest ? 'Тест с кодом' : 'Тест с множественным выбором'}
                  </Text>
                  {questionAttempts[currentQuestionIndex]?.attempted && (
                    <Text
                      variant="body-2"
                      color={questionAttempts[currentQuestionIndex].lastAttemptCorrect ? 'secondary' : 'danger'}
                    >
                      • Last attempt:{' '}
                      {questionAttempts[currentQuestionIndex].lastAttemptCorrect ? 'Correct' : 'Incorrect'}
                    </Text>
                  )}
                </Flex>
              </Flex>

              <QuestionDisplay
                test={currentTest}
                onSubmit={handleAnswerSubmit}
                onReset={handleReset}
                disabled={submitting}
                answerResult={answerResult}
              />
            </Flex>
          </Card>

          <Flex gap={4} justifyContent="space-between" alignItems={'center'}>
            <Button view="action" size="m" onClick={handlePreviousQuestion} disabled={isFirstQuestion}>
              <Icon data={ArrowLeft} />
              Предыдущий вопрос
            </Button>

            <Text variant="body-1" color="secondary" className="self-center">
              {currentQuestionIndex + 1} / {tests.length}
            </Text>

            <Button view="action" size="m" onClick={handleNextQuestion} disabled={isLastQuestion}>
              Следующий вопрос
              <Icon data={ArrowRight} />
            </Button>
          </Flex>
        </Flex>

        <QuestionNavigation
          totalQuestions={tests.length}
          onNavigate={handleQuestionNavigation}
          questionAttempts={questionAttempts}
        />
      </Flex>
    </Flex>
  )
}

export default SectionTestsPage
