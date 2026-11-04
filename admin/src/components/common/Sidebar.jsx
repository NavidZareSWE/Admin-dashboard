import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { ChevronLeft, InsightsRounded } from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { navSections } from "../../config/navigation";
import profileImage from "../../assets/images/profile.jpeg";

/**
 * Desktop: a persistent drawer whose root width animates between 0 and
 * `drawerWidth`, so the page reflows instead of being covered.
 * Mobile: a temporary overlay drawer that closes after navigation.
 */
const Sidebar = ({ user, drawerWidth, isOpen, onClose, isDesktop }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accent = theme.palette.secondary[300];

  const transition = theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: isOpen
      ? theme.transitions.duration.enteringScreen
      : theme.transitions.duration.leavingScreen,
  });

  return (
    <Drawer
      component="nav"
      aria-label="Main navigation"
      variant={isDesktop ? "persistent" : "temporary"}
      anchor="left"
      open={isOpen}
      onClose={onClose}
      sx={{
        width: isDesktop ? (isOpen ? drawerWidth : 0) : undefined,
        flexShrink: 0,
        transition,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          color: theme.palette.secondary[200],
          backgroundColor: theme.palette.background.alt,
          borderRight: `1px solid ${
            isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"
          }`,
        },
      }}
    >
      {/* Brand */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.5rem",
          px: "1.25rem",
          py: "1.25rem",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
          <Box
            aria-hidden="true"
            sx={{
              width: 34,
              height: 34,
              borderRadius: "10px",
              display: "grid",
              placeItems: "center",
              backgroundColor: accent,
              color: theme.palette.getContrastText(accent),
            }}
          >
            <InsightsRounded fontSize="small" />
          </Box>
          <Typography
            variant="h4"
            component="p"
            sx={{
              fontWeight: 700,
              letterSpacing: "0.04em",
              color: theme.palette.secondary.main,
            }}
          >
            ECOMVISION
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          aria-label="Close navigation"
          size="small"
        >
          <ChevronLeft />
        </IconButton>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflowY: "auto", px: "0.75rem", pb: "1rem" }}>
        {navSections.map(({ title, items }) => (
          <List
            key={title ?? "general"}
            dense
            disablePadding
            subheader={
              title ? (
                <ListSubheader
                  disableSticky
                  sx={{
                    px: "0.75rem",
                    pt: "1.25rem",
                    pb: "0.25rem",
                    lineHeight: 1.5,
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    backgroundColor: "transparent",
                    color: theme.palette.secondary[300],
                    opacity: 0.8,
                  }}
                >
                  {title}
                </ListSubheader>
              ) : undefined
            }
          >
            {items.map(({ text, path, icon }) => (
              <ListItemButton
                key={path}
                component={NavLink}
                to={path}
                onClick={isDesktop ? undefined : onClose}
                sx={{
                  my: "2px",
                  px: "0.75rem",
                  py: "0.55rem",
                  borderRadius: "10px",
                  color: theme.palette.secondary[100],
                  "& .MuiListItemIcon-root": {
                    minWidth: 36,
                    color: theme.palette.secondary[200],
                  },
                  "&:hover": {
                    backgroundColor: alpha(accent, isDark ? 0.08 : 0.12),
                  },
                  // NavLink sets .active and aria-current="page" itself.
                  "&.active": {
                    backgroundColor: accent,
                    color: theme.palette.getContrastText(accent),
                    "& .MuiListItemIcon-root": {
                      color: theme.palette.getContrastText(accent),
                    },
                    "&:hover": { backgroundColor: accent },
                  },
                }}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText
                  primary={text}
                  slotProps={{
                    primary: { sx: { fontSize: "0.88rem", fontWeight: 500 } },
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        ))}
      </Box>

      {/* Signed-in user */}
      <Divider />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          px: "1.25rem",
          py: "1rem",
        }}
      >
        <Avatar src={profileImage} alt="" sx={{ width: 38, height: 38 }} />
        <Box sx={{ minWidth: 0 }}>
          <Typography
            noWrap
            sx={{
              fontWeight: 700,
              fontSize: "0.88rem",
              color: theme.palette.secondary[100],
            }}
          >
            {user.name ?? " "}
          </Typography>
          <Typography
            noWrap
            sx={{ fontSize: "0.78rem", color: theme.palette.secondary[200] }}
          >
            {user.occupation ?? " "}
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
