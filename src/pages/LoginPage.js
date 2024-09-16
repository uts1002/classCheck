// src/pages/LoginPage.js
import React, { useState, useContext } from "react";
import { Button, Container, Typography, TextField, Box } from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const result = login(username, password);
    if (result) {
      navigate("/checkboards"); // 로그인 성공 시 페이지 이동
    } else {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "10%" }}>
      <Typography variant="h4" gutterBottom>
        교실 관리 앱에 오신 것을 환영합니다
      </Typography>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          label="아이디"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="비밀번호"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          style={{ marginTop: "16px" }}
        >
          로그인
        </Button>
      </Box>
    </Container>
  );
}

export default LoginPage;
