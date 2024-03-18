import { Box, Button, Modal } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { myContext } from "../context/myContext";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import { Helmet } from "react-helmet-async";
import { useTheme } from "@emotion/react";
import { useNavigate, useParams } from "react-router-dom";
import setCanvasPreview from "../utils/setCanvas";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { Close } from "@mui/icons-material";
import { url } from "../utils/url";

export const ImageCropper = ({ image }) => {
  const { username } = useParams();
  const [crop, setCrop] = useState({ unit: "%" });
  const [showModal, setShowModal] = useState();
  const navigate = useNavigate();
  const imageRef = useRef();
  const previewCanvasRef = useRef();
  const { mode, getProgress, uploading, setUploading, setNewImage } =
    useContext(myContext);
  const theme = useTheme();
  useEffect(() => {
    if (!username) {
      setShowModal(false);
    }
  }, [username]);
  useEffect(() => {
    setShowModal(true);
  }, [image]);
  const sendImageMessage = async () => {
    if (!uploading) {
      setUploading(true);
      setCanvasPreview(
        imageRef.current,
        previewCanvasRef.current,
        convertToPixelCrop(
          crop,
          imageRef.current.width,
          imageRef.current.height
        )
      );
      setShowModal(false);
      setNewImage(previewCanvasRef.current.toDataURL());
      const formData = new FormData();
      formData.append("token", Cookies.get("token"));
      formData.append("to", username);
      var blobBin = atob(previewCanvasRef.current.toDataURL().split(",")[1]);
      var array = [];
      for (var i = 0; i < blobBin.length; i++) {
        array.push(blobBin.charCodeAt(i));
      }
      var file = new Blob([new Uint8Array(array)], { type: "image/png" });
      formData.append("newUrl", file);
      await axios({
        method: "post",
        url: `${url}/sending-photo`,
        data: { token: Cookies.get("token"), to: username },
      });
      try {
        const res = await axios({
          method: "post",
          url: `${url}/send-photo`,
          data: formData,
          onUploadProgress: (p) => {
            if (!uploading) {
              getProgress(p.loaded / p.total);
            }
          },
        });
      } catch (err) {
        toast.info(err.response.data.message);
        if (
          err.response.data.message == "no token" ||
          err.response.data.message == "sign out"
        ) {
          navigate("/");
        }
        // if (res.data.message == "yourself") {
        //   toast.info("نمی توانید به خودتان پیام دهید");
        // } else if (res.data.message == "no user") {
        //   toast.info("کاربر مورد نظر یافت نشد");
        // } else if (
        //   res.data.message == "no token" ||
        //   res.data.message == "sign out"
        // ) {
        //   navigate("/");
        // }
      }
      setUploading(false);
    } else {
      toast.info("در حین آپلود نمی توانید دوباره آپلود کنید");
    }
  };
  function onImageLoad(e) {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
    const crop = makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      16 / 9,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  }
  return (
    <>
      <Helmet>
        <link
          href="https://unpkg.com/react-image-crop/dist/ReactCrop.css"
          rel="stylesheet"
        />
      </Helmet>
      {image && username && (
        <Modal open={showModal}>
          <Box
            sx={{
              position: "absolute",
              top: "35%",
              left: "60%",
              padding: "15px",
              borderRadius: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor:
                mode == "light"
                  ? theme.palette.secondary.light
                  : theme.palette.secondary.dark,
              zIndex: 1,
            }}
          >
            <Button
              onClick={() => {
                setShowModal(false);
              }}
            >
              <Close />
            </Button>
            <ReactCrop
              crop={crop}
              onChange={(c, percentCrop) => {
                setCrop(percentCrop);
              }}
            >
              <img
                ref={imageRef}
                style={{ width: "250px", height: "auto" }}
                src={image}
                onLoad={onImageLoad}
              />
            </ReactCrop>
            <Button
              onClick={sendImageMessage}
              sx={{
                marginTop: "10px",
                color:
                  mode == "light"
                    ? theme.palette.secondary.light
                    : theme.palette.secondary.dark,
              }}
              variant="contained"
            >
              <p style={{ fontFamily: "Vazir" }}>ارسال</p>
            </Button>
            {crop && (
              <canvas
                ref={previewCanvasRef}
                className="mt-4"
                style={{
                  display: "none",
                  border: "1px solid black",
                  objectFit: "contain",
                  width: 150,
                  height: 150,
                }}
              />
            )}
          </Box>
        </Modal>
      )}
    </>
  );
};
