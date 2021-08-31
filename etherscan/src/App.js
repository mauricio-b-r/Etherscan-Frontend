import "./App.css";
import * as React from "react";

import { Box, Tab, Tabs } from "@material-ui/core";

import AddressSearch from "./components/AddressSearch";
import BlockchainData from "./components/BlockchainData";
import BlockTransactionsData from "./components/BlockTransactionsData";
import TabPanel from "./components/TabPanel";

export default function App() {
  const [value, setValue] = React.useState(0);

  const handleChange = (evt, new_value) => {
    setValue(new_value);
  };
  return (
    <div className="App">
      <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
          centered
        >
          <Tab label="Blockchain data" id="blockchain-tab-1" />
          <Tab label="Search transactions by address" id="address-tab-2" />
          <Tab label="Block Transactions" id="block-transactions-tab-2" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <BlockchainData />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AddressSearch />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <BlockTransactionsData />
      </TabPanel>
    </div>
  );
}
