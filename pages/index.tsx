import Head from "next/head";
import styles from "../styles/Home.module.css";
import api from "../lib/service";
import { useEffect, useState } from "react";
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
import {
  updateCate,
  updateInfo,
  updateInfos,
  updateLabel,
  updateLabels,
  updatePage,
} from "../store/pageSlice";
import { RootState } from "../store/store";

const pageSize = 20;

const groupByToArray = (data: any, key: string, selectKey: string) => {
  if (data == undefined || data.length == 0) {
    return [];
  }
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

  // const [items, totalCount] = (
  //   await api.getPage({
  //     primaryCategoryId: categories[0].primaryCategoryId,
  //     page: 1,
  //     size: pageSize,
  //     // categoryId: infos[0].categoryId,
  //   })
  // ).data;

  return {
    props: {
      categories,
      // infos,
      // labels,
      // items,
      // totalCount,
    },
  };
}

const Home = ({ categories }: any) => {
  const reduxState = useSelector((state: RootState) => state.pageInfo);
  const dispatch = useDispatch();
  if (reduxState && reduxState.cateId === 0) {
    dispatch(updateCate(categories[0].primaryCategoryId));
  }
  // const [cateValue, setCateValue] = useState(reduxState.cateId);
  // console.log(cateValue);
  const [subjects, setSubjects] = useState([]);
  const [page, setPage] = useState(reduxState.page);
  const [totalPageCount, setTotalPageCount] = useState(1);
  // Math.ceil(totalCount / pageSize)

  if (reduxState.infos.length == 0) {
    api.getInfos(reduxState.cateId).then((res) => {
      const infos = res.data;
      dispatch(updateInfos(infos));
    });
  }

  if (reduxState.infoId != 0 && reduxState.labels.length == 0) {
    api.getLabels(reduxState.cateId, reduxState.infoId).then((res) => {
      const labels = groupByToArray(res.data, "labelName", "assembleId");
      dispatch(updateLabels(labels));
    });
  }

  useEffect(() => {
    const params = {
      primaryCategoryId: reduxState.cateId,
      categoryId: reduxState.infoId != 0 ? reduxState.infoId : undefined,
      assembleIds:
        reduxState.assembleId != "0" ? reduxState.assembleId : undefined,
      page: reduxState.page,
      size: pageSize,
    };
    api.getPage(params).then((resp) => {
      const [items, totalCount] = resp.data;
      setSubjects(items);
      setTotalPageCount(Math.ceil(totalCount / pageSize));
    });
  }, [
    reduxState.page,
    reduxState.cateId,
    reduxState.infoId,
    reduxState.assembleId,
  ]);

  const handleCategoryChange = async (event: any) => {
    // console.log("3333");
    const newCate = event.target.value;
    // setCateValue(newCate);
    dispatch(updateCate(newCate));
    setPage(1);
    dispatch(updatePage(1));
    const infos = (await api.getInfos(newCate)).data;
    dispatch(updateInfo(0));
    dispatch(updateLabel("0"));
    dispatch(updateInfos(infos));
  };

  const handleCategoryInfoChange = async (event: any) => {
    // console.log("444444");
    const newInfoId = event.target.value;
    setPage(1);
    dispatch(updatePage(1));
    const labels = (await api.getLabels(reduxState.cateId, newInfoId)).data;
    dispatch(updateLabel("0"));
    dispatch(updateLabels(groupByToArray(labels, "labelName", "assembleId")));
    dispatch(updateInfo(newInfoId));
  };

  const handleLabelInfoChange = (event: any) => {
    const newAssembleId = event.target.value;
    dispatch(updateLabel(newAssembleId));
    dispatch(updatePage(1));
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
                value={reduxState.cateId}
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
                value={reduxState.infoId}
                label="子类别"
                autoWidth
                onChange={handleCategoryInfoChange}
              >
                <MenuItem key="blank1" value={0}>
                  全部
                </MenuItem>
                {reduxState.infos.map((item: any) => (
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
                value={reduxState.assembleId}
                label="标签"
                autoWidth
                onChange={handleLabelInfoChange}
              >
                <MenuItem key="blank2" value={"0"}>
                  全部
                </MenuItem>
                {reduxState.labels.map((item: any) => {
                  return (
                    <MenuItem key={item.assembleId} value={item.assembleId}>
                      {item.labelName}
                    </MenuItem>
                  );
                })}
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
            <Typography>Page: {page}</Typography>
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
