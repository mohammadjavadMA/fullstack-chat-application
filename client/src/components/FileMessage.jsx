import { useContext } from "react";
import { myContext } from "../context/myContext";
import { useTheme } from "@emotion/react";
import { Done, DoneAll, InsertDriveFile } from "@mui/icons-material";
import { Box } from "@mui/material";
import { format } from "date-fns-jalali";
import axios from "axios";

export const FileMessage = ({ chat }) => {
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
        onClick={async () => {
          const res = await axios({
            method: "post",
            data: { fileName: chat.message },
            url: `${url}/get-file`,
          });
          const url = window.URL.createObjectURL(
            new Blob([res.data], { type: res.headers["content-type"] })
          );
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "download");
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
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
          {chat.message.split("_")[1]}
          <InsertDriveFile
            sx={{
              color:
                mode == "light" && chat.from != "you"
                  ? theme.palette.primary.light
                  : mode == "light" && chat.from == "you"
                  ? theme.palette.primary.dark
                  : theme.palette.primary.dark,
            }}
          />
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
