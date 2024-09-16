// src/pages/CheckboardDetailPage.js

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  TextField,
  List,
  ListItem,
  Checkbox,
  Button,
  FormControlLabel,
  RadioGroup,
  Radio,
  IconButton,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { loadData, saveData } from "../utils/storage";

function CheckboardDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [checkboard, setCheckboard] = useState(null);
  const [students, setStudents] = useState([]);
  const [displayMode, setDisplayMode] = useState("number"); // 번호순 또는 자리배치
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [checkboardName, setCheckboardName] = useState("");
  const [classroom, setClassroom] = useState(null); // 학급 정보

  useEffect(() => {
    // 체크판 데이터 로드
    const savedCheckboards = loadData("checkboards") || [];
    const cb = savedCheckboards.find((cb) => cb.id === id);
    if (cb) {
      setCheckboard(cb);
      setDisplayMode(cb.displayMode || "number"); // 기본값은 번호순
      setSelectedStudents(cb.studentIds || []);
      setCheckboardName(cb.name);

      // 체크판이 속한 학급 로드
      if (cb.classroomId) {
        const classrooms = loadData("classrooms") || [];
        const cl = classrooms.find((c) => c.id === cb.classroomId);
        if (cl) {
          setClassroom(cl);
          setStudents(cl.students || []);
        } else {
          alert("체크판이 속한 학급을 찾을 수 없습니다.");
        }
      } else {
        alert("체크판에 학급 정보가 없습니다.");
      }
    } else {
      alert("체크판을 찾을 수 없습니다.");
      navigate("/checkboards");
    }
  }, [id, navigate]);

  const handleToggleStudent = (studentId) => {
    const updatedStudentIds = selectedStudents.includes(studentId)
      ? selectedStudents.filter((sid) => sid !== studentId)
      : [...selectedStudents, studentId];
    setSelectedStudents(updatedStudentIds);

    const updatedCheckboard = { ...checkboard, studentIds: updatedStudentIds };
    setCheckboard(updatedCheckboard);

    const savedCheckboards = loadData("checkboards") || [];
    const updatedCheckboards = savedCheckboards.map((cb) =>
      cb.id === id ? updatedCheckboard : cb
    );
    saveData("checkboards", updatedCheckboards);
  };

  const handleSave = () => {
    const updatedCheckboard = {
      ...checkboard,
      name: checkboardName,
      displayMode,
      studentIds: selectedStudents,
    };
    setCheckboard(updatedCheckboard);

    const savedCheckboards = loadData("checkboards") || [];
    const updatedCheckboards = savedCheckboards.map((cb) =>
      cb.id === id ? updatedCheckboard : cb
    );
    saveData("checkboards", updatedCheckboards);

    alert("설정이 저장되었습니다.");
    navigate("/checkboards");
  };

  const handleDisplayModeChange = (event) => {
    setDisplayMode(event.target.value);
  };

  if (!checkboard) return <Typography>체크판을 찾을 수 없습니다.</Typography>;

  return (
    <div>
      <Box display="flex" alignItems="center" marginBottom={2}>
        <IconButton onClick={() => navigate("/checkboards")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" gutterBottom>
          체크판 설정
        </Typography>
      </Box>

      <TextField
        label="체크판 이름"
        value={checkboardName}
        onChange={(e) => setCheckboardName(e.target.value)}
        fullWidth
        margin="normal"
      />

      {/* 표시 방식 선택 */}
      <Typography variant="subtitle1">표시 방식 선택</Typography>
      <RadioGroup row value={displayMode} onChange={handleDisplayModeChange}>
        <FormControlLabel value="number" control={<Radio />} label="번호순" />
        <FormControlLabel value="seat" control={<Radio />} label="자리배치" />
      </RadioGroup>

      <Typography variant="h6" gutterBottom marginTop={4}>
        학생 명단
      </Typography>
      <List>
        {students.map((student) => (
          <ListItem
            key={student.id}
            button
            onClick={() => handleToggleStudent(student.id)}
          >
            <Checkbox
              checked={selectedStudents.includes(student.id)}
              tabIndex={-1}
              disableRipple
            />
            <Typography>{`${student.number}. ${student.name}`}</Typography>
          </ListItem>
        ))}
      </List>

      <Box display="flex" justifyContent="flex-end" marginTop={4}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          저장
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/checkboards")}
          style={{ marginLeft: "10px" }}
        >
          취소
        </Button>
      </Box>
    </div>
  );
}

export default CheckboardDetailPage;
