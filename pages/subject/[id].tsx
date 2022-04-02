import api from "../../lib/service";
import Head from "next/head";
import styles from "../../styles/Subject.module.css";
import Custom404 from "../404";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import {
  KeyboardEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { useState } from "react";

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
  const r = await api.getAllSubjectIds();
  if (res.status == 404) {
    return {
      props: {},
    };
  }
  // console.log("param", params.id);
  const ids = r.data as number[];
  const index = ids.indexOf(params.id);
  const subject = res.data;
  const prev = ids[index - 1];
  const next = ids[(index + 1) % ids.length];
  // console.log("-------", prev, next);
  return {
    props: {
      subject,
      prev,
      next,
    },
  };
}

export default function Subject({ subject, prev, next }: any) {
  const router = useRouter();
  const prevRef = useRef();
  const nextRef = useRef();

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      switch (event.key) {
        case "ArrowLeft":
          router.push("/subject/" + prevRef.current);
          break;
        case "ArrowRight":
          router.push("/subject/" + nextRef.current);
          break;
        default:
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    prevRef.current = prev;
    nextRef.current = next;
  }, [prev, next]);

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
              router.push("/subject/" + prev);
            }}
          >
            Prev
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              router.push("/");
            }}
          >
            Home
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              router.push("/subject/" + next);
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
