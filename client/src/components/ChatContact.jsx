import { Avatar, Box, Button } from "@mui/material";
import { useContext } from "react";
import { myContext } from "../context/myContext";
import { useTheme } from "@emotion/react";
import { useNavigate, useParams } from "react-router-dom";
import { Videocam } from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "axios";
import {url} from "../utils/url"

export const ChatContact = ({
  contactName,
  contactProfileLink,
  contactType,
  lastSeen,
}) => {
  const navigate = useNavigate();
  const { mode } = useContext(myContext);
  const theme = useTheme();
  const { username } = useParams();
  const getMediaStream = async () => {
    try {
      const { data } = await axios({
        method: "post",
        url: `${url}/check-online`,
        data: { chat: username },
      });
      if (data.message == true) {
        if (data.isOnline) {
          navigate(`/call/${username}?initiator=true`);
        } else {
          toast.info("کاربر مورد نظر آنلاین نیست");
        }
      } else {
        toast.info("کاربر مورد نظر وجود ندارد");
      }
    } catch (err) {
      console.log(err);
      toast.info(err.response.data.message);
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "3px",
        borderBottom:
          mode === "light" ? "1px solid #dedede" : "1px solid #575757",
        cursor: "pointer",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
        }}
      >
        <Box>
          <Avatar
            sx={{ width: "50px", height: "50px" }}
            alt={contactName}
            src={contactProfileLink}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "start",
            marginLeft: "10px",
          }}
        >
          <h4
            style={{
              color:
                mode === "light"
                  ? theme.palette.primary.light
                  : theme.palette.primary.dark,
            }}
          >
            {contactName}
          </h4>
          {contactType === "channel" ? (
            <p
              style={{
                color:
                  mode === "light"
                    ? theme.palette.primary.light
                    : theme.palette.primary.dark,
              }}
            >
              {contactType}
            </p>
          ) : (
            <p
              style={{
                color:
                  mode === "light"
                    ? theme.palette.primary.light
                    : theme.palette.primary.dark,
              }}
            >
              {lastSeen == "آنلاین" ||
              lastSeen == "... در حال نوشتن" ||
              lastSeen == "... در حال ارسال عکس" ||
              lastSeen == "... در حال ارسال فایل" ? (
                <span>{lastSeen}</span>
              ) : (
                <span>آخرین بازدید {lastSeen} قبل</span>
              )}
            </p>
          )}
        </Box>
      </Box>
      <Box>
        <Button onClick={getMediaStream}>
          <Videocam
            sx={{
              color:
                mode === "light"
                  ? theme.palette.primary.light
                  : theme.palette.primary.dark,
            }}
          />
        </Button>
      </Box>
    </Box>
  );
};
