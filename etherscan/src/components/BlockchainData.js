import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "../utils/axios";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function BlockchainData(props) {
  const firstUpdate = React.useRef(true);

  const [loading, setLoading] = React.useState(false);
  const [headers, setHeaders] = React.useState([]);
  const [blocksInfo, setBlocksInfo] = React.useState([]);

  const classes = useStyles();

  React.useEffect(() => {
    let mounted = true;
    let isMounted = true;
    if (firstUpdate.current) {
      firstUpdate.current = false;
      setLoading(true);
      axios
        .get("blocks")
        .then((response) => {
          const blocks_data = response.data;
          setBlocksInfo(blocks_data);
        })
        .catch((error) => {
          setBlocksInfo([]);
        })
        .finally(() => setLoading(false));
    }
    const intervalId = setInterval(() => {
      axios
        .get("blocks")
        .then((response) => {
          setLoading(true);
          const blocks_data = response.data;
          setBlocksInfo(blocks_data);
          setLoading(false);
        })
        .catch((error) => {
          setBlocksInfo([]);
        });
    }, 10000);
    return () => {
      clearInterval(intervalId);

      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    const keys = blocksInfo.length ? Object.keys(blocksInfo[0]) : [];
    const normalizedHeaders = keys.map((key) => {
      let text = key.replace(/([a-z])([A-Z])/g, "$1 $2");
      text = text[0].toUpperCase() + text.substring(1);
      return {
        value: key,
        text,
      };
    });
    setHeaders(normalizedHeaders);
  }, [blocksInfo]);

  return (
    <>
      {loading ? (
        <CircularProgress color="secondary" />
      ) : (
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                {headers.map((header, index) => (
                  <TableCell key={index}>{header.text}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {blocksInfo.map((row, index) => (
                <TableRow key={index}>
                  {Object.entries(row).map((info, index) => (
                    <TableCell key={index}>{info[1]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}

export default BlockchainData;
