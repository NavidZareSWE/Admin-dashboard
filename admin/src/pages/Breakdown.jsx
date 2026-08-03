import { Box } from "@mui/material";
import Header from "../components/common/Header";
import BreakdownChart from "../components/module/BreakdownChart";

const Breakdown = () => {
  return (
    <Box sx={{ m: "1.5rem 2.5rem" }}>
      <Header title="BREAKDOWN" subtitle="Breakdown of Sales By Category" />

      <Box sx={{ mt: "40px", height: "75vh" }}>
        <BreakdownChart />
      </Box>
    </Box>
  );
};

export default Breakdown;
