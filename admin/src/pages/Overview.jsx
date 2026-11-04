import { useState } from "react";
import Header from "../components/common/Header";
import PageContainer from "../components/common/PageContainer";
import Panel from "../components/common/Panel";
import OverviewChart from "../components/module/OverviewChart";
import ViewToggle from "../components/module/ViewToggle";

const Overview = () => {
  const [view, setView] = useState("sales");

  return (
    <PageContainer>
      <Header
        title="Overview"
        subtitle="Cumulative revenue and units across the year"
        actions={<ViewToggle value={view} onChange={setView} />}
      />
      <Panel sx={{ mt: "24px", height: "calc(100vh - 230px)", minHeight: 460 }}>
        <OverviewChart view={view} />
      </Panel>
    </PageContainer>
  );
};

export default Overview;
