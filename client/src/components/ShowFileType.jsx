import { useTheme } from "@emotion/react";
import { useContext, useState } from "react";
import { myContext } from "../context/myContext";
import { Button } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { url } from "../utils/url";

export const ShowFileType = ({ file, setInputEmpty }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { mode, getProgress, uploading, setUploading, setNewFile } =
    useContext(myContext);
  const { username } = useParams();
  const sendFile = async () => {
    if (!uploading) {
      setNewFile(file);
      setUploading(true);
      try {
        let formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", file.name);
        formData.append("username", username);
        formData.append("token", Cookies.get("token"));
        await axios({
          method: "post",
          url: `${url}/sending-file`,
          data: { token: Cookies.get("token"), to: username },
        });
        const { data } = await axios({
          method: "post",
          url: `${url}/send-file`,
          data: formData,
          onUploadProgress: (p) => {
            getProgress(p.loaded / p.total);
          },
          headers: { "Content-Type": "multipart/form-data" },
        });
        setUploading(false);
        setInputEmpty();
        if (data.message == "no user") {
          toast.info("کاربر مورد نظر پیدا نشد");
        } else if (
          res.data.message == "sign out" ||
          res.data.message == "no token"
        ) {
          navigate("/");
        }
      } catch (err) {
        toast.info(err);
      }
    } else {
      toast.info("در حین آپلود نمی توانید دوباره آپلود کنید");
    }
  };
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "45%",
          left: "55%",
          display: file ? "flex" : "none",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor:
            mode === "light"
              ? theme.palette.secondary.light
              : theme.palette.secondary.dark,
          padding: "10px",
          borderRadius: "15px",
        }}
      >
        {file && (
          <>
            <p
              style={{
                color:
                  mode === "light"
                    ? theme.palette.primary.light
                    : theme.palette.primary.dark,
              }}
            >
              {file.name}
            </p>
            <Button onClick={sendFile} variant="contained">
              ارسال
            </Button>
          </>
        )}
      </div>
    </>
  );
};
