export type SectionModel = {
  id: number
  name: string
}

export type TestModel = {
  id: number
  sectionId: number
  question: string
  isCodeTest: boolean
  options: Array<TestOptionModel>
}

export type TestOptionModel = {
  id: number
  testId: number
  optionText: string
}
