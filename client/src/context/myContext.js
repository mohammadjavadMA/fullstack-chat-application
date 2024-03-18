import { createContext } from "react";

export const myContext = createContext({
  mode: "",
  modeChanger: () => {},
  getProgress: () => {},
  uploading: false,
  setUploading: () => {},
  areEventsSet: false,
  newImage: null,
  setNewImage: () => {},
  newFile: null,
  setNewFile: () => {},
  newVideo: null,
  setNewVideo: () => {},
  showImageModal: false,
  setShowImageModal: () => {},
});
