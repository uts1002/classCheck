// src/pages/SettingsPage.js

import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Checkbox,
  FormControlLabel,
  IconButton,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import { saveData, loadData } from "../utils/storage";
import { useNavigate } from "react-router-dom";

function SettingsPage() {
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const [classrooms, setClassrooms] = useState([]); // 모든 학급 목록
  const [newClassroomName, setNewClassroomName] = useState(""); // 새 학급 이름 입력
  const [isAdding, setIsAdding] = useState(false); // 학급 추가 입력창 표시 여부

  // 데이터 로드
  useEffect(() => {
    const loadedClassrooms = loadData("classrooms") || [];
    setClassrooms(loadedClassrooms);
  }, []);

  // 메인 학급 ID 로드
  const getMainClassroomId = () => loadData("mainClassroomId") || "";

  // 학급 추가 버튼 클릭 시 입력창 표시
  const handleAddClassroomClick = () => {
    setIsAdding(true);
  };

  // 학급 추가 처리
  const handleAddClassroom = () => {
    if (!newClassroomName.trim()) {
      alert("학급 이름을 입력해 주세요.");
      return;
    }
    const newClassroom = {
      id: `classroom-${Date.now()}`,
      name: newClassroomName,
      students: [],
      seats: [],
      seatRows: 0,
      seatColumns: 0,
      isMain: classrooms.length === 0, // 첫 학급은 메인 학급으로 설정
    };
    const updatedClassrooms = [...classrooms, newClassroom];
    setClassrooms(updatedClassrooms);
    saveData("classrooms", updatedClassrooms);

    // 첫 학급일 경우 메인 학급으로 설정
    if (newClassroom.isMain) {
      saveData("mainClassroomId", newClassroom.id);
    }

    setNewClassroomName("");
    setIsAdding(false);
  };

  // 학급 삭제 처리
  const handleDeleteClassroom = (classroomId) => {
    const updatedClassrooms = classrooms.filter((c) => c.id !== classroomId);
    setClassrooms(updatedClassrooms);
    saveData("classrooms", updatedClassrooms);

    const mainClassroomId = getMainClassroomId();
    if (mainClassroomId === classroomId) {
      if (updatedClassrooms.length > 0) {
        const newMain = updatedClassrooms[0];
        saveData("mainClassroomId", newMain.id);
      } else {
        saveData("mainClassroomId", "");
      }
    }
  };

  // 메인 학급 설정
  const handleSetMainClassroom = (classroomId) => {
    const updatedClassrooms = classrooms.map((c) => ({
      ...c,
      isMain: c.id === classroomId,
    }));
    setClassrooms(updatedClassrooms);
    saveData("classrooms", updatedClassrooms);
    saveData("mainClassroomId", classroomId);
  };

  // 학급 설정 페이지로 이동
  const handleOpenClassroomSettings = (classroomId) => {
    navigate(`/settings/${classroomId}`);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        학급 설정
      </Typography>
      <Box display="flex" alignItems="center" gap={2} marginBottom={2}>
        {/* 학급 카드 목록 */}
        <Grid container spacing={2}>
          {classrooms.map((classroom) => (
            <Grid item xs={12} sm={6} md={4} key={classroom.id}>
              <Card
                variant={classroom.isMain ? "outlined" : "elevation"}
                style={{
                  borderColor: classroom.isMain ? "blue" : undefined,
                  cursor: "pointer",
                }}
                onClick={() => handleOpenClassroomSettings(classroom.id)} // 클릭 시 설정 페이지로 이동
              >
                <CardContent>
                  <Typography variant="h6">{classroom.name}</Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={classroom.isMain}
                        onChange={(e) => {
                          e.stopPropagation(); // 카드 클릭 이벤트 방지
                          handleSetMainClassroom(classroom.id);
                        }}
                        color="primary"
                      />
                    }
                    label="메인 학급"
                  />
                </CardContent>
                <CardActions>
                  <IconButton
                    size="small"
                    color="secondary"
                    onClick={(e) => {
                      e.stopPropagation(); // 카드 클릭 이벤트 방지
                      handleDeleteClassroom(classroom.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        {/* 학급 추가 버튼 */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddClassroomClick}
        >
          학급 추가
        </Button>
      </Box>

      {/* 학급 추가 입력창 */}
      {isAdding && (
        <Box display="flex" alignItems="center" gap={2} marginBottom={2}>
          <TextField
            label="새 학급 이름"
            value={newClassroomName}
            onChange={(e) => setNewClassroomName(e.target.value)}
            variant="outlined"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddClassroom}
          >
            추가
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setIsAdding(false)}
          >
            취소
          </Button>
        </Box>
      )}
    </div>
  );
}

export default SettingsPage;
