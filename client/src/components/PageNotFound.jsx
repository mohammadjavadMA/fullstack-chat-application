import { Box } from "@mui/material";

export const PageNotFound = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <img
        style={{ width: "20%", height: "auto" }}
        src="../../public/icon.jpg"
        alt="چت فامیلی"
      />
      <h1>خطای 404 | صفحه مورد نظر یافت نشد</h1>
    </Box>
  );
};
