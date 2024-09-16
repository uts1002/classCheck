// src/layouts/MainLayout.js

import React, { useContext } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Button,
  ListItemButton,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import CheckIcon from "@mui/icons-material/Check";
import { AuthContext } from "../contexts/AuthContext";

const drawerWidth = 240;

function MainLayout() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // 로그아웃 시 로그인 페이지로 이동
  };

  return (
    <div style={{ display: "flex" }}>
      {/* 사이드바 */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/settings">
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="학급 설정" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/checkboards">
              <ListItemIcon>
                <CheckIcon />
              </ListItemIcon>
              <ListItemText primary="체크판" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <Button variant="outlined" color="secondary" onClick={handleLogout}>
              로그아웃
            </Button>
          </ListItem>
        </List>
      </Drawer>

      {/* 메인 컨텐츠 */}
      <div style={{ flexGrow: 1, padding: 24 }}>
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              교실 관리 앱
            </Typography>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
