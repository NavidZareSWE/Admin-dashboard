import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { AttachMoneyRounded, Inventory2Outlined } from "@mui/icons-material";

/** Sales / Units switch: one click instead of opening a dropdown. */
const ViewToggle = ({ value, onChange }) => (
  <ToggleButtonGroup
    value={value}
    exclusive
    size="small"
    color="secondary"
    aria-label="Chart metric"
    // Exclusive groups emit null when the active button is clicked again;
    // ignoring it keeps one option selected at all times.
    onChange={(_, next) => next && onChange(next)}
  >
    <ToggleButton value="sales" sx={{ gap: "4px", px: "14px" }}>
      <AttachMoneyRounded fontSize="small" />
      Revenue
    </ToggleButton>
    <ToggleButton value="units" sx={{ gap: "4px", px: "14px" }}>
      <Inventory2Outlined fontSize="small" />
      Units
    </ToggleButton>
  </ToggleButtonGroup>
);

export default ViewToggle;
