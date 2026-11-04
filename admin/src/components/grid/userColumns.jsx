import { Avatar, Box } from "@mui/material";
import { formatPhone } from "../../utils/formatters";
import { IdCell, MONO, Pill } from "./cells";

const initials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

/**
 * Columns shared by the Customers and Admin directories. Built per render
 * because the cells close over the palette-dependent colours.
 */
export const buildUserColumns = (c) => [
  {
    field: "name",
    headerName: "Name",
    flex: 1,
    minWidth: 180,
    renderCell: ({ value }) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Avatar
          sx={{
            width: 28,
            height: 28,
            fontSize: "0.7rem",
            fontWeight: 700,
            bgcolor: c.pillBg,
            color: c.pillFg,
          }}
        >
          {initials(value)}
        </Avatar>
        <Box component="span" sx={{ fontWeight: 500, color: c.textStrong }}>
          {value}
        </Box>
      </Box>
    ),
  },
  { field: "email", headerName: "Email", flex: 1.2, minWidth: 200 },
  {
    field: "phoneNumber",
    headerName: "Phone",
    flex: 0.8,
    minWidth: 140,
    valueFormatter: (value) => formatPhone(value),
    renderCell: ({ formattedValue }) => (
      <Box component="span" sx={{ fontFamily: MONO, fontSize: "0.78rem" }}>
        {formattedValue}
      </Box>
    ),
  },
  { field: "country", headerName: "Country", flex: 0.5, minWidth: 90 },
  { field: "occupation", headerName: "Occupation", flex: 1, minWidth: 160 },
  {
    field: "role",
    headerName: "Role",
    flex: 0.5,
    minWidth: 100,
    renderCell: ({ value }) => (
      <Pill
        tone={
          value === "admin" || value === "superadmin" ? "accent" : "neutral"
        }
        c={c}
      >
        {value}
      </Pill>
    ),
  },
  {
    field: "_id",
    headerName: "ID",
    flex: 0.6,
    minWidth: 110,
    renderCell: ({ value }) => <IdCell value={value} c={c} />,
  },
];
