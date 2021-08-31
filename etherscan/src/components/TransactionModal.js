import * as React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "../utils/axios";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 500,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    overflowWrap: "break-word",
    height: 500,
    overflow: "auto",
  },
}));

function TransactionModal({ transaction }) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [transactionInfo, setTransactionInfo] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (typeof transaction === "string") {
      setLoading(true);
      const params = { tx_hash: transaction };
      axios
        .get("blocks/transaction-hash", { params })
        .then((response) => {
          const transaction_data = response.data;
          setTransactionInfo(transaction_data);
          setLoading(false);
        })
        .catch((error) => {
          setTransactionInfo({});
        })
        .finally(() => setLoading(false));
    } else {
      setTransactionInfo(transaction);
    }
  }, []);
  const body = (
    <div style={modalStyle} className={classes.paper}>
      {loading && <CircularProgress color="secondary" />}
      <List>
        {Object.entries(transactionInfo).map((transaction, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemText
                primary={transaction[0]}
                secondary={transaction[1]}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );

  return <div>{body}</div>;
}

export default TransactionModal;
