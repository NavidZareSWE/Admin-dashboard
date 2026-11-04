import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { CloseRounded } from "@mui/icons-material";
import { navItems } from "../../config/navigation";

const isMac =
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

const Kbd = ({ children }) => {
  const theme = useTheme();
  return (
    <Box
      component="kbd"
      sx={{
        display: "inline-block",
        minWidth: 22,
        px: "6px",
        py: "1px",
        textAlign: "center",
        fontFamily: "inherit",
        fontSize: "0.75rem",
        fontWeight: 600,
        borderRadius: "6px",
        border: `1px solid ${theme.palette.divider}`,
        borderBottomWidth: 2,
        color: theme.palette.secondary[100],
      }}
    >
      {children}
    </Box>
  );
};

const Row = ({ keys, label }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        py: "6px",
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography
        sx={{ fontSize: "0.88rem", color: theme.palette.secondary[100] }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          flexShrink: 0,
        }}
      >
        {keys.map((key, index) => (
          <Box key={index} component="span" sx={{ display: "contents" }}>
            {index > 0 && (
              <Typography
                component="span"
                sx={{
                  fontSize: "0.72rem",
                  color: theme.palette.secondary[300],
                }}
              >
                then
              </Typography>
            )}
            <Kbd>{key}</Kbd>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const ShortcutsDialog = ({ open, onClose }) => {
  const theme = useTheme();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="shortcuts-title"
    >
      <DialogTitle
        id="shortcuts-title"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontWeight: 700,
        }}
      >
        Keyboard shortcuts
        <IconButton onClick={onClose} aria-label="Close keyboard shortcuts">
          <CloseRounded />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            columnGap: "2rem",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: theme.palette.secondary[300],
                mb: "4px",
              }}
            >
              General
            </Typography>
            <Row keys={[isMac ? "⌘ K" : "Ctrl K"]} label="Search pages" />
            <Row keys={["/"]} label="Search pages" />
            <Row keys={["["]} label="Show or hide sidebar" />
            <Row keys={["?"]} label="This help" />
            <Row keys={["Esc"]} label="Close dialog or panel" />
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: theme.palette.secondary[300],
                mb: "4px",
                mt: { xs: "1rem", sm: 0 },
              }}
            >
              Go to
            </Typography>
            {navItems.map((item) => (
              <Row
                key={item.path}
                keys={["g", item.shortcut]}
                label={item.text}
              />
            ))}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ShortcutsDialog;
