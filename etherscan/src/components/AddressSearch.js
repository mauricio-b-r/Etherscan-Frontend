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

function AddressSearch(props) {
  const model_ref = React.useRef("model");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [addressInfo, setAddressInfo] = React.useState([]);
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
      const params = { address_no: debouncedSearchTerm };
      axios
        .get("blocks/address", { params })
        .then((response) => {
          const address_data = response.data;
          setAddressInfo(address_data);
          setLoading(false);
        })
        .catch((error) => {
          setAddressInfo([]);
        })
        .finally(() => setLoading(false));
    } else {
      setAddressInfo([]);
    }
  }, [debouncedSearchTerm]);

  return (
    <div>
      <input
        placeholder="Show Address Transactions"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading && <CircularProgress color="secondary" />}

      <List component="nav">
        {addressInfo.map((transaction, index) => (
          <React.Fragment key={index}>
            <ListItem
              button
              onClick={() => {
                setFetchedTransaction(transaction);
                handleOpen();
              }}
            >
              <ListItemText primary={transaction["hash"]} />
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
        <TransactionModal ref={model_ref} transaction={fetchedTransaction} />
      </Modal>
    </div>
  );
}

export default AddressSearch;
