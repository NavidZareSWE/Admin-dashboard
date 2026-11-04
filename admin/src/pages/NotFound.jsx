import { Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import PageContainer from "../components/common/PageContainer";
import Header from "../components/common/Header";
import StatusMessage from "../components/common/StatusMessage";

const NotFound = () => (
  <PageContainer>
    <Header title="Page not found" />
    <StatusMessage
      title="This page does not exist"
      message="The link may be out of date, or the address may have a typo."
      minHeight={360}
      action={
        <Button
          component={RouterLink}
          to="/dashboard"
          variant="contained"
          color="secondary"
        >
          Back to dashboard
        </Button>
      }
    />
  </PageContainer>
);

export default NotFound;
