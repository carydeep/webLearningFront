import React, { useEffect, useState } from "react"
import HomeLayout from "../../components/Layouts/homeLayout"
import styles from "../../styles/ClientExercise.module.css"
import Link from "next/link"
import Head from "next/head"
import exerciseApi from "../api/exerciseApi"
import { Exercise } from "../../models/exercise"

function ExerCises() {
  const [exercises, setExercises] = useState<Array<Exercise>>()
  useEffect(() => {
    const fetch = async () => {
      const res = await exerciseApi.getExercise()
      setExercises(res.data)
    }
    fetch()
  }, [])
  return (
    <HomeLayout>
      <div className={`container ${styles.wrapper}`}>
        <Head>
          <title>Luyện tập</title>
        </Head>
        <div className={`${styles.navBar}`}>
          {exercises?.map((exercise) => {
            return (
              <div key={exercise._id} className={`${styles.navItem}  m-0 `}>
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
      </div>
    </HomeLayout>
  )
}

export default ExerCises
