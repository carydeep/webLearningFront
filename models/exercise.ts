export interface Exercise {
  _id: string
  name: string
  coCreator: Array<string>
  author: string
  questions: Array<Question>
  public: boolean
}

export interface CreateExcerciseApi {
  name: string
  coCreator: Array<string>
}

export interface Question {
  _id: string
  name: string
  options: Array<Option>
  exerciseId: string
  genus: string
}

interface Option {
  explain: string
  isRight: boolean
  statement: string
}

export interface AddQuestionApi {
  name: string
  options: Array<Option>
}
