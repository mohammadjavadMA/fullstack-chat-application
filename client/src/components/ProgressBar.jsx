import { useTheme } from "@emotion/react";

export const ProgressBar = ({ progress }) => {
  const theme = useTheme();
  return (
    <>
      {progress && progress != 1 ? (
        <div
          style={{
            position: "absolute",
            height: "3px",
            width: `${progress * 100}%`,
            backgroundColor: "#1d76cf",
          }}
        ></div>
      ) : null}
    </>
  );
};
