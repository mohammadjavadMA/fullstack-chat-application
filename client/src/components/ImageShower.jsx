import { Close, Done, DoneAll } from "@mui/icons-material";
import { Box, Button, Modal } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { myContext } from "../context/myContext";
import { useTheme } from "@emotion/react";
import { format } from "date-fns-jalali";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { url } from "../utils/url";
export const ImageShower = ({
  imageName,
  isRead,
  from,
  dateSent,
  newImage,
}) => {
  const [imageData, setImageData] = useState(null);
  const [isReal, setIsReal] = useState(false);
  const { mode, showImageModal, setShowImageModal } = useContext(myContext);
  const theme = useTheme();
  const { username } = useParams();
  const getImageFromServer = async (isReal) => {
    const { data } = await axios({
      method: "post",
      url: `${url}/get-image`,
      data: { imageName, isReal, token: Cookies.get("token"), username },
    });
    setImageData(data.image);
  };
  useEffect(() => {
    if (imageName.split(":")[0] == "data") {
      setImageData(imageName);
    } else {
      getImageFromServer(false);
    }
    if (newImage) {
      setIsReal(true);
    }
    return () => {
      setShowImageModal(false);
    };
  }, []);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: from == "you" ? "end" : "start",
        position: "relative",
      }}
    >
      {/* <Modal open={showImageModal}>
        <img
          src={imageData}
          width={"500px"}
          onClick={() => {
            setShowImageModal(false);
          }}
        />
      </Modal> */}
      <div
        onClick={() => {
          if (!isReal) {
            getImageFromServer(true);
            setIsReal(true);
          } else {
            setShowImageModal(true);
          }
        }}
        style={{
          margin: "15px",
          padding: "10px",
          backgroundColor:
            from == "you"
              ? theme.palette.primary.main
              : from != "you" && mode == "dark"
              ? theme.palette.secondary.dark
              : theme.palette.secondary.light,
          borderRadius: "10px",
        }}
      >
        <img
          style={{
            width: "250px",
            filter: !isReal && "blur(3px)",
            cursor: !isReal && "pointer",
          }}
          src={imageData}
        />
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
                mode == "light" && from != "you"
                  ? theme.palette.primary.light
                  : mode == "light" && from == "you"
                  ? theme.palette.primary.dark
                  : theme.palette.primary.dark,
            }}
          >
            {format(dateSent, "HH:mm")}
          </p>
          {from == "you" && !isRead ? (
            <Done
              sx={{
                fontSize: "12px",
                color:
                  mode == "light" && from != "you"
                    ? theme.palette.primary.light
                    : mode == "light" && from == "you"
                    ? theme.palette.primary.dark
                    : theme.palette.primary.dark,
              }}
            />
          ) : from == "you" && isRead ? (
            <DoneAll
              sx={{
                fontSize: "12px",
                color:
                  mode == "light" && from != "you"
                    ? theme.palette.primary.light
                    : mode == "light" && from == "you"
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
