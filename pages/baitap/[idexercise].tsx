import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import styles from "../../styles/ClientExercise.module.css"
import Link from "next/link"
import HomeLayout from "../../components/Layouts/homeLayout"
import { Field, Form, Formik } from "formik"
import {
  ArrowCounterclockwise,
  Check2Circle,
  ChevronLeft,
  ChevronRight,
  XCircle,
} from "react-bootstrap-icons"
import * as Yup from "yup"
import Head from "next/head"
import exerciseApi from "../api/exerciseApi"
import { Exercise, Question } from "../../models/exercise"
import { isArray } from "util"
function QuestionPage() {
  const router = useRouter()
  const { idexercise } = router.query
  const [exercises, setExercises] = useState<Array<Exercise>>()
  const [questions, setQuestions] = useState<Array<Question>>()
  const [currentQuestion, setCurrentQuestion] = useState<Question>()
  const [process, setProcess] = useState<Array<any>>([])
  const [yourAnswer, setYourAwser] = useState<any>(undefined)
  const [showSumary, setShowSumary] = useState<boolean>(false)
  const [initialValue, setInitialValue] = useState<any>({
    genus: currentQuestion?.genus == "one",
    options: undefined,
  })
  const validateShema = Yup.object().shape({
    genus: Yup.boolean(),
    options: Yup.mixed().when("genus", {
      is: true,
      then: Yup.string().required("Bạn phải chọn đáp án."),
      otherwise: Yup.array().min(1, "Phải chọn ít nhất 1 đáp án"),
    }),
  })
  useEffect(() => {
    const fetch = async () => {
      const res = await exerciseApi.getExercise()
      setExercises(res.data)
    }
    fetch()
  }, [])
  useEffect(() => {
    const fetch = async () => {
      const res = await exerciseApi.getExerciseByID(idexercise as string)
      setQuestions(res.data.questions)
    }
    idexercise && fetch()
  }, [idexercise])
  useEffect(() => {
    questions && questions.length > 0 && setCurrentQuestion(questions[0])
  }, [questions])
  useEffect(() => {
    if (process.some((p) => p.id == currentQuestion?._id)) {
      const indexInProccess = process.findIndex(
        (pro) => pro.id === currentQuestion?._id
      )
      setInitialValue({
        genus: currentQuestion?.genus === "one" ? true : false,
        options: process[indexInProccess]?.options,
      })
    } else {
      switch (currentQuestion?.genus) {
        case "one":
          setInitialValue({
            genus: true,
            options: "",
          })
          break
        case "mul":
          setInitialValue({
            genus: false,
            options: [],
          })
          break
      }
    }
    setYourAwser(process.find((p) => p.id === currentQuestion?._id))
  }, [currentQuestion])

  const handleNextQuestion = (resetForm: any) => {
    currentQuestion &&
      questions &&
      setCurrentQuestion(questions[questions.indexOf(currentQuestion) + 1])
    resetForm()
  }
  const handlePrevQuestion = (resetForm: any) => {
    currentQuestion &&
      questions &&
      setCurrentQuestion(questions[questions.indexOf(currentQuestion) - 1])
    resetForm()
  }
  const handleSumary = () => {
    setShowSumary(true)
  }
  console.log(process)
  const handleReset = (resetForm: any) => {
    setProcess([])
    setYourAwser(undefined)
    setInitialValue({
      genus: currentQuestion?.genus == "one",
      options: undefined,
    })
    resetForm()
  }
  return (
    <HomeLayout>
      <div>
        <Head>
          <title>Bài tập</title>
        </Head>
        <div className={`container ${styles.wrapper}`}>
          <div className="d-flex mt-4">
            <div className={`${styles.navBar}`}>
              {exercises?.map((exercise) => {
                return (
                  <div
                    key={exercise._id}
                    className={`${styles.navItem} ${
                      idexercise == exercise._id && styles.active
                    } m-0 `}
                  >
                    <Link
                      href={{
                        pathname: "/baitap/[idexercise]",
                        query: {
                          idexercise: exercise._id,
                        },
                      }}
                    >
                      <a className={styles.navLink}>{exercise.name}</a>
                    </Link>
                  </div>
                )
              })}
            </div>

            {!showSumary ? (
              currentQuestion && (
                <div className={styles.question}>
                  <div className={styles.statement}>
                    <h5
                      className={`${styles.number} ${
                        yourAnswer?.isAnswerRight ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {(questions?.indexOf(currentQuestion) || 0) + 1}
                      <span className={styles.status}>
                        {yourAnswer?.is_answer_right ? (
                          <Check2Circle />
                        ) : (
                          <XCircle />
                        )}
                      </span>
                    </h5>
                    {currentQuestion.name}
                  </div>
                  <Formik
                    enableReinitialize
                    initialValues={initialValue}
                    validationSchema={validateShema}
                    onSubmit={async (value) => {
                      const takeIsRight = currentQuestion.options
                        .filter((option) => option.isRight)
                        .map((option) => option._id)
                      const checkAnswer = (
                        a: Array<string> | string,
                        b: Array<string>
                      ) => {
                        if (value.genus) {
                          if (a === b[0]) {
                            return true
                          } else {
                            return false
                          }
                        } else {
                          if (
                            a.length === b.length &&
                            isArray(a) &&
                            a.every((item: any) => b.includes(item)) &&
                            b.every((item) => a.includes(item))
                          ) {
                            return true
                          } else {
                            return false
                          }
                        }
                      }
                      setProcess((prev) => [
                        ...prev,
                        {
                          id: currentQuestion._id,
                          ...value,
                          isAnswerRight: checkAnswer(
                            value.options,
                            takeIsRight
                          ),
                        },
                      ])
                      setYourAwser({
                        ...value,
                        isAnswerRight: checkAnswer(value.options, takeIsRight),
                      })
                    }}
                  >
                    {({ values, errors, resetForm }) => (
                      <Form>
                        <div className={styles.option}>
                          {currentQuestion.options.map((option, index) => {
                            return (
                              <label
                                key={index}
                                className={`
                                    ${styles.item} 
                                    ${
                                      currentQuestion.genus === "one"
                                        ? values.options == option._id &&
                                          styles.hover
                                        : values.options?.includes(
                                            option._id
                                          ) && styles.hover
                                    }
                                    ${
                                      yourAnswer &&
                                      !yourAnswer.isAnswerRight &&
                                      (yourAnswer.options == option._id ||
                                        yourAnswer.options?.includes(
                                          option._id
                                        )) &&
                                      styles.incorrect
                                    }
                                    ${
                                      yourAnswer &&
                                      yourAnswer.isAnswerRight &&
                                      (yourAnswer.options == option._id ||
                                        yourAnswer.options?.includes(
                                          option._id
                                        )) &&
                                      styles.correct
                                    }
                                        `}
                              >
                                <div className="d-flex align-self-start align-items-center">
                                  <Field
                                    type={
                                      currentQuestion.genus === "one"
                                        ? "radio"
                                        : "checkbox"
                                    }
                                    name="options"
                                    value={option._id}
                                    className={styles.name}
                                    disabled={process.some(
                                      (p) => p.id == currentQuestion._id
                                    )}
                                  />
                                  {`${String.fromCharCode(
                                    97 + index
                                  ).toUpperCase()})  ${option.statement}`}
                                </div>
                                {yourAnswer && (
                                  <div className={styles.explain}>
                                    {currentQuestion.options[index].explain}
                                  </div>
                                )}
                              </label>
                            )
                          })}
                          {errors && (
                            <div className="text-danger">
                              {errors.options as string}
                            </div>
                          )}
                        </div>
                        <div className={styles.function}>
                          <button
                            type="reset"
                            className={styles.button}
                            onClick={() => handleReset(resetForm)}
                          >
                            Làm lại bài tập <ArrowCounterclockwise />
                          </button>
                          <div className="d-flex align-items-center">
                            <button
                              type="button"
                              className={`${styles.next} 
                              ${
                                questions?.indexOf(currentQuestion) === 0 &&
                                styles.disable
                              }
                              `}
                              onClick={() => handlePrevQuestion(resetForm)}
                            >
                              <ChevronLeft />
                            </button>
                            <div className={styles.process}>
                              <div>{`Question ${
                                (questions?.indexOf(currentQuestion) || 0) + 1
                              } of ${questions?.length}`}</div>
                              <div>{process.length} attempt</div>
                            </div>
                            {questions?.length !==
                            (questions?.indexOf(currentQuestion) || 0) + 1 ? (
                              <button
                                type="button"
                                className={styles.next}
                                onClick={() => handleNextQuestion(resetForm)}
                              >
                                <ChevronRight />
                              </button>
                            ) : (
                              <button
                                type="button"
                                className={styles.next}
                                onClick={() => handleSumary()}
                              >
                                <Check2Circle />
                              </button>
                            )}
                          </div>
                          <button
                            type="submit"
                            className={styles.button}
                            disabled={process.some(
                              (p) => p.id == currentQuestion._id
                            )}
                          >
                            Nộp
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              )
            ) : (
              <div className={styles.sumary}>
                <h3 className={styles.title}>Kết quả</h3>
                <div>
                  <div className={`${styles.item} ${styles.correct}`}>
                    Số câu đúng{" "}
                    <span>
                      {process.reduce(
                        (sum: any, item: any) =>
                          sum + (item.isAnswerRight ? 1 : 0),
                        0
                      )}
                    </span>
                  </div>
                  <div className={`${styles.item} ${styles.incorrect}`}>
                    Số câu sai{" "}
                    <span>
                      {process.reduce(
                        (sum: any, item: any) =>
                          sum + (item.isAnswerRight ? 0 : 1),
                        0
                      )}
                    </span>
                  </div>
                  <div className={`${styles.item} ${styles.notDone}`}>
                    Số câu chưa trả lời{" "}
                    <span>{(questions?.length || 0) - process.length}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.button}
                  onClick={() => setShowSumary(false)}
                >
                  Tiếp tục trả lời
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </HomeLayout>
  )
}

export default QuestionPage
