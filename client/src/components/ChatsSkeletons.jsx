import { Box, Skeleton } from "@mui/material";

export const ChatsSkeletons = () => {
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          padding: "3px",
          margin: "2px",
          alignItems: "center",
        }}
      >
        <Skeleton
          animation={"wave"}
          sx={{ margin: "0 10px" }}
          variant="text"
          width={"95%"}
          height={70}
        />
        <Skeleton
          sx={{ margin: "0 10px" }}
          variant="circular"
          width={55}
          height={55}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          padding: "3px",
          margin: "2px",
          alignItems: "center",
        }}
      >
        <Skeleton
          animation={"wave"}
          sx={{ margin: "0 10px" }}
          variant="text"
          width={"95%"}
          height={70}
        />
        <Skeleton
          sx={{ margin: "0 10px" }}
          variant="circular"
          width={55}
          height={55}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          padding: "3px",
          margin: "2px",
          alignItems: "center",
        }}
      >
        <Skeleton
          animation={"wave"}
          sx={{ margin: "0 10px" }}
          variant="text"
          width={"95%"}
          height={70}
        />
        <Skeleton
          sx={{ margin: "0 10px" }}
          variant="circular"
          width={55}
          height={55}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          padding: "3px",
          margin: "2px",
          alignItems: "center",
        }}
      >
        <Skeleton
          animation={"wave"}
          sx={{ margin: "0 10px" }}
          variant="text"
          width={"95%"}
          height={70}
        />
        <Skeleton
          sx={{ margin: "0 10px" }}
          variant="circular"
          width={55}
          height={55}
        />
      </Box>
    </div>
  );
};
