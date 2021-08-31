import * as React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "../utils/axios";
import { useDebounce } from "../utils/hooks";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Modal from "@material-ui/core/Modal";

import TransactionModal from "./TransactionModal";

function BlockTransactionsData(props) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [blockInfo, setBlockInfo] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [open, setOpen] = React.useState(false);
  const [fetchedTransaction, setFetchedTransaction] = React.useState(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    if (debouncedSearchTerm) {
      setLoading(true);
      const params = { block_no: debouncedSearchTerm };
      axios
        .get("blocks/detail", { params })
        .then((response) => {
          const blocks_data = response.data;
          setBlockInfo(blocks_data);
          setLoading(false);
        })
        .catch((error) => {
          setBlockInfo({});
        })
        .finally(() => setLoading(false));
    } else {
      setBlockInfo({});
    }
  }, [debouncedSearchTerm]);

  return (
    <div>
      <input
        placeholder="Show Block Transactions"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading && <CircularProgress color="secondary" />}

      <List component="nav">
        {blockInfo["transactions"] &&
          blockInfo["transactions"].map((transaction, index) => (
            <React.Fragment key={index}>
              <ListItem
                button
                onClick={() => {
                  setFetchedTransaction(transaction);
                  handleOpen();
                }}
              >
                <ListItemText primary={transaction} />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
      </List>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="transaction-data-modal"
      >
        <TransactionModal transaction={fetchedTransaction} />
      </Modal>
    </div>
  );
}

export default BlockTransactionsData;
