import Head from "next/head";
import styles from "../styles/Home.module.css";
import api from "../lib/service";
import { useEffect, useRef, useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Link from "next/link";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import { updatePage } from "../store/pageSlice";

const pageSize = 10;

const groupByToArray = (data: any, key: string, selectKey: string) => {
  const tmp = data.reduce(function (prev: any, cur: any) {
    (prev[cur[key]] = prev[cur[key]] || []).push(cur[selectKey]);
    return prev;
  }, {});
  const result = [];
  for (let tmpKey in tmp) {
    const obj: any = {};
    obj[key] = tmpKey;
    obj[selectKey] = tmp[tmpKey].join(",");
    result.push(obj);
  }
  return result;
};

export async function getStaticProps() {
  const categories = (await api.getCategories()).data;
  const defaultPrimaryCateId = categories[0].primaryCategoryId;
  const infos = (await api.getInfos(defaultPrimaryCateId)).data;
  const defaultInfoId = infos[0].categoryId;
  const labels = groupByToArray(
    (await api.getLabels(defaultPrimaryCateId, defaultInfoId)).data,
    "labelName",
    "assembleId"
  );

  const [items, totalCount] = (
    await api.getPage({
      primaryCategoryId: categories[0].primaryCategoryId,
      page: 1,
      size: pageSize,
      // categoryId: infos[0].categoryId,
    })
  ).data;

  return {
    props: {
      categories,
      infos,
      labels,
      items,
      totalCount,
    },
  };
}

const Home = ({ categories, infos, labels, items, totalCount }: any) => {
  const pageInfo = useSelector((state) => state);
  const dispatch = useDispatch();

  const [cateValue, setCateValue] = useState(categories[0].primaryCategoryId);
  const [infoValue, setInfoValue] = useState();
  const [labelValue, setLabelValue] = useState(); //labels[0].assembleId
  const [subjects, setSubjects] = useState([]);
  const [categoryInfos, setCategoryInfos] = useState(infos);
  const [labelInfos, setLabelInfos] = useState(labels);
  const [page, setPage] = useState(pageInfo.page.page);
  const [totalPageCount, setTotalPageCount] = useState(
    Math.ceil(totalCount / pageSize)
  );

  const mounting = useRef(true);

  useEffect(() => {
    // if (mounting.current) {
    //   console.log("init");
    //   mounting.current = false;
    //   return;
    // }
    const params = {
      primaryCategoryId: cateValue,
      categoryId: infoValue,
      assembleIds: labelValue,
      page: pageInfo.page.page,
      size: pageSize,
    };
    api.getPage(params).then((resp) => {
      const [items, totalCount] = resp.data;
      setSubjects(items);
      setTotalPageCount(Math.ceil(totalCount / pageSize));
    });
  }, [cateValue, infoValue, labelValue, pageInfo]);

  const handleCategoryChange = async (event: any) => {
    const newVal = event.target.value;
    setCateValue(newVal);
    setPage(1);
    const infos = (await api.getInfos(newVal)).data;
    setCategoryInfos(infos);
    const newInfoVal = infos[0].categoryId;
    setInfoValue(undefined);
    setLabelValue(undefined);
  };

  const handleCategoryInfoChange = async (event: any) => {
    const newVal = event.target.value;
    setInfoValue(newVal);
    setPage(1);
    const labels = (await api.getLabels(cateValue, newVal)).data;
    setLabelValue(undefined);
    setLabelInfos(groupByToArray(labels, "labelName", "assembleId"));
  };

  const handleLabelInfoChange = (event: any) => {
    setLabelValue(event.target.value);
  };

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
    dispatch(updatePage(newPage));
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
          <div>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="cate-select-label">类别</InputLabel>
              <Select
                labelId="cate-select-label"
                id="cate-select"
                value={cateValue}
                label="类别"
                autoWidth
                onChange={handleCategoryChange}
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
            <FormControl sx={{ m: 1, minWidth: 150 }}>
              <InputLabel id="info-select-label">子类别</InputLabel>
              <Select
                labelId="info-select-label"
                id="info-select"
                value={infoValue}
                label="子类别"
                autoWidth
                onChange={handleCategoryInfoChange}
              >
                <MenuItem key="blank" value={undefined}>
                  全部
                </MenuItem>
                {categoryInfos.map((item: any) => (
                  <MenuItem key={item.categoryId} value={item.categoryId}>
                    {item.categoryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 150 }}>
              <InputLabel id="label-select-label">标签</InputLabel>
              <Select
                labelId="label-select-label"
                id="label-select"
                value={labelValue}
                label="标签"
                autoWidth
                onChange={handleLabelInfoChange}
              >
                <MenuItem key="blank" value={undefined}>
                  全部
                </MenuItem>
                {labelInfos.map((item: any) => (
                  <MenuItem key={item.assembleId} value={item.assembleId}>
                    {item.labelName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    {/* <TableCell align="left">ID</TableCell> */}
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
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.subjectName}
                        </TableCell>
                        <TableCell align="left">
                          {row.labelNames.join("、")}
                        </TableCell>
                        <TableCell align="left">{row.difficulty}</TableCell>
                      </TableRow>
                    </Link>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {/* <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              count={totalPageCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            /> */}
            <Typography>
              Page: {page}
            </Typography>
            <Pagination
              count={totalPageCount}
              page={page}
              defaultPage={6}
              siblingCount={0}
              onChange={handleChangePage}
            />
          </div>
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
