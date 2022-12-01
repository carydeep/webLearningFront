import React, { Fragment, ReactElement } from "react"
import HomeLayout from "../../components/Layouts/homeLayout"
import UserLayout from "../../components/Layouts/userLayout"
import { Card } from "react-bootstrap"
import styles from "../../styles/User.module.css"
import { Book, PatchQuestion, PersonBadge } from "react-bootstrap-icons"
import Link from "next/link"
import Head from "next/head"

function User() {
  return (
    <Fragment>
      <Head>
        <title>Bảng điều khiển</title>
      </Head>
      <div className="col-6 col-md-4 col-lg-3 text-center">
        <Card className={`${styles.card} ${styles.card_profile}`}>
          <Card.Body>
            <Card.Text>
              <PersonBadge
                className={`${styles.card_icon} ${styles.card_icon_profile}`}
              />
            </Card.Text>
            <Card.Title>Hồ sơ</Card.Title>
            <Card.Text>Chỉnh sửa hồ sơ cá nhân, đổi mật khẩu.</Card.Text>
            <Card.Text className="mt-4">
              <Link href="/user/profile">
                <a className={styles.card_button}>Xem</a>
              </Link>
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
      <div className="col-6 col-md-4 col-lg-3 text-center">
        <Card className={`${styles.card} ${styles.card_course}`}>
          <Card.Body>
            <Card.Text>
              <Book
                className={`${styles.card_icon} ${styles.card_icon_course}`}
              />
            </Card.Text>
            <Card.Title>Khóa học</Card.Title>
            <Card.Text>Thêm, sửa, xóa, xem khóa học của bạn.</Card.Text>
            <Card.Text className="mt-4">
              <Link href="/user/mycourse">
                <a className={styles.card_button}>Xem</a>
              </Link>
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
      <div className="col-6 col-md-4 col-lg-3 text-center">
        <Card className={`${styles.card} ${styles.card_question}`}>
          <Card.Body>
            <Card.Text>
              <PatchQuestion
                className={`${styles.card_icon} ${styles.card_icon_question}`}
              />
            </Card.Text>
            <Card.Title>Câu hỏi</Card.Title>
            <Card.Text>
              Thêm, sửa, xóa các câu hỏi cho khóa học của bạn.
            </Card.Text>
            <Card.Text className="mt-4">
              <Link href="/user/exercise">
                <a className={styles.card_button}>Xem</a>
              </Link>
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    </Fragment>
  )
}

export default User

User.getLayout = function getLayout(page: ReactElement) {
  return (
    <HomeLayout>
      <UserLayout>{page}</UserLayout>
    </HomeLayout>
  )
}
