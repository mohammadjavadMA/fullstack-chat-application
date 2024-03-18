import { useTheme } from "@emotion/react";
import { useContext } from "react";
import { myContext } from "../context/myContext";
import { format } from "date-fns-jalali";
import { Done, DoneAll } from "@mui/icons-material";
import { Box } from "@mui/material";

export const TextMessage = ({ chat }) => {
  const theme = useTheme();
  const { mode } = useContext(myContext);
  return (
    <Box
      key={chat.dateSent}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: chat.from == "you" ? "end" : "start",
      }}
    >
      <div
        style={{
          margin: "15px",
          padding: "10px",
          backgroundColor:
            chat.from == "you"
              ? theme.palette.primary.main
              : chat.from != "you" && mode == "dark"
              ? theme.palette.secondary.dark
              : theme.palette.secondary.light,
          borderRadius: "10px",
        }}
      >
        <p
          style={{
            color:
              mode == "light" && chat.from != "you"
                ? theme.palette.primary.light
                : mode == "light" && chat.from == "you"
                ? theme.palette.primary.dark
                : theme.palette.primary.dark,
          }}
        >
          {chat.message}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "2px",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color:
                mode == "light" && chat.from != "you"
                  ? theme.palette.primary.light
                  : mode == "light" && chat.from == "you"
                  ? theme.palette.primary.dark
                  : theme.palette.primary.dark,
              margin: "0 3px",
            }}
          >
            {format(chat.dateSent, "HH:mm")}
          </p>
          {chat.from == "you" && !chat.isRead ? (
            <Done
              sx={{
                fontSize: "12px",
                color:
                  mode == "light" && chat.from != "you"
                    ? theme.palette.primary.light
                    : mode == "light" && chat.from == "you"
                    ? theme.palette.primary.dark
                    : theme.palette.primary.dark,
              }}
            />
          ) : chat.from == "you" && chat.isRead ? (
            <DoneAll
              sx={{
                fontSize: "12px",
                color:
                  mode == "light" && chat.from != "you"
                    ? theme.palette.primary.light
                    : mode == "light" && chat.from == "you"
                    ? theme.palette.primary.dark
                    : theme.palette.primary.dark,
              }}
            />
          ) : null}
        </div>
      </div>
    </Box>
  );
};
