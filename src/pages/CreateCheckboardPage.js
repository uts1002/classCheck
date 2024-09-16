// src/pages/CreateCheckboardPage.js

import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { loadData, saveData } from "../utils/storage";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";

function CreateCheckboardPage() {
  const navigate = useNavigate();
  const [checkboardName, setCheckboardName] = useState("");
  const [displayMode, setDisplayMode] = useState("number");
  const [mainClassroomId, setMainClassroomId] = useState("");

  useEffect(() => {
    const savedMainClassroomId = loadData("mainClassroomId") || "";
    setMainClassroomId(savedMainClassroomId);
  }, []);

  const handleCreate = () => {
    if (!checkboardName.trim()) {
      alert("체크판 이름을 입력해주세요.");
      return;
    }
    if (!mainClassroomId) {
      alert("메인 학급이 설정되지 않았습니다.");
      return;
    }

    const newCheckboard = {
      id: `checkboard-${Date.now()}`,
      name: checkboardName,
      displayMode: displayMode,
      studentIds: [],
      classroomId: mainClassroomId,
    };

    const savedCheckboards = loadData("checkboards") || [];
    saveData("checkboards", [...savedCheckboards, newCheckboard]);

    alert("체크판이 생성되었습니다.");
    navigate("/checkboards");
  };

  return (
    <div>
      <Box display="flex" alignItems="center" marginBottom={2}>
        <IconButton onClick={() => navigate("/checkboards")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">체크판 생성</Typography>
      </Box>

      <TextField
        label="체크판 이름"
        value={checkboardName}
        onChange={(e) => setCheckboardName(e.target.value)}
        fullWidth
        margin="normal"
      />

      <FormControl component="fieldset" margin="normal">
        <Typography variant="subtitle1">표시 방식 선택</Typography>
        <RadioGroup
          row
          value={displayMode}
          onChange={(e) => setDisplayMode(e.target.value)}
        >
          <FormControlLabel value="number" control={<Radio />} label="번호순" />
          <FormControlLabel value="seat" control={<Radio />} label="자리배치" />
        </RadioGroup>
      </FormControl>

      <Box display="flex" justifyContent="flex-end" marginTop={4}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleCreate}
        >
          생성
        </Button>
      </Box>
    </div>
  );
}

export default CreateCheckboardPage;
