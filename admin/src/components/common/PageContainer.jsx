import { Box } from "@mui/material";

/** Shared page gutter: tighter on phones so content is not squeezed. */
const pageGutter = {
  px: { xs: "1rem", sm: "1.5rem", md: "2.5rem" },
  pt: { xs: "1rem", md: "1.5rem" },
  pb: { xs: "2rem", md: "2.5rem" },
};

const PageContainer = ({ children, sx, ...rest }) => (
  <Box component="section" sx={{ ...pageGutter, ...sx }} {...rest}>
    {children}
  </Box>
);

export default PageContainer;
