import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";
import { AddReaction, AttachFile, KeyboardVoice } from "@mui/icons-material";
import { useContext, useState } from "react";
import { myContext } from "../context/myContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import cookies from "js-cookie";
import { toast } from "react-toastify";
import { ShowFileType } from "./ShowFileType";
import { url } from "../utils/url";
// import { VideoShower } from "./VideoShower";

export const ChatBox = ({ imageSender, sendMessage }) => {
  const { mode } = useContext(myContext);
  const [file, setFile] = useState();
  // const [video, setVideo] = useState();
  const theme = useTheme();
  const { username } = useParams();
  const onImageChange = (event) => {
    if (
      event.target.files &&
      event.target.files[0] &&
      (event.target.files[0].type == "image/jpeg" ||
        event.target.files[0].type == "image/png" ||
        event.target.files[0].type == "image/svg")
    ) {
      const reader = new FileReader();
      reader.addEventListener("load", (e) => {
        imageSender(e.target.result);
      });
      reader.readAsDataURL(event.target.files[0]);
    } else if (
      event.target.files &&
      event.target.files[0] &&
      event.target.files[0].type != "video/mp4" &&
      event.target.files[0].type != "video/x-matroska"
    ) {
      setFile(event.target.files[0]);
    } else if (
      event.target.files[0].type != "video/mp4" ||
      event.target.files[0].type != "video/x-matroska"
    ) {
      // setVideo(event.target.files[0]);
      toast.info("فعلا ویدیو پشتیبانی نمی شود");
    }
    event.target.value = "";
  };
  const setInputEmpty = () => {
    setFile(null);
  };
  const startedTyping = async () => {
    await axios({
      method: "post",
      url: `${url}/typing`,
      data: { token: cookies.get("token"), to: username },
    });
  };
  const endedTyping = async () => {
    await axios({
      method: "post",
      url: `${url}/ended-typing`,
      data: { token: cookies.get("token"), to: username },
    });
  };
  return (
    <>
      <ShowFileType file={file} setInputEmpty={setInputEmpty} />
      {username && (
        <Box
          sx={{
            width: "45%",
            borderRadius: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            bottom: "10px",
            height: "50px",
            backgroundColor:
              mode === "light"
                ? theme.palette.secondary.light
                : theme.palette.secondary.dark,
          }}
        >
          <AddReaction
            sx={{
              color:
                mode === "light"
                  ? theme.palette.primary.light
                  : theme.palette.primary.dark,
              cursor: "pointer",
            }}
          />
          <input
            type="text"
            name="message"
            id="message"
            onKeyDown={sendMessage}
            onFocus={startedTyping}
            onBlur={endedTyping}
            style={{
              background: "none",
              border: "none",
              outline: "none",
              direction: "rtl",
              width: "80%",
              fontSize: "20px",
              fontFamily: "Vazir",
              color:
                mode === "light"
                  ? theme.palette.primary.light
                  : theme.palette.primary.dark,
            }}
            placeholder="پیام"
            autoComplete="off"
          />
          <label style={{ height: "25px" }} htmlFor="file">
            <AttachFile
              sx={{
                color:
                  mode === "light"
                    ? theme.palette.primary.light
                    : theme.palette.primary.dark,
                marginLeft: "10px",
                cursor: "pointer",
              }}
            />
          </label>
          <input
            type="file"
            name="file"
            id="file"
            onChange={onImageChange}
            style={{ display: "none" }}
          />
          <KeyboardVoice
            sx={{
              color:
                mode === "light"
                  ? theme.palette.primary.light
                  : theme.palette.primary.dark,
              marginLeft: "10px",
              cursor: "pointer",
            }}
          />
        </Box>
      )}
    </>
  );
};
