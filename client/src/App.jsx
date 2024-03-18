import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, ThemeProvider, createTheme } from "@mui/material";
import { ScreenContainer } from "./containers/ScreenContainer";
import { myContext } from "./context/myContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ProgressBar } from "./components/ProgressBar";
import cookies from "js-cookie";
import axios from "axios";
import { HelmetProvider } from "react-helmet-async";
import { socket } from "./utils/socket";
import { ToastContainer, toast } from "react-toastify";
import { url } from "./utils/url";

function App() {
  const navigate = useNavigate();
  const { username } = useParams();
  const [mode, setMode] = useState();
  const path = useLocation();
  const [progress, setProgress] = useState();
  const [uploading, setUploading] = useState();
  const [newImage, setNewImage] = useState(null);
  const [newFile, setNewFile] = useState(null);
  const [newVideo, setNewVideo] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const onCall = (caller) => {
    toast.info(
      <div>
        <p>{caller} با شما تماس میگیرد</p>
        <Button
          onClick={() => {
            navigate(`/call/${caller}?initiator=false`);
          }}
        >
          قبول
        </Button>
        <Button
          onClick={() => {
            socket.emit("rej call", caller);
          }}
        >
          رد
        </Button>
      </div>
    );
  };
  const getProgress = (p) => {
    setProgress(p);
  };
  useEffect(() => {
    const getter = async () => {
      const token = cookies.get("token");
      try {
        const res = await axios({
          method: "post",
          url: `${url}/verify-token`,
          data: { token },
        });
        if (res.data.message !== "chat") {
          navigate("/");
        }
      } catch (err) {
        toast.info(err.response.data.message);
      }
    };
    getter();
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? setMode("dark")
      : setMode("light");
    socket.on("calling you", onCall);
    return () => {
      socket.off("calling you", onCall);
    };
  }, []);
  const modeChanger = () => {
    if (mode === "light") {
      setMode("dark");
    } else {
      setMode("light");
    }
  };
  const theme = createTheme({
    palette: {
      primary: {
        main: "#1d76cf",
        light: "#454545",
        dark: "#ffffff",
        contrastText: "#363636",
      },
      secondary: {
        main: "#dedede",
        light: "#dedede",
        dark: "#575757",
      },
    },
  });
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        role="info"
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={mode}
      />
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          backgroundColor: mode === "light" ? "white" : "#454545",
        }}
      >
        <ThemeProvider theme={theme}>
          <HelmetProvider>
            <myContext.Provider
              value={{
                mode,
                modeChanger,
                getProgress,
                uploading,
                setUploading,
                newImage,
                setNewImage,
                newFile,
                setNewFile,
                showImageModal,
                setShowImageModal,
                newVideo,
                setNewVideo,
              }}
            >
              <ProgressBar progress={progress} />
              <ScreenContainer path={path} />
            </myContext.Provider>
          </HelmetProvider>
        </ThemeProvider>
      </Box>
    </>
  );
}

export default App;
