import { useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  ArrowForwardRounded,
  CloseRounded,
  EmailOutlined,
  LocationOnOutlined,
  PhoneOutlined,
  WorkOutlineRounded,
} from "@mui/icons-material";
import { useGetTransactionsQuery, useGetUserQuery } from "../../state/api";
import StatusMessage from "../common/StatusMessage";
import {
  formatDateTime,
  formatMoney,
  formatPhone,
  fullMoney,
} from "../../utils/formatters";
import { countryFlag, countryName } from "../../utils/geo";

const ORDER_SORT = JSON.stringify({ field: "createdAt", sort: "desc" });

const initials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

const Stat = ({ label, value }) => {
  const theme = useTheme();
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        sx={{ fontSize: "0.72rem", color: theme.palette.secondary[300] }}
      >
        {label}
      </Typography>
      <Typography
        noWrap
        sx={{
          fontSize: "1.15rem",
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
          color: theme.palette.secondary[100],
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

const ContactRow = ({ icon, children }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{ display: "flex", alignItems: "center", gap: "0.75rem", py: "6px" }}
    >
      <Box
        sx={{ display: "flex", color: theme.palette.secondary[300] }}
        aria-hidden="true"
      >
        {icon}
      </Box>
      <Box
        sx={{
          minWidth: 0,
          fontSize: "0.88rem",
          color: theme.palette.secondary[100],
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

/**
 * Side panel with one customer's profile and order history. The orders come
 * from the existing transactions endpoint (its search matches on userId), so
 * no new API route is needed.
 */
const CustomerDrawer = ({ userId, open, onClose }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const skip = !userId;

  const userQuery = useGetUserQuery(userId, { skip });
  const ordersQuery = useGetTransactionsQuery(
    { page: 0, pageSize: 100, sort: ORDER_SORT, search: userId ?? "" },
    { skip },
  );

  // currentData (not data): RTK Query keeps `data` from the previous
  // argument while a new customer loads, which would flash the wrong person.
  const user = userQuery.currentData?.success
    ? userQuery.currentData.user
    : null;

  // The search is a partial match, so keep only this customer's own orders.
  const orders = useMemo(
    () =>
      (ordersQuery.currentData?.transactions ?? []).filter(
        (order) => order.userId === userId,
      ),
    [ordersQuery.currentData, userId],
  );
  const spent = orders.reduce(
    (sum, order) => sum + (Number(order.cost) || 0),
    0,
  );

  const loading = !user && !userQuery.isError;
  const failed = userQuery.isError || userQuery.currentData?.success === false;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 420 },
            backgroundColor: isDark
              ? "rgba(25, 31, 69, 0.82)"
              : "rgba(255, 255, 255, 0.86)",
            backdropFilter: "var(--blur-lg, blur(32px)) saturate(160%)",
            WebkitBackdropFilter: "var(--blur-lg, blur(32px)) saturate(160%)",
            borderLeft: `1px solid ${
              isDark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.1)"
            }`,
          },
          role: "dialog",
          "aria-label": "Customer details",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: "0.5rem" }}>
        <Tooltip title="Close">
          <IconButton onClick={onClose} aria-label="Close customer details">
            <CloseRounded />
          </IconButton>
        </Tooltip>
      </Box>

      {failed ? (
        <StatusMessage
          variant="error"
          title="Could not load this customer"
          onRetry={userQuery.refetch}
        />
      ) : loading ? (
        <Box
          sx={{ px: "1.5rem", display: "grid", gap: "12px" }}
          role="status"
          aria-label="Loading customer"
        >
          <div
            className="skeleton skeleton--circle"
            style={{ width: 64, height: 64 }}
          />
          <div
            className="skeleton skeleton--heading"
            style={{ width: "60%" }}
          />
          <div className="skeleton skeleton--text" style={{ width: "40%" }} />
          <div className="skeleton" style={{ height: 120 }} />
        </Box>
      ) : (
        <Box sx={{ px: "1.5rem", pb: "1.5rem", overflowY: "auto" }}>
          {/* Identity */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                fontSize: "1.3rem",
                fontWeight: 700,
                bgcolor: alpha(
                  theme.palette.secondary[300],
                  isDark ? 0.18 : 0.25,
                ),
                color: theme.palette.secondary[isDark ? 300 : 100],
              }}
            >
              {initials(user.name)}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h4"
                component="h2"
                noWrap
                sx={{ fontWeight: 700, color: theme.palette.secondary[100] }}
              >
                {user.name}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  textTransform: "capitalize",
                  color: theme.palette.secondary[300],
                }}
              >
                {user.role}
              </Typography>
            </Box>
          </Box>

          {/* Contact */}
          <Box sx={{ mt: "1.25rem" }}>
            <ContactRow icon={<EmailOutlined fontSize="small" />}>
              <Link
                href={`mailto:${user.email}`}
                color="inherit"
                underline="hover"
              >
                {user.email}
              </Link>
            </ContactRow>
            {user.phoneNumber && (
              <ContactRow icon={<PhoneOutlined fontSize="small" />}>
                <Link
                  href={`tel:${user.phoneNumber}`}
                  color="inherit"
                  underline="hover"
                >
                  {formatPhone(user.phoneNumber)}
                </Link>
              </ContactRow>
            )}
            <ContactRow icon={<LocationOnOutlined fontSize="small" />}>
              {[user.city, user.state].filter(Boolean).join(", ")}
              {user.city ? " · " : ""}
              {countryFlag(user.country)} {countryName(user.country)}
            </ContactRow>
            {user.occupation && (
              <ContactRow icon={<WorkOutlineRounded fontSize="small" />}>
                {user.occupation}
              </ContactRow>
            )}
          </Box>

          <Divider sx={{ my: "1.25rem" }} />

          {/* Order stats */}
          {ordersQuery.isFetching ? (
            <div className="skeleton" style={{ height: 52 }} />
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "1rem",
              }}
            >
              <Stat label="Orders" value={orders.length} />
              <Stat label="Total spent" value={fullMoney.format(spent)} />
              <Stat
                label="Avg. order"
                value={
                  orders.length ? fullMoney.format(spent / orders.length) : "—"
                }
              />
            </Box>
          )}

          {/* Order history */}
          <Typography
            variant="h6"
            component="h3"
            sx={{
              mt: "1.5rem",
              mb: "0.25rem",
              fontWeight: 600,
              color: theme.palette.secondary[100],
            }}
          >
            Recent orders
          </Typography>
          {ordersQuery.isError ? (
            <StatusMessage
              variant="error"
              title="Could not load orders"
              onRetry={ordersQuery.refetch}
              minHeight={160}
            />
          ) : !ordersQuery.isFetching && orders.length === 0 ? (
            <Typography
              sx={{ py: "1rem", color: theme.palette.secondary[300] }}
            >
              No orders yet.
            </Typography>
          ) : (
            <List dense disablePadding>
              {orders.slice(0, 8).map((order) => (
                <ListItem
                  key={order._id}
                  disableGutters
                  secondaryAction={
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {formatMoney(order.cost)}
                    </Typography>
                  }
                  sx={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <ListItemText
                    primary={formatDateTime(order.createdAt)}
                    secondary={`${order.products?.length ?? 0} product${
                      order.products?.length === 1 ? "" : "s"
                    }`}
                  />
                </ListItem>
              ))}
            </List>
          )}

          {orders.length > 0 && (
            <Button
              component={RouterLink}
              to={`/transactions?search=${encodeURIComponent(userId)}`}
              onClick={onClose}
              color="secondary"
              endIcon={<ArrowForwardRounded />}
              sx={{ mt: "0.75rem" }}
            >
              All orders in Transactions
            </Button>
          )}
        </Box>
      )}
    </Drawer>
  );
};

export default CustomerDrawer;
