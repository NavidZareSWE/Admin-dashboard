import { Box, Button, Typography, useTheme } from "@mui/material";
import {
  ErrorOutlineRounded,
  InboxOutlined,
  RefreshRounded,
} from "@mui/icons-material";

/**
 * Centered error or empty state. Pass `onRetry` (RTK Query's `refetch`) to
 * offer a retry button instead of telling people to reload the page.
 */
const StatusMessage = ({
  variant = "empty",
  title,
  message,
  onRetry,
  action,
  minHeight = 240,
}) => {
  const theme = useTheme();
  const isError = variant === "error";
  const Icon = isError ? ErrorOutlineRounded : InboxOutlined;

  return (
    <Box
      role={isError ? "alert" : "status"}
      sx={{
        minHeight,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: "0.5rem",
        p: "1.5rem",
      }}
    >
      <Icon
        sx={{
          fontSize: 40,
          color: isError
            ? theme.palette.error.main
            : theme.palette.secondary[300],
          opacity: isError ? 1 : 0.7,
        }}
      />
      <Typography
        variant="h5"
        component="p"
        sx={{ fontWeight: 600, color: theme.palette.secondary[100] }}
      >
        {title ?? (isError ? "Something went wrong" : "Nothing to show")}
      </Typography>
      {message && (
        <Typography sx={{ maxWidth: 420, color: theme.palette.secondary[300] }}>
          {message}
        </Typography>
      )}
      {(onRetry || action) && (
        <Box sx={{ mt: "0.75rem", display: "flex", gap: "0.5rem" }}>
          {onRetry && (
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<RefreshRounded />}
              onClick={onRetry}
            >
              Try again
            </Button>
          )}
          {action}
        </Box>
      )}
    </Box>
  );
};

export default StatusMessage;
