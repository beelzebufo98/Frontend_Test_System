import { useMemo } from 'react'
import { CircleCheck, CircleExclamation, CircleQuestion } from '@gravity-ui/icons'
import { Card, Flex, Text, Button, Icon } from '@gravity-ui/uikit'

type QuestionStatus = 'correct' | 'incorrect' | 'unanswered'

type QuestionAttempt = {
  questionId: number
  lastAttemptCorrect: boolean
  attempted: boolean
}

// QuestionNavigation.tsx

interface QuestionNavigationProps {
  totalQuestions: number
  onNavigate: (questionNumber: number) => void
  questionAttempts: QuestionAttempt[]
}

const QuestionNavigation = ({ totalQuestions, onNavigate, questionAttempts }: QuestionNavigationProps) => {
  const getStatus = (questionIndex: number): QuestionStatus => {
    const attempt = questionAttempts[questionIndex]
    if (!attempt || !attempt.attempted) {
      return 'unanswered'
    }
    return attempt.lastAttemptCorrect ? 'correct' : 'incorrect'
  }

  return (
    <Card className="w-full" spacing={{ p: 2 }} style={{ maxWidth: '60vw', width: '100%', maxHeight: 'fit-content' }}>
      <Flex direction="column" gap={2} className="p-4">
        <Text variant="subheader-1" color={'info'} className="mb-2">
          Навигация по вопросам
        </Text>

        <Flex direction={'row'} overflow={'auto'} gap={1} style={{ flexWrap: 'wrap' }}>
          {Array.from({ length: totalQuestions }).map((_, index) => (
            <QuestionButton onClick={(v) => onNavigate(v)} number={index + 1} state={getStatus(index + 1)} />
          ))}
        </Flex>
      </Flex>
    </Card>
  )
}

interface QuestionButtonProps {
  onClick: (value: number) => void
  number: number
  state: QuestionStatus
}

const QuestionButton = ({ number, state, onClick }: QuestionButtonProps) => {
  const IconComponent = useMemo(() => {
    if (state === 'correct') {
      return CircleCheck
    }

    if (state === 'incorrect') {
      return CircleExclamation
    }

    return CircleQuestion
  }, [state])

  const view = useMemo(() => {
    if (state === 'correct') return 'outlined-success'

    if (state === 'incorrect') return 'outlined-danger'

    return 'outlined'
  }, [state])

  return (
    <Button onClick={() => onClick(number)} view={view} size={'xs'} style={{ width: '100px', textAlign: 'left' }}>
      <Flex justifyContent={'space-between'} gap={1} alignItems={'center'} style={{ width: '100%' }}>
        Вопрос {number}
        <Icon data={IconComponent} />
      </Flex>
    </Button>
  )
}

export default QuestionNavigation
