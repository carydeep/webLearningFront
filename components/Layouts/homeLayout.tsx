import React, { ReactElement, useEffect, useState } from "react"
import {
  Container,
  InputGroup,
  Nav,
  Navbar,
  NavDropdown,
  NavItem,
} from "react-bootstrap"
import {
  Discord,
  Facebook,
  Instagram,
  MoonStars,
  Search,
  Sun,
} from "react-bootstrap-icons"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { useRouter } from "next/router"
import styles from "../../styles/HomeLayout.module.css"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { logoutSuccess } from "../../redux/slices/authSlice"
import authApi from "../../pages/api/authApi"
import courseApi from "../../pages/api/courseApi"
import { Course } from "../../models/course"
import exerciseApi from "../../pages/api/exerciseApi"
import { Exercise } from "../../models/exercise"
import { resetCourse } from "../../redux/slices/courseSlice"
import { resetExercise } from "../../redux/slices/exerciseSlice"
import { getCookie } from "cookies-next"

const navBarVariants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
}

const variants = {
  hidden: { opacity: 0, x: -200, y: 0 },
  enter: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      type: "linear",
    },
  },
  exit: { opacity: 0, x: 0, y: -100 },
}

export default function HomeLayout({ children }: { children: ReactElement }) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.authReducer.currentUser)
  const [courses, setCourses] = useState<Array<Course>>()
  const [exercise, setExercise] = useState<Array<Exercise>>()
  const [valueSearch, setValueSearch] = useState<string>("")
  useEffect(() => {
    const fetchCourse = async () => {
      const res = await courseApi.getCourse()
      setCourses(res.data)
    }
    const fetchExercise = async () => {
      const res = await exerciseApi.getExercise()
      setExercise(res.data)
    }
    fetchCourse()
    fetchExercise()
  }, [])
  const handleLogout = async () => {
    await authApi.logout()
    localStorage.removeItem("refreshToken")
    dispatch(logoutSuccess())
    dispatch(resetCourse())
    dispatch(resetExercise())
  }
  const checkEnter = (e: any) => {
    if (e.key === "Enter" && e.target.value !== "") {
      const url = `/search/search?q=${e.target.value}&group=&topics=`
      router.push(url)
    }
  }

  return (
    <motion.main
      variants={variants} // Pass the variant object into Framer Motion
      initial="hidden" // Set the initial state to variants.hidden
      animate="enter" // Animated state to variants.enter
      exit="exit" // Exit state (used later) to variants.exit
    >
      <motion.div
        className={`${styles.container} container`}
        variants={navBarVariants}
        initial="hidden"
        animate="visible"
        transition={{ type: "spring" }}
      >
        <Navbar className={styles.text} expand="lg">
          <Container>
            <Navbar.Brand>
              <Link href="/" passHref>
                <div className={styles.brand}>
                  <h3 className={styles.brand_first}>TD4</h3>
                  <h3 className={styles.brand_last}>School</h3>
                </div>
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse
              id="responsive-navbar-nav"
              className="justify-content-end align-self-center"
            >
              <Nav>
                <Navbar.Text className={styles.theme}>
                  {theme === "dark" ? (
                    <MoonStars onClick={() => setTheme("light")} />
                  ) : (
                    <Sun onClick={() => setTheme("dark")} />
                  )}
                </Navbar.Text>

                <NavDropdown
                  title={<span className={styles.text}>Khóa học</span>}
                  id="basic-nav-dropdown"
                  className="ms-3"
                >
                  {courses &&
                    courses.map(({ name, slug }) => {
                      return (
                        <NavDropdown.Item
                          key={slug}
                          href={`/khoahoc/${slug}`}
                          className={styles.link}
                        >
                          {name}
                        </NavDropdown.Item>
                      )
                    })}
                </NavDropdown>
                <NavDropdown
                  title={<span className={styles.text}>Luyện tập</span>}
                  id="basic-nav-dropdown"
                  className="ms-3"
                >
                  {exercise?.map(({ _id, name }) => {
                    return (
                      <NavDropdown.Item
                        href={`/baitap/${_id}`}
                        key={_id}
                        className={styles.link}
                      >
                        {name}
                      </NavDropdown.Item>
                    )
                  })}
                </NavDropdown>
                <InputGroup size="sm" className={styles.input_group}>
                  <InputGroup.Text className={styles.input_icon}>
                    <Link href={`/search/id?terms=${valueSearch}`}>
                      <Search />
                    </Link>
                  </InputGroup.Text>
                  <input
                    type="search"
                    placeholder="Tìm kiếm ..."
                    className={styles.input_text}
                    aria-label="Search"
                    list="courseName"
                    onChange={(e) => setValueSearch(e.currentTarget.value)}
                    onKeyPress={checkEnter}
                  />
                  <datalist id="courseName">
                    {courses &&
                      courses.map(({ name, slug }) => {
                        return <option key={slug} value={name}></option>
                      })}
                  </datalist>
                </InputGroup>
                {user ? (
                  <NavDropdown
                    title={<span className={styles.text}>{user.lastname}</span>}
                    id="user"
                  >
                    <NavDropdown.Item onClick={() => handleLogout()}>
                      Đăng xuất
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/user">
                      Bảng điều khiển
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <Link href="/login">
                    <a className={styles.login}> Đăng nhập </a>
                  </Link>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </motion.div>
      {children}
      <Container className={styles.footer}>
        <hr />
        <h1>Liên hệ với chúng tôi</h1>
        <div className="d-flex mb-4">
          <a className={styles.contact}>
            <Facebook />
          </a>
          <a className={styles.contact}>
            <Instagram />
          </a>
          <a className={styles.contact}>
            <Discord />
          </a>
        </div>
        <div className="d-flex">
          <p>Info</p>
          <p className="ms-3">Support</p>
          <p className="ms-3">Marketing</p>
        </div>
        <div className="d-flex">
          <p>Điều khoản sử dụng</p>
          <p className="ms-3">Chính sách bảo mật</p>
        </div>
        <p className="text-secondary">@ copyright đề án tốt nghiệp 4</p>
      </Container>
    </motion.main>
  )
}
