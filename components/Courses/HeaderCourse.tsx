import React, { useEffect, useState } from "react"
import styles from "../../styles/HeaderCourse.module.css"
import Link from "next/link"
import { HouseFill } from "react-bootstrap-icons"
import { Course } from "../../models/course"
import courseApi from "../../pages/api/courseApi"

function HeaderCourse({ current }: { current: any }) {
  const [data, setData] = useState<Array<Course>>([])
  useEffect(() => {
    const fetch = async () => {
      const res = await courseApi.getCourse()
      setData(res.data)
    }
    fetch()
  }, [])
  return (
    <ul className={styles.header}>
      <li className={styles.header_course}>
        <Link href={`/`}>
          <a className={styles.header_link_home}>
            <HouseFill />
          </a>
        </Link>
      </li>
      {data.map(({ _id, name, slug }) => {
        const active = slug === current ? true : false
        return (
          <li
            key={_id}
            className={`${styles.header_course} ${active ? styles.active : ""}`}
          >
            <Link href={`/khoahoc/${slug}`} key={_id}>
              <a className={styles.header_link}>{name}</a>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export default HeaderCourse
