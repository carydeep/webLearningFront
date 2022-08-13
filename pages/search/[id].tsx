import React, { Fragment, useEffect, useState } from "react"
import Head from "next/head"
import courseApi from "../api/courseApi"
import {
  Button,
  ButtonGroup,
  Card,
  Container,
  Dropdown,
  InputGroup,
  ListGroup,
} from "react-bootstrap"
import { useRouter } from "next/router"
import SearchLayout from "../../components/Layouts/searchLayout"
import styles from "../../styles/Search.module.css"
import { MenuButtonWide, Search, X } from "react-bootstrap-icons"
import { motion } from "framer-motion"
import { GetServerSideProps } from "next"
import axios from "axios"
import Link from "next/link"
import { Course } from "../../models/course"
import groupApi from "../api/groupApi"
import { Group } from "../../models/group"
import { Topic } from "../../models/topic"
import topicApi from "../api/topicApi"

const group_param = (group: number | null) => {
  if (group !== null) {
    return `&group=${group}`
  }
  return ""
}

const topics_param = (topics: number[]) => {
  let params = ""
  for (let i in topics) {
    params += `&topics=${topics[i]}`
  }
  return params
}

// const Send = async (
//   search_terms: string,
//   group: number | null,
//   topics: number[]
// ) => {
//   // Chức năng tìm kiếm khóa học.
//   // Ví dụ:
//   // Từ khóa là "python", trong group 1, và liên quan đến 2 chủ đề 1, 2 <[1, 2]>
//   // api/search/?terms=python&group=1&topics=1&topics=2
//   // -----------------
//   // Từ khóa là "javascript", và không quan tâm mấy cái sau.
//   // api/search/?terms=javascript
//   // -----------------
//   // Chỉ tìm theo group, trường hợp dưới đây là tìm tất cả các course trong group 1
//   // (mà Phúc design như w3 thì chắc xổ ra thoi và có lẽ k cần thứ này )
//   // api/search/?terms=&group=1 (1) hoặc api/search/?group=1 (2)
//   // ............^^^^^^
//   // không có từ khóa thì để trống nghĩa là để yên "terms=" (1) hoặc xóa luôn (2)
//   // -----------------
//   // Theo các topic khác nhau: ví dụ dưới đây là có 3 topic lần lượt là 1, 3, 4
//   // Hay [1, 3, 4]
//   // Giả sử tìm khóa học có liên quan đến chủ đề như (lập trình, cấu trúc dữ liệu và giải thuật, python)
//   // Cái này chỉ là thử nghiệm thôi, nhưng ưu điểm là lọc gọn hơn, sát yêu cầu hơn.
//   // api/search/?topics=1&topics=2&topics=3
//   // ======= Happy End =======
//   const url =
//     `api/search/?terms=${search_terms}` +
//     group_param(group) +
//     topics_param(topics);

//   const response: AxiosResponse<Course[]> = await axios.get(url);
//   return response.data;
// };

const bannerSearchVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.2,
    },
  },
}

const title = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.4,
      type: "spring",
    },
  },
}

