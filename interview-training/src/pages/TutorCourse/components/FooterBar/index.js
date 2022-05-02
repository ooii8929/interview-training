import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import MicIcon from "@mui/icons-material/Mic";
import PresentToAllIcon from "@mui/icons-material/PresentToAll";
import CommentIcon from "@mui/icons-material/Comment";
import PreviewIcon from "@mui/icons-material/Preview";

export default function LabelBottomNavigation() {
  const [value, setValue] = React.useState("recents");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <BottomNavigation
        sx={{ width: 500 }}
        value={value}
        onChange={handleChange}
      >
        <BottomNavigationAction
          label="麥克風啟動中"
          value="recents"
          icon={<MicIcon />}
          id="audioBtn"
        />
        <BottomNavigationAction
          label="麥克風啟動中"
          value="favorites"
          icon={<PreviewIcon />}
          id="VideoBtn"
        />
        <BottomNavigationAction
          label="麥克風啟動中"
          value="nearby"
          icon={<CommentIcon />}
          id="ChatBtn"
        />
        <BottomNavigationAction
          label="麥克風啟動中"
          value="folder"
          icon={<PresentToAllIcon />}
          id="shareScreen"
        />
      </BottomNavigation>
      <BottomNavigation
        sx={{ width: 500 }}
        value={value}
        onChange={handleChange}
      >
        <BottomNavigationAction
          label="麥克風啟動中"
          value="recents"
          icon={<MicIcon />}
          id="audioBtn"
        />
        <BottomNavigationAction
          label="麥克風啟動中"
          value="favorites"
          icon={<PreviewIcon />}
          id="VideoBtn"
        />
        <BottomNavigationAction
          label="麥克風啟動中"
          value="nearby"
          icon={<CommentIcon />}
          id="ChatBtn"
        />
        <BottomNavigationAction
          label="麥克風啟動中"
          value="folder"
          icon={<PresentToAllIcon />}
          id="shareScreen"
        />
      </BottomNavigation>
    </>
  );
}
