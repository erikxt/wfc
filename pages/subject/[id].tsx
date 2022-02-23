import api from "../../lib/service";
import Button from "@mui/material/Button";
import Head from "next/head";
import { Link } from "@mui/material";
import styles from "../../styles/Subject.module.css";

export async function getStaticPaths() {
  const res = await api.getSubjectIds();
  const data: any[] = res.data;
  const paths = data.map((s) => ({
    params: { id: s.id },
  }));
  return {
    paths: paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }: any) {
  const res = await api.getSubject(params.id);
  // console.log(res.status);
  const subject = res.data;
  // console.log(subject);
  return {
    props: {
      subject,
    },
  };
}

export default function Subject({ subject }: any) {
  const labels: JSX.Element[] = [];
  subject.labelNames.forEach((item: any) => {
    labels.push(<span key={item} className={styles.label}> #{item} </span>);
  });

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
        <div className={styles.labels}>Labels: {labels}</div>
        <div className={styles.home}>
          <Link href="/">
            <Button variant="contained">Home</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
