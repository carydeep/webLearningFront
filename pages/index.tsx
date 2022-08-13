import React, { Fragment, ReactElement } from "react";
import Head from "next/head";
import HomeLayout from "../components/Layouts/homeLayout";
import { Card, Container } from "react-bootstrap";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Lottie from "react-lottie";
import { Book, Bug, Google } from "react-bootstrap-icons";
import { motion, useAnimation } from "framer-motion";
import { InView } from "react-intersection-observer";
import { bloggingOptions, quizzOptions } from "../lotties";
import { appearAndmoveDown, scaleToBigger, toTheRight } from "../animation";

const Home = () => {
  const animation = useAnimation();
  const animation1 = useAnimation();
  const handInView = (inView: boolean) => {
    if (inView) {
      animation.start("visible");
    }
  };
  const handInView1 = (inView: boolean) => {
    if (inView) {
      animation1.start("visible");
    }
  };
  // const dispatch = useAppDispatch();
  // const user_is_authenticated = useAppSelector(
  //   (state) => state.auth.is_authenticated
  // );
  // React.useEffect(() => {
  //   const local_token = localStorage.getItem("key");
  //   const token = local_token == null ? "" : local_token;
  //   dispatch(fetch_user(token))
  //     .unwrap()
  //     .then((res) => console.log("res", res))
  //     .catch((err) => console.log("err", err));
  // }, [dispatch]);

  // const handleLogout = () => {
  //   const token = localStorage.getItem("key");
  //   if (token !== null) {
  //     logout(token).then(() => {
  //       localStorage.removeItem("key");
  //       dispatch(set_not_authenticated());
  //     });
  //   }
  // };

  return (
      <Fragment>
        <Head>
          <title>Learing Education</title>
          <meta name="description" content="Web học lập trình online TD4" />
          <link rel="icon" href="/favicon.ico" />
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.14.0/devicon.min.css"
          ></link>
        </Head>
        <Container>
          <Container className={styles.section}>
            <div className={`row ${styles.container}`}>
              <div className={`col-12 col-md-6 ${styles.content}`}>
                <motion.h1
                  className={styles.title}
                  variants={appearAndmoveDown}
                  initial="hidden"
                  animate="visible"
                  transition={{ type: "spring" }}
                >
                  Nơi học những điều mới mẻ
                </motion.h1>
                <motion.p
                  className={styles.text}
                  variants={appearAndmoveDown}
                  initial="hidden"
                  animate="visible"
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  Nơi học lập trình
                </motion.p>
                <motion.button
                  className={styles.button}
                  variants={appearAndmoveDown}
                  initial="hidden"
                  animate="visible"
                  transition={{ type: "spring", delay: 0.4 }}
                >
                  <Link href="/search">
                    <a className={styles.link}>Khám Phá</a>
                  </Link>
                </motion.button>
              </div>
              <motion.div
                className="col-12 col-md-6"
                variants={scaleToBigger}
                initial="hidden"
                animate="visible"
              >
                <Lottie options={bloggingOptions} height={400} width={400} />
              </motion.div>
            </div>
          </Container>
          <InView
            as="div"
            onChange={(inView) => {
              handInView(inView);
            }}
            threshold={0.4}
          >
            <Container className={styles.tutorial}>
              <motion.h1
                variants={appearAndmoveDown}
                initial="hidden"
                animate={animation}
                transition={{ type: "spring" }}
              >
                Các bước học code hiệu quả
              </motion.h1>
              <motion.p
                variants={appearAndmoveDown}
                initial="hidden"
                animate={animation}
                transition={{ type: "spring", delay: 0.2 }}
              >
                Theo khuyến khích của nhóm chúng tôi
              </motion.p>
              <div className={`row justify-content-around`}>
                <motion.div
                  className="col d-flex justify-content-center"
                  variants={toTheRight}
                  initial="hidden"
                  animate={animation}
                  transition={{ type: "spring" }}
                >
                  <Card className={styles.card}>
                    <Card.Body className={styles.card_body}>
                      <Card.Text>
                        <Book
                          className={`${styles.card_icon} ${styles.book}`}
                        />
                      </Card.Text>
                      <Card.Title>Học</Card.Title>
                      <Card.Text>
                        {"Học để nắm vững những kiến thức cần thiết"}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </motion.div>
                <motion.div
                  className="col d-flex justify-content-center"
                  variants={toTheRight}
                  initial="hidden"
                  animate={animation}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  <Card className={styles.card}>
                    <Card.Body className={styles.card_body}>
                      <Card.Text>
                        <Google
                          className={`${styles.card_icon} ${styles.google}`}
                        />
                      </Card.Text>
                      <Card.Title>Google</Card.Title>
                      <Card.Text>
                        {
                          "Tự giải quyết những vấn đề bằng cách google, biết cách google là kỹ năng mạnh mẽ"
                        }
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </motion.div>
                <motion.div
                  className="col d-flex justify-content-center"
                  variants={toTheRight}
                  initial="hidden"
                  animate={animation}
                  transition={{ type: "spring", delay: 0.4 }}
                >
                  <Card className={styles.card}>
                    <Card.Body className={styles.card_body}>
                      <Card.Text>
                        <Bug className={`${styles.card_icon} ${styles.bug}`} />
                      </Card.Text>
                      <Card.Title>Sửa lỗi</Card.Title>
                      <Card.Text>
                        {
                          "Tự giải quyết, xử lý bugs, giúp trở thành lập trình viên giỏi"
                        }
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </motion.div>
              </div>
            </Container>
          </InView>
          <InView
            as="div"
            onChange={(inView) => {
              handInView1(inView);
            }}
            threshold={0.2}
          >
            <Container className={styles.section}>
              <div className={`row mt-5 ${styles.container}`}>
                <motion.div
                  className="col"
                  variants={scaleToBigger}
                  initial="hidden"
                  animate={animation1}
                >
                  <Lottie
                    options={quizzOptions}
                    height={400}
                    width={400}
                  ></Lottie>
                </motion.div>
                <div className={`col ${styles.content}`}>
                  <motion.h1
                    className={styles.title}
                    variants={appearAndmoveDown}
                    initial="hidden"
                    animate={animation1}
                    transition={{ type: "spring", delay: 0.4 }}
                  >
                    Ôn lại kiến thức cùng những câu hỏi thú vị
                  </motion.h1>
                  <motion.p
                    className={styles.text}
                    variants={appearAndmoveDown}
                    initial="hidden"
                    animate={animation1}
                    transition={{ type: "spring", delay: 0.6 }}
                  >
                    Tự kiểm tra kiến thức của mình để củng cố kỹ năng
                  </motion.p>
                  <motion.button
                    className={styles.button}
                    variants={appearAndmoveDown}
                    initial="hidden"
                    animate={animation1}
                    transition={{ type: "spring", delay: 0.8 }}
                  >
                    <Link href="/baitap">
                      <a className={styles.link}>Ôn Tập</a>
                    </Link>
                  </motion.button>
                </div>
              </div>
            </Container>
          </InView>
        </Container>
      </Fragment>
  );
};

// export const getStaticProps: GetStaticProps = async () => {
//   const response = await axios.get('http://nginx/api/course/');
//   const data = response.data;
//   return {
//     props: { data },
//   };
// };

export default Home;

Home.getLayout = function getLayout(page:ReactElement){
  return(
    <HomeLayout>
      {page}
    </HomeLayout>
  )
} 
