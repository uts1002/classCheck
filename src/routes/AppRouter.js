// src/routes/AppRouter.js

import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../pages/LoginPage";
import SettingsPage from "../pages/SettingsPage";
import ClassroomSettingsPage from "../pages/ClassroomSettingsPage";
import CheckboardListPage from "../pages/CheckboardListPage";
import CheckboardDetailPage from "../pages/CheckboardDetailPage";
import CheckboardRunPage from "../pages/CheckboardRunPage";
import CreateCheckboardPage from "../pages/CreateCheckboardPage"; // 새로 추가
import { AuthContext } from "../contexts/AuthContext";

function AppRouter() {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated === null) {
    // 로딩 중인 경우 아무 것도 렌더링하지 않습니다.
    return null;
  }

  return (
    <Routes>
      {/* 로그인 페이지 */}
      <Route path="/login" element={<LoginPage />} />
      {/* 인증된 사용자만 접근 가능 */}
      {isAuthenticated ? (
        <>
          <Route element={<MainLayout />}>
            <Route path="/settings" element={<SettingsPage />} />
            <Route
              path="/settings/:classroomId"
              element={<ClassroomSettingsPage />}
            />
            <Route path="/checkboards" element={<CheckboardListPage />} />
            <Route
              path="/checkboards/create"
              element={<CreateCheckboardPage />}
            />{" "}
            {/* 추가 */}
            <Route path="/checkboards/:id" element={<CheckboardDetailPage />} />
            <Route
              path="/checkboards/:id/run"
              element={<CheckboardRunPage />}
            />
            <Route path="/" element={<Navigate to="/checkboards" replace />} />
          </Route>
          {/* 인증된 사용자가 로그인 페이지에 접근하려고 하면 체크판 목록으로 리다이렉트 */}
          <Route
            path="/login"
            element={<Navigate to="/checkboards" replace />}
          />
        </>
      ) : (
        // 인증되지 않은 경우 모든 경로를 로그인 페이지로 리다이렉트
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
}

export default AppRouter;
