import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  LightModeOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
  MenuOpen,
  ArrowDropDownOutlined,
  TrendingUpOutlined,
  KeyboardOutlined,
  SettingsBrightnessOutlined,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setMode, setThemePreference } from "../../state/globalSlice";
import NavSearch from "./NavSearch";
import profileImage from "../../assets/images/profile.jpeg";

const Navbar = ({ user, isSideBarOpen, onToggleSidebar, onShowShortcuts }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  const themePreference = useSelector((state) => state.global.themePreference);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isDark = theme.palette.mode === "dark";
  const nextMode = isDark ? "light" : "dark";

  const closeMenu = () => setAnchorEl(null);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        // Translucent so content scrolling underneath stays readable, with a
        // hairline instead of a shadow.
        backgroundColor: alpha(theme.palette.background.default, 0.82),
        backdropFilter: "saturate(180%) blur(10px)",
        borderBottom: `1px solid ${
          isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"
        }`,
        color: theme.palette.secondary[100],
      }}
    >
      <Toolbar
        sx={{
          gap: { xs: "0.5rem", sm: "1rem" },
          px: { xs: "0.75rem", sm: "1.5rem" },
        }}
      >
        {/* LEFT SIDE */}
        <Tooltip title={isSideBarOpen ? "Hide navigation" : "Show navigation"}>
          <IconButton
            onClick={onToggleSidebar}
            aria-label={isSideBarOpen ? "Hide navigation" : "Show navigation"}
            aria-expanded={isSideBarOpen}
            edge="start"
          >
            {isSideBarOpen ? <MenuOpen /> : <MenuIcon />}
          </IconButton>
        </Tooltip>

        <Box sx={{ flex: 1, minWidth: 0, display: "flex" }}>
          <NavSearch />
        </Box>

        {/* RIGHT SIDE */}
        <Tooltip title={`Switch to ${nextMode} mode`}>
          <IconButton
            onClick={() => dispatch(setMode())}
            aria-label={`Switch to ${nextMode} mode`}
          >
            {/* The icon shows the mode you will switch to. */}
            {isDark ? <LightModeOutlined /> : <DarkModeOutlined />}
          </IconButton>
        </Tooltip>

        <Button
          onClick={(event) => setAnchorEl(event.currentTarget)}
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          aria-controls={isMenuOpen ? "account-menu" : undefined}
          aria-label="Account menu"
          color="inherit"
          sx={{
            gap: "0.75rem",
            px: { xs: "4px", sm: "8px" },
            minWidth: 0,
            borderRadius: "12px",
          }}
        >
          <Avatar src={profileImage} alt="" sx={{ width: 32, height: 32 }} />
          <Box
            sx={{
              textAlign: "left",
              display: { xs: "none", md: "block" },
              maxWidth: 160,
            }}
          >
            <Typography
              noWrap
              sx={{
                fontWeight: 700,
                fontSize: "0.85rem",
                color: theme.palette.secondary[100],
              }}
            >
              {user.name}
            </Typography>
            <Typography
              noWrap
              sx={{ fontSize: "0.75rem", color: theme.palette.secondary[200] }}
            >
              {user.occupation}
            </Typography>
          </Box>
          <ArrowDropDownOutlined
            sx={{
              display: { xs: "none", sm: "block" },
              color: theme.palette.secondary[300],
            }}
          />
        </Button>
        <Menu
          id="account-menu"
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={closeMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{ paper: { sx: { minWidth: 260, mt: "6px" } } }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography sx={{ fontWeight: 700 }}>{user.name}</Typography>
            {user.email && (
              <Typography
                sx={{ fontSize: "0.8rem", color: theme.palette.secondary[300] }}
              >
                {user.email}
              </Typography>
            )}
          </Box>
          <Divider />
          <MenuItem
            onClick={() => {
              closeMenu();
              navigate("/performance");
            }}
          >
            <ListItemIcon>
              <TrendingUpOutlined fontSize="small" />
            </ListItemIcon>
            My performance
          </MenuItem>
          <MenuItem
            onClick={() => {
              closeMenu();
              onShowShortcuts?.();
            }}
          >
            <ListItemIcon>
              <KeyboardOutlined fontSize="small" />
            </ListItemIcon>
            Keyboard shortcuts
            <Typography
              component="kbd"
              sx={{
                ml: "auto",
                pl: 2,
                fontFamily: "inherit",
                fontSize: "0.75rem",
                color: theme.palette.secondary[300],
              }}
            >
              ?
            </Typography>
          </MenuItem>
          <Divider />
          <Box sx={{ px: 2, pt: 0.5, pb: 1 }}>
            <Typography
              id="theme-choice-label"
              sx={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: theme.palette.secondary[300],
                mb: "6px",
              }}
            >
              Theme
            </Typography>
            <ToggleButtonGroup
              value={themePreference}
              exclusive
              fullWidth
              size="small"
              color="secondary"
              aria-labelledby="theme-choice-label"
              onChange={(_, next) => next && dispatch(setThemePreference(next))}
            >
              <ToggleButton value="light" aria-label="Light theme">
                <LightModeOutlined fontSize="small" sx={{ mr: "4px" }} />
                Light
              </ToggleButton>
              <ToggleButton value="dark" aria-label="Dark theme">
                <DarkModeOutlined fontSize="small" sx={{ mr: "4px" }} />
                Dark
              </ToggleButton>
              <ToggleButton value="system" aria-label="Match system theme">
                <SettingsBrightnessOutlined
                  fontSize="small"
                  sx={{ mr: "4px" }}
                />
                Auto
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
