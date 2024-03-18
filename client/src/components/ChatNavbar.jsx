import { Box, Button } from "@mui/material";
import { DarkLight } from "./DarkLight";
import { useNavigate } from "react-router-dom";
import { myContext } from "../context/myContext";
import { useTheme } from "@emotion/react";
import { useContext } from "react";
import { Search } from "@mui/icons-material";
export const ChatNavbar = () => {
  const { mode, modeChanger } = useContext(myContext);
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        paddingTop: "10px",
        display: "flex",
        width: "100%",
        justifyContent: "space-between",
        borderBottom:
          mode === "light"
            ? "1px solid " + theme.palette.secondary.light
            : "1px solid " + theme.palette.secondary.dark,
        paddingBottom: "10px",
      }}
    >
      <DarkLight mode={mode} modeChanger={modeChanger} />
      <Button
        onClick={() => {
          navigate("/chats/search");
        }}
      >
        <Search
          sx={{
            color:
              mode === "light"
                ? theme.palette.primary.light
                : theme.palette.primary.dark,
          }}
        />
      </Button>
    </Box>
  );
};
