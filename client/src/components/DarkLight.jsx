import { useTheme } from "@emotion/react";
import { LightMode, DarkMode } from "@mui/icons-material";
import { Box, Button } from "@mui/material";

export const DarkLight = ({ mode, modeChanger }) => {
  const theme = useTheme();
  return (
    <Box>
      {mode === "light" ? (
        <Button
          sx={{ color: theme.palette.primary.main }}
          onClick={modeChanger}
        >
          <DarkMode />
        </Button>
      ) : (
        <Button
          sx={{ color: theme.palette.primary.main }}
          onClick={modeChanger}
        >
          <LightMode onClick={modeChanger} />
        </Button>
      )}
    </Box>
  );
};
