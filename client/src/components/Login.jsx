import { Box, Button } from "@mui/material";
import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import cookies from "js-cookie";
import { ProgressBar } from "./ProgressBar";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { url } from "../utils/url";

export const Login = () => {
  const [progress, setProgress] = useState();
  const username = useRef();
  const password = useRef();
  const photo = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    const getter = async () => {
      const token = cookies.get("token");
      try {
        const res = await axios({
          method: "post",
          url: `${url}/verify-token`,
          data: { token },
        });
        if (res.data.message === "chat") {
          navigate("/chats");
        }
      } catch (err) {
        toast.info(err.response.data.message);
      }
    };
    getter();
  }, []);
  const sendLoginInfo = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("username", username.current.value);
    formData.append("password", password.current.value);
    formData.append("photo", photo.current.files[0]);
    try {
      const res = await axios({
        method: "post",
        url: `${url}/login`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (p) => {
          const progress = p.loaded / p.total;
          setProgress(progress);
        },
      });
      if (res.data.message == "suc") {
        navigate("/chats");
        cookies.set("token", res.data.token, { expires: 15 });
      } else if (res.data.message == "signedin") {
        navigate("/chats");
        cookies.set("token", res.data.token, { expires: 15 });
      }
    } catch (err) {
      if (err.response.data.message == "profile") {
        toast.info("لطفا عکس پروفایلی آپلود کنید");
      } else if (err.response.data.message == "size") {
        toast.info("حجم عکس نباید بیشتر از 5 مگابایت باشد");
      } else if (err.response.data.message == "userbefore") {
        toast.info(`کاربری قبلا با این نام کاربری ثبت شده است
      اگر این نام کاربری متعلق به شماست رمز عبور را درست وارد کنید
      و اگر نه نام کاربری دیگری را امتحان کنید`);
      } else {
        toast.info(
          "نام کاربری باید حداقل ۳ و رمز عبور باید حداقل ۸ کاراکتر داشته باشد"
        );
      }
    }
  };
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
        theme="light"
      />
      <ProgressBar progress={progress} />
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          style={{ width: "300px", height: "auto" }}
          src="../../icon.jpg"
          alt="چت فامیلی"
        />
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
          action="http://localhost:3000/login"
          method="POST"
          onSubmit={sendLoginInfo}
        >
          <label
            style={{
              fontSize: "20px",
              border: "1px solid #1d76cf",
              borderRadius: "20px",
              padding: "10px",
            }}
            htmlFor="file"
          >
            عکس پروفایل
          </label>
          <input
            ref={photo}
            style={{ display: "none" }}
            type="file"
            name="photo"
            id="file"
          />
          <input
            ref={username}
            name="username"
            placeholder="نام کاربری را وارد کنید"
            required
          />
          <input
            ref={password}
            name="password"
            placeholder="رمز عبور خود را وارد کنید"
            required
          />
          <input type="submit" value="ثبت نام | ورود" />
        </form>
      </Box>
    </>
  );
};
