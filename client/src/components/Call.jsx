import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../utils/socket";
import Cookies from "js-cookie";
import { Button } from "@mui/material";
import Peer from "peerjs";
import { toast } from "react-toastify";

export const Call = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const params = new URLSearchParams(document.location.search);
  const myVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peer = new Peer();
  peer.on("call", (call) => {
    console.log("call made");
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        call.answer(stream);
        myVideoRef.current.srcObject = stream;
        call.on("stream", (remoteStream) => {
          console.log(remoteStream);
          remoteVideoRef.current.srcObject = remoteStream;
        });
      });
  });
  const onReject = () => {
    navigate("/chats");
    toast.info("تماس شما رد شد");
  };
  const onAnswer = (id) => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        myVideoRef.current.srcObject = stream;
        const call = peer.call(id, stream);
        call.on("stream", (remoteStream) => {
          console.log(remoteStream);
          remoteVideoRef.current.srcObject = remoteStream;
        });
      });
  };
  useEffect(() => {
    const isInitiator = params.get("initiator");
    peer.on("open", (id) => {
      if (isInitiator == "true") {
        socket.emit("call", { token: Cookies.get("token"), username });
      } else {
        socket.emit("ans call", { username, id });
      }
    });
    socket.on("call answered", onAnswer);
    socket.on("call rejected", onReject);
    return () => {
      socket.off("call answered", onAnswer);
      socket.off("call rejected", onReject);
      peer.off("open");
    };
  }, [username]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
      }}
    >
      <video
        muted
        width={500}
        height={500}
        autoPlay={true}
        ref={myVideoRef}
      ></video>
      <video
        width={500}
        height={500}
        autoPlay={true}
        ref={remoteVideoRef}
      ></video>
      <Button onClick={() => {}}>قطع تماس</Button>
    </div>
  );
};
