// src/pages/ClassroomSettingsPage.js

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Grid,
  FormControl,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { saveData, loadData } from "../utils/storage";

function ClassroomSettingsPage() {
  const { classroomId } = useParams();
  const navigate = useNavigate();

  const [classrooms, setClassrooms] = useState([]);
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [seatRows, setSeatRows] = useState(0);
  const [seatColumns, setSeatColumns] = useState(0);
  const [seats, setSeats] = useState([]);
  const [multiStudentInput, setMultiStudentInput] = useState("");
  const [isMain, setIsMain] = useState(false);

  useEffect(() => {
    const loadedClassrooms = loadData("classrooms") || [];
    setClassrooms(loadedClassrooms);
    const currentClassroom = loadedClassrooms.find((c) => c.id === classroomId);
    if (currentClassroom) {
      setClassroom(currentClassroom);
      setStudents(currentClassroom.students || []);
      setSeats(currentClassroom.seats || []);
      setSeatRows(currentClassroom.seatRows || 0);
      setSeatColumns(currentClassroom.seatColumns || 0);
      setIsMain(currentClassroom.isMain || false);
    } else {
      alert("존재하지 않는 학급입니다.");
      navigate("/settings");
    }
  }, [classroomId, navigate]);

  const handleSave = () => {
    const updatedClassrooms = classrooms.map((c) =>
      c.id === classroomId
        ? { ...c, students, seats, seatRows, seatColumns, isMain }
        : c
    );
    setClassrooms(updatedClassrooms);
    saveData("classrooms", updatedClassrooms);

    // 메인 학급 설정 시 mainClassroomId 업데이트
    if (isMain) {
      saveData("mainClassroomId", classroomId);
      // 다른 학급의 isMain을 false로 설정
      const finalClassrooms = updatedClassrooms.map((c) =>
        c.id === classroomId ? { ...c, isMain: true } : { ...c, isMain: false }
      );
      setClassrooms(finalClassrooms);
      saveData("classrooms", finalClassrooms);
    }

    alert("설정이 저장되었습니다.");
    navigate("/settings");
  };

  const handleAddMultipleStudents = () => {
    const studentLines = multiStudentInput.split("\n");
    const newStudents = studentLines
      .map((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine === "") return null;
        const firstSpaceIndex = trimmedLine.indexOf(" ");
        if (firstSpaceIndex === -1) {
          alert(
            `입력 형식 오류: "${line}". "번호 이름" 형식으로 입력해주세요.`
          );
          return null;
        }
        const numberPart = trimmedLine.substring(0, firstSpaceIndex);
        const namePart = trimmedLine.substring(firstSpaceIndex + 1).trim();
        if (!numberPart || !namePart) {
          alert(
            `입력 형식 오류: "${line}". "번호 이름" 형식으로 입력해주세요.`
          );
          return null;
        }
        const number = parseInt(numberPart);
        if (isNaN(number)) {
          alert(`번호가 유효하지 않습니다: "${numberPart}"`);
          return null;
        }
        return {
          id: `student-${Date.now()}-${index}`,
          number: number,
          name: namePart,
        };
      })
      .filter((student) => student !== null);

    const existingNumbers = new Set(students.map((student) => student.number));
    const filteredNewStudents = newStudents.filter((student) => {
      if (existingNumbers.has(student.number)) {
        alert(
          `번호 ${student.number}은 이미 존재합니다. 중복되는 학생을 추가할 수 없습니다.`
        );
        return false;
      }
      return true;
    });

    const updatedStudents = [...students, ...filteredNewStudents];
    setStudents(updatedStudents);

    const updatedClassrooms = classrooms.map((c) =>
      c.id === classroomId ? { ...c, students: updatedStudents } : c
    );
    setClassrooms(updatedClassrooms);
    saveData("classrooms", updatedClassrooms);

    setMultiStudentInput("");
  };

  const handleDeleteStudent = (studentId) => {
    const newStudents = students.filter((student) => student.id !== studentId);
    setStudents(newStudents);
    const newSeats = seats.map((seat) => (seat === studentId ? null : seat));
    setSeats(newSeats);

    const updatedClassrooms = classrooms.map((c) =>
      c.id === classroomId
        ? { ...c, students: newStudents, seats: newSeats }
        : c
    );
    setClassrooms(updatedClassrooms);
    saveData("classrooms", updatedClassrooms);
  };

  const handleSetSeats = () => {
    if (seatRows <= 0 || seatColumns <= 0) {
      alert("행과 열의 수를 올바르게 입력하세요.");
      return;
    }
    const totalSeats = seatRows * seatColumns;
    const newSeats = Array(totalSeats).fill(null);
    setSeats(newSeats);

    const updatedClassrooms = classrooms.map((c) =>
      c.id === classroomId
        ? { ...c, seats: newSeats, seatRows, seatColumns }
        : c
    );
    setClassrooms(updatedClassrooms);
    saveData("classrooms", updatedClassrooms);
  };

  const handleSeatChange = (studentId, seatIndex) => {
    const updatedSeats = [...seats];
    updatedSeats[seatIndex] = studentId;
    setSeats(updatedSeats);

    const updatedClassrooms = classrooms.map((c) =>
      c.id === classroomId ? { ...c, seats: updatedSeats } : c
    );
    setClassrooms(updatedClassrooms);
    saveData("classrooms", updatedClassrooms);
  };

  const getAvailableStudents = (currentSeatIndex) => {
    const assignedStudents = new Set(
      seats
        .map((seat, index) => (index !== currentSeatIndex ? seat : null))
        .filter((seat) => seat !== null)
    );
    const currentStudentId = seats[currentSeatIndex];
    return students.filter(
      (student) =>
        !assignedStudents.has(student.id) || student.id === currentStudentId
    );
  };

  const handleToggleMain = () => {
    setIsMain((prev) => !prev);
  };

  return (
    <div>
      <Box display="flex" alignItems="center" marginBottom={2}>
        <IconButton onClick={() => navigate("/settings")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" gutterBottom>
          {classroom?.name} 설정
        </Typography>
      </Box>

      <Typography variant="h6" gutterBottom>
        기본 설정
      </Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={isMain}
            onChange={handleToggleMain}
            color="primary"
          />
        }
        label="메인 학급으로 설정"
      />

      <Typography variant="h6" gutterBottom marginTop={4}>
        학생 관리
      </Typography>
      <TextField
        label="학생 추가 (번호 이름)"
        multiline
        rows={4}
        value={multiStudentInput}
        onChange={(e) => setMultiStudentInput(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddMultipleStudents}
      >
        학생 추가
      </Button>
      <List>
        {students.map((student) => (
          <ListItem key={student.id}>
            <ListItemText primary={`${student.number}. ${student.name}`} />
            <IconButton
              edge="end"
              onClick={() => handleDeleteStudent(student.id)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" gutterBottom marginTop={4}>
        좌석 배치
      </Typography>
      <Box display="flex" alignItems="center" gap={2} marginBottom={2}>
        <TextField
          label="행"
          type="number"
          value={seatRows}
          onChange={(e) => setSeatRows(parseInt(e.target.value) || 0)}
          variant="outlined"
        />
        <TextField
          label="열"
          type="number"
          value={seatColumns}
          onChange={(e) => setSeatColumns(parseInt(e.target.value) || 0)}
          variant="outlined"
        />
        <Button variant="contained" color="primary" onClick={handleSetSeats}>
          좌석 설정
        </Button>
      </Box>
      <Grid container spacing={2}>
        {seats.map((studentId, index) => (
          <Grid item key={index} xs={12 / seatColumns}>
            <FormControl fullWidth>
              <Select
                value={studentId || ""}
                onChange={(e) => handleSeatChange(e.target.value, index)}
                displayEmpty
                variant="outlined"
              >
                <MenuItem value="">
                  <em>비어있음</em>
                </MenuItem>
                {getAvailableStudents(index).map((student) => (
                  <MenuItem key={student.id} value={student.id}>
                    {student.number}. {student.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        ))}
      </Grid>

      <Box display="flex" justifyContent="flex-end" marginTop={4}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          저장
        </Button>
      </Box>
    </div>
  );
}

export default ClassroomSettingsPage;
