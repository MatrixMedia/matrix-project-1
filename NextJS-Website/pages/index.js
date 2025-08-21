import Head from "next/head";
import styles from "../styles/Home.module.css";
import LandingHeader from "./LandingComponent/Header";
import LandingFooter from "./LandingComponent/Footer";
import LandingPosts from "./LandingComponent/Posts";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Sangarahi</title>
        <link rel="icon" href="https://sangaraahi.s3.ap-south-1.amazonaws.com/image%201%20%281%29.png" />
      </Head>
      <LandingHeader />
      <LandingPosts />
      <LandingFooter />
    </div>
  );
}