const SearchID = ({ courses }: { courses: Array<Course> }) => {
  const router = useRouter()
  const [searchTerms, setSearchTerms] = useState<string>("")
  const [groups, setGroups] = useState<Array<Group>>()
  const [topics, setTopics] = useState<Array<Topic>>()
  const [chooseGroup, setChooseGroup] = useState<string>()
  const [chooseTopics, setChooseTopics] = useState<Array<Topic>>([])
  useEffect(() => {
    const fetchData = async () => {
      const resGroup = await groupApi.getGroup()
      setGroups(resGroup.data)
      const resTopic = await topicApi.getTopic()
      setTopics(resTopic.data)
    }
    fetchData()
  }, [])
  const handleAddTopic = (topic: Topic) => {
    const found = chooseTopics.some((oj) => oj.value === topic.value)
    if (!found) {
      setChooseTopics([...chooseTopics, topic])
    }
  }
  const handleRemoveTopic = (topic: Topic) => {
    const remove = chooseTopics.filter((top) => top.value !== topic.value)
    setChooseTopics(remove)
  }
  const handleClearAll = () => {
    setChooseGroup(undefined)
    setChooseTopics([])
  }

  const checkEnter = (e: any) => {
    if (
      e.key === "Enter" &&
      (chooseGroup || chooseTopics.length !== 0 || searchTerms !== "")
    ) {
      const urlTopics = chooseTopics.map((topic) => topic.value)
      const url = `/search/search?q=${searchTerms}&group=${
        chooseGroup || ""
      }&topics=${urlTopics}`
      router.push(url)
    }
  }

  const handleSubmit = () => {
    if (chooseGroup || chooseTopics.length !== 0 || searchTerms !== "") {
      const urlTopics = chooseTopics.map((topic) => topic.value)
      const url = `/search/search?q=${searchTerms}&group=${
        chooseGroup || ""
      }&topics=${urlTopics}`
      router.push(url)
    }
  }
  return (
    <SearchLayout>
      <Fragment>
        <Head>
          <title>Tìm kiếm</title>
          <meta name="description" content="Tìm kiếm khóa học" />
          <link rel="icon" href="/favicon.ico" />
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.14.0/devicon.min.css"
          ></link>
        </Head>

        <motion.div
          className={styles.bannerSearch}
          variants={bannerSearchVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className={`${styles.container_search} container`}
            variants={title}
            initial="hidden"
            animate="visible"
          >
            <h1 className={styles.title}>Tìm kiếm khóa học</h1>
            <InputGroup size="lg" className={styles.input_group}>
              <input
                type="search"
                placeholder="Tìm kiếm ..."
                className={styles.input_text}
                aria-label="Search"
                list="courseName"
                onChange={(e) => setSearchTerms(e.currentTarget.value)}
                onKeyPress={checkEnter}
              />
              <InputGroup.Text
                className={styles.input_icon}
                onClick={handleSubmit}
              >
                <Search />
              </InputGroup.Text>
            </InputGroup>
            <div className={styles.group_course}>
              {groups?.map((group) => {
                return (
                  <ButtonGroup
                    key={group.value}
                    id={group.value}
                    className={styles.button_group}
                  >
                    {chooseGroup === group.value && (
                      <Button
                        className={styles.button_group_cancel}
                        onClick={() => setChooseGroup(undefined)}
                      >
                        <X />
                      </Button>
                    )}
                    <button
                      className={styles.button_group_name}
                      onClick={() => setChooseGroup(group.value)}
                    >
                      {group.name}
                    </button>
                  </ButtonGroup>
                )
              })}
            </div>
            <Dropdown className="mt-3">
              <Dropdown.Toggle className={styles.dropdown_topic}>
                Chủ đề
              </Dropdown.Toggle>

              <Dropdown.Menu
                style={{ maxHeight: "200px", overflowY: "scroll" }}
              >
                {topics?.map((topic) => {
                  return (
                    <Dropdown.Item
                      key={topic.value}
                      onClick={() => handleAddTopic(topic)}
                    >
                      {topic.name}
                    </Dropdown.Item>
                  )
                })}
              </Dropdown.Menu>
            </Dropdown>

            <ListGroup horizontal>
              {chooseTopics.length !== 0 &&
                chooseTopics.map((topic) => {
                  return (
                    <ButtonGroup
                      key={topic.value}
                      className={styles.button_group}
                    >
                      <button
                        className={styles.button_group_cancel}
                        onClick={() => handleRemoveTopic(topic)}
                      >
                        <X />
                      </button>
                      <button className={styles.button_group_name}>
                        {topic.name}
                      </button>
                    </ButtonGroup>
                  )
                })}
            </ListGroup>
            {(chooseGroup || chooseTopics.length !== 0) && (
              <button className={styles.button_clear} onClick={handleClearAll}>
                Xóa tất cả
              </button>
            )}
          </motion.div>
        </motion.div>
        <Container className="mt-5">
          <h1 className={styles.result_title}>
            <MenuButtonWide /> Khóa học tìm thấy
          </h1>
          <div className="d-flex flex-wrap justify-content-center">
            {courses?.map((course) => {
              return (
                <Card key={course._id} className={styles.card}>
                  <Card.Body className={styles.card_body}>
                    <Card.Text>
                      <i
                        className={`${styles.card_icon} ${course.icon} colored`}
                      />
                    </Card.Text>
                    <Card.Title className="mb-4">
                      {course.name.toUpperCase()}
                    </Card.Title>
                    <Card.Text>
                      <Link href={`/khoahoc/${course.slug}`}>
                        <a className={styles.card_button}>Học ngay</a>
                      </Link>
                    </Card.Text>
                  </Card.Body>
                </Card>
              )
            })}
          </div>
        </Container>
      </Fragment>
    </SearchLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { q, group, topics } = context.query
  const res = await courseApi.searchCourse(
    `/api/search/search?q=${q}&group=${group}&topics=${topics}`
  )
  return {
    props: {
      courses: res.data,
    },
  }
}

export default SearchID
