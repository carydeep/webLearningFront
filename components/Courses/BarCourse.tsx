import React, { Fragment, useEffect, useState } from "react"
import Link from "next/link"
import styles from "../../styles/BarCourse.module.css"
import axios from "axios"
import courseApi from "../../pages/api/courseApi"
import { Course } from "../../models/course"

function BarCourse({ courseName, current }: { courseName: any; current: any }) {
  const [data, setData] = useState<Course>()
  useEffect(() => {
    const fetch = async () => {
      const response = await courseApi.getCourseBySlug(courseName)
      setData(response.data)
    }
    courseName && fetch()
  }, [courseName])
  return (
    <div className={styles.barCourse}>
      {data?.chapters.map(({ _id, name, lessons }) => {
        const chapterID = _id
        return (
          <div key={_id}>
            <h5 className="ps-2">{name}</h5>
            <ul className={styles.listChapter}>
              {lessons.map(({ _id, name }) => {
                const active = _id === current ? true : false
                return (
                  <li
                    key={_id}
                    className={`${styles.link} ${active ? styles.active : ""}`}
                  >
                    <Link
                      href={`/khoahoc/${courseName}/id?chapter=${chapterID}&lesson=${_id}`}
                    >
                      <a className="text-decoration-none text-reset">{name}</a>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

export default BarCourse
