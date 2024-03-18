import { Box, Skeleton } from "@mui/material";

export const ChatShowerSkeletons = () => {
  return (
    <Box sx={{ height: "95vh", overflow: "auto" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
        }}
      >
        <Skeleton
          sx={{ margin: "15px" }}
          variant="text"
          width={200}
          height={70}
          animation="wave"
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
        }}
      >
        <Skeleton
          sx={{ margin: "15px" }}
          variant="text"
          width={200}
          height={70}
          animation="wave"
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "end",
        }}
      >
        <Skeleton
          sx={{ margin: "15px" }}
          variant="text"
          width={200}
          height={70}
          animation="wave"
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
        }}
      >
        <Skeleton
          sx={{ margin: "15px" }}
          variant="text"
          width={200}
          height={70}
          animation="wave"
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "end",
        }}
      >
        <Skeleton
          sx={{ margin: "15px" }}
          variant="text"
          width={200}
          height={70}
        />
      </Box>
    </Box>
  );
};
