import { Box, useMediaQuery } from "@mui/material";
import Navbar from "../components/common/Navbar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/common/Sidebar";
import { useGetUserQuery } from "../state/api";
import { useSelector } from "react-redux";

const Layout = () => {
  const isNoneMobile = useMediaQuery("(min-width: 600px");
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const userId = useSelector((state) => state.global.userId);
  const { data } = useGetUserQuery(userId);
  // console.log(data.user)

  return (
    <Box display={isNoneMobile ? "flex" : "block"} width="100%" height="100%">
      <Sidebar
        user={data?.user || {}}
        isNoneMobile={isNoneMobile}
        drawerWidth="250px"
        isSideBarOpen={isSideBarOpen}
        setIsSideBarOpen={setIsSideBarOpen}
      />
      <Box sx={{ flexGrow: "1" }}>
        <Navbar
          user={data?.user || {}}
          isSideBarOpen={isSideBarOpen}
          setIsSideBarOpen={setIsSideBarOpen}
        />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
