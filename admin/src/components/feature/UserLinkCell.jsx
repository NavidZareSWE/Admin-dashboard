import { ButtonBase, Tooltip } from "@mui/material";
import { MONO } from "../grid/cells";

/** A user id inside a grid cell that opens the customer drawer. */
const UserLinkCell = ({ value, onOpen, short = false, color }) => (
  <Tooltip title="View customer">
    <ButtonBase
      onClick={(event) => {
        event.stopPropagation();
        onOpen(value);
      }}
      sx={{
        fontFamily: MONO,
        fontSize: "0.75rem",
        color,
        borderRadius: "4px",
        textDecoration: "underline",
        textDecorationStyle: "dotted",
        textUnderlineOffset: "3px",
        "&:hover": { textDecorationStyle: "solid" },
      }}
    >
      {short && value ? `…${String(value).slice(-8)}` : value}
    </ButtonBase>
  </Tooltip>
);

export default UserLinkCell;
