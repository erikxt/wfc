import api from "../../lib/service";
import Head from "next/head";
import styles from "../../styles/Subject.module.css";
import Custom404 from "../404";
import { Button } from "@mui/material";
// import { useNavigate } from "react-router-dom";
import { useRouter } from "next/router";
import Link from "next/link";

// export async function getStaticPaths() {
//   const res = await api.getSubjectIds();
//   const data: any[] = res.data;
//   const paths = data.map((s) => ({
//     params: { id: s.id },
//   }));
//   return {
//     paths: paths,
//     fallback: "blocking",
//   };
// }

export async function getServerSideProps({ params }: any) {
  const res = await api.getSubject(params.id);
  if (res.status == 404) {
    return {
      props: {},
    };
  }
  const subject = res.data;
  return {
    props: {
      subject,
    },
  };
}

export default function Subject({ subject }: any) {
  const router = useRouter();
  // let navigate = useNavigate();
  if (subject === undefined) {
    return <Custom404 />;
  }

  return (
    <>
      <Head>
        <title>
          {subject.id}. {subject.subjectName}
        </title>
      </Head>
      <div className={styles.content}>
        <h2>{subject.subjectName}</h2>
        <div dangerouslySetInnerHTML={{ __html: subject.subjectAnswer }}></div>
        <div className={styles.labels}>
          Labels:{" "}
          {subject.labelNames.map((item: any) => (
            <span key={item} className={styles.label}>
              #{item}
            </span>
          ))}
        </div>
        <div className={styles.button}>
          <Button
            variant="contained"
            onClick={() => {
              router.push("/");
            }}
          >
            Home
          </Button>
        </div>
      </div>
    </>
  );
}
