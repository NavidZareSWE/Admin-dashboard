import Header from "../components/common/Header";
import PageContainer from "../components/common/PageContainer";
import Panel from "../components/common/Panel";
import BreakdownChart from "../components/module/BreakdownChart";

const Breakdown = () => (
  <PageContainer>
    <Header
      title="Breakdown"
      subtitle="How this year's revenue splits across product categories"
    />
    <Panel
      sx={{ mt: "24px", minHeight: { xs: 560, md: "calc(100vh - 230px)" } }}
    >
      <BreakdownChart />
    </Panel>
  </PageContainer>
);

export default Breakdown;
