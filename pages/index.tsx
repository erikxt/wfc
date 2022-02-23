import Head from "next/head";
import styles from "../styles/Home.module.css";
import api from "../lib/service";
import { useState } from "react";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Link from "next/link";

const pageSize = 5;

export async function getStaticProps() {
  const res = await api.getCategories();
  const categories = res.data;

  const resp = await api.getPage({
    primaryCategoryId: categories[0].primaryCategoryId,
  });
  const [items, count] = resp.data;

  return {
    props: {
      categories,
      items,
      count,
    },
  };
}

const Home = ({ categories, items, count }: any) => {
  // const cateOptions = categories.map((option) => option.categoryName);
  const [cateValue, setCateValue] = useState(categories[0].primaryCategoryId);
  const [subjects, setSubjects] = useState(items);
  const [totalCount, setTotalCount] = useState(Math.ceil(count / pageSize));

  const refreshPage = () => {
    const params = {
      primaryCategoryId: cateValue,
    };
    console.log(params);
    // const resp = await api.getPage(params);
    // const [items, count] = resp.data;
    // setSubjects(items);
    // setTotalCount(Math.ceil(count / pageSize));
  };

  const handleChange = (event: any) => {
    setCateValue(event.target.value);
    refreshPage();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Wuhan Fried Chicken</title>
        <meta name="description" content="cook for dinner" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to WFC</h1>
        <div>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="cate-select-label">类别</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={cateValue}
              label="类别"
              onChange={handleChange}
            >
              {categories.map((item: any) => (
                <MenuItem
                  key={item.primaryCategoryId}
                  value={item.primaryCategoryId}
                >
                  {item.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="info-select-label">子类别</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={cateValue}
              label="子类别"
              onChange={handleChange}
            >
              {categories.map((item: any) => (
                <MenuItem
                  key={item.primaryCategoryId}
                  value={item.primaryCategoryId}
                >
                  {item.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">ID</TableCell>
                  <TableCell align="left">标题</TableCell>
                  <TableCell align="left">标签</TableCell>
                  <TableCell align="left">难度</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subjects.map((row: any) => (
                  <Link key={row.id} href={`/subject/${row.id}`} passHref>
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell align="left">{row.subjectName}</TableCell>
                      <TableCell align="left">{row.labelNames}</TableCell>
                      <TableCell align="left">{row.difficulty}</TableCell>
                    </TableRow>
                  </Link>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Pagination count={totalCount} variant="outlined" shape="rounded" />
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/erikxt"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className="powerBy">
            <strong>Erik</strong>
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
