// src/pages/CheckboardRunPage.js

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Dialog,
  AppBar,
  Toolbar,
  TextField,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CloseIcon from "@mui/icons-material/Close";
import Menu from "@mui/icons-material/Menu"; // 올바른 아이콘 가져오기
import DeleteIcon from "@mui/icons-material/Delete";
import { loadData, saveData } from "../utils/storage";

function CheckboardRunPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [checkboard, setCheckboard] = useState(null);
  const [students, setStudents] = useState([]); // 선택된 학생 데이터
  const [checkedStudents, setCheckedStudents] = useState([]); // 체크된 학생 리스트
  const [seatLayout, setSeatLayout] = useState([]); // 좌석 배치
  const [seatRows, setSeatRows] = useState(0); // 좌석의 행 수
  const [seatColumns, setSeatColumns] = useState(0); // 좌석의 열 수
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); // 선택된 날짜
  const [savedCheckData, setSavedCheckData] = useState([]); // 저장된 체크 데이터 리스트
  const [selectedSaveTime, setSelectedSaveTime] = useState(""); // 불러올 시간대 선택
  const [displayMode, setDisplayMode] = useState("number"); // 표시 방식 (번호순 또는 자리배치)

  // 체크판 데이터와 학급 데이터를 불러오는 함수
  useEffect(() => {
    const savedCheckboards = loadData("checkboards") || [];
    const cb = savedCheckboards.find((cb) => cb.id === id);
    if (cb) {
      setCheckboard(cb);
      setDisplayMode(cb.displayMode || "number"); // 기본값은 번호순
      console.log("Loaded checkboard:", cb);
    } else {
      console.error("체크판을 찾을 수 없습니다.");
      return; // 체크판을 찾지 못하면 더 이상 진행하지 않음
    }

    const savedClassroomId = cb?.classroomId; // 체크판에 연결된 학급 ID 불러오기
    console.log("Associated classroomId:", savedClassroomId);

    if (savedClassroomId) {
      const savedClassrooms = loadData("classrooms") || [];
      const savedClass = savedClassrooms.find(
        (classroom) => classroom.id === savedClassroomId
      );

      if (savedClass) {
        // 선택된 학생들만 필터링
        const filteredStudents = savedClass.students.filter((student) =>
          cb.studentIds.includes(student.id)
        );
        setStudents(filteredStudents);

        // 좌석 배열도 선택된 학생들만 포함하도록 필터링
        const filteredSeatLayout = savedClass.seats.map((studentId) =>
          cb.studentIds.includes(studentId) ? studentId : null
        );
        setSeatLayout(filteredSeatLayout);

        setSeatRows(savedClass.seatRows || 0);
        setSeatColumns(savedClass.seatColumns || 0);
        console.log("Loaded classroom:", savedClass);
      } else {
        console.error("체크판이 속한 학급을 찾을 수 없습니다.");
      }
    }
  }, [id]);

  // 체크판의 날짜별 체크 데이터를 불러오는 함수
  useEffect(() => {
    if (checkboard) {
      const dateStr = selectedDate.toISOString().slice(0, 10);
      const savedData =
        loadData(`check_${checkboard.classroomId}_${id}_${dateStr}`) || [];
      setCheckedStudents(savedData);
      console.log(`Loaded checked students for ${dateStr}:`, savedData);

      // 시간대별 저장된 체크 데이터를 로드
      const timeSavedData =
        loadData(
          `checkboard_saves_${checkboard.classroomId}_${id}_${dateStr}`
        ) || [];
      setSavedCheckData(timeSavedData);
      console.log(`Loaded saved check data for ${dateStr}:`, timeSavedData);
    }
  }, [id, selectedDate, checkboard]);

  // 학생 체크 상태를 토글하는 함수
  const handleCheckStudent = (studentId) => {
    const updatedCheckedStudents = checkedStudents.includes(studentId)
      ? checkedStudents.filter((sid) => sid !== studentId)
      : [...checkedStudents, studentId];
    setCheckedStudents(updatedCheckedStudents);

    const dateStr = selectedDate.toISOString().slice(0, 10);
    saveData(
      `check_${checkboard.classroomId}_${id}_${dateStr}`,
      updatedCheckedStudents
    );
    console.log(
      `Saved checked students for ${dateStr}:`,
      updatedCheckedStudents
    );
  };

  // 체크 데이터를 시간대별로 저장하는 함수
  const handleSaveCheckData = () => {
    const dateStr = selectedDate.toISOString().slice(0, 10);
    const currentTime = new Date().toLocaleTimeString(); // 현재 시간 저장
    const dateTime = `${dateStr} ${currentTime}`; // 날짜와 시간 결합
    const newSavedData = [
      ...savedCheckData,
      { time: dateTime, data: checkedStudents },
    ];
    setSavedCheckData(newSavedData);

    // 시간대별 체크 데이터를 로컬 스토리지에 저장
    saveData(
      `checkboard_saves_${checkboard.classroomId}_${id}_${dateStr}`,
      newSavedData
    );
    alert(`체크판이 ${dateTime}에 저장되었습니다.`);
    console.log(`Saved check data at ${dateTime}:`, newSavedData);
  };

  // 저장된 체크 데이터를 불러오는 함수
  const handleLoadCheckData = (time) => {
    const savedEntry = savedCheckData.find((entry) => entry.time === time);
    if (savedEntry) {
      setCheckedStudents(savedEntry.data);
      console.log(`Loaded check data at ${time}:`, savedEntry.data);
    }
  };

  // 전체화면 토글 함수
  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    console.log(`Fullscreen mode: ${!isFullscreen}`);
  };

  // 저장된 체크 데이터를 삭제하는 함수
  const handleDeleteCheckData = (indexToDelete) => {
    const updatedCheckData = savedCheckData.filter(
      (_, index) => index !== indexToDelete
    );
    setSavedCheckData(updatedCheckData);

    // 로컬 스토리지 업데이트
    const dateStr = selectedDate.toISOString().slice(0, 10);
    saveData(
      `checkboard_saves_${checkboard.classroomId}_${id}_${dateStr}`,
      updatedCheckData
    );
    alert("저장된 체크 데이터가 삭제되었습니다.");
    console.log(
      `Deleted check data at index ${indexToDelete}:`,
      updatedCheckData
    );
  };

  // 번호순으로 학생들을 렌더링하는 함수
  const renderStudentsByNumber = () => {
    if (students.length === 0) {
      return <Typography>학생 데이터가 없습니다.</Typography>;
    }

    // 학생들을 번호순으로 정렬
    const sortedStudents = [...students].sort((a, b) => a.number - b.number);

    return sortedStudents.map((student) => (
      <Grid item xs={12} sm={6} md={4} key={student.id}>
        <Card
          onClick={() => handleCheckStudent(student.id)}
          style={{
            backgroundColor: checkedStudents.includes(student.id)
              ? "#d1e7dd"
              : "#fff",
            cursor: "pointer",
          }}
        >
          <CardContent>
            <Typography variant="h6">
              {student.number}. {student.name}
            </Typography>
            <Typography variant="body2">
              {checkedStudents.includes(student.id) ? "완료" : "미완료"}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ));
  };

  // 좌석 배치에 따라 학생들을 렌더링하는 함수
  const renderStudentsBySeatLayout = () => {
    if (seatLayout.length === 0 || students.length === 0) {
      return <Typography>좌석 배열 또는 학생 데이터가 없습니다.</Typography>;
    }

    return seatLayout.map((studentId, index) => {
      const student = students.find((s) => s.id === studentId); // 학생 찾기

      return (
        <Grid item xs={12 / seatColumns} key={index}>
          {student ? (
            <Card
              onClick={() => handleCheckStudent(student.id)}
              style={{
                backgroundColor: checkedStudents.includes(student.id)
                  ? "#d1e7dd"
                  : "#fff",
                height: "150px",
                cursor: "pointer",
              }}
            >
              <CardContent>
                <Typography variant="h6">
                  {student.number}. {student.name}
                </Typography>
                <Typography variant="body2">
                  {checkedStudents.includes(student.id) ? "완료" : "미완료"}
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Card
              style={{
                backgroundColor: "lightgrey",
                height: "150px",
              }}
            >
              <CardContent>
                <Typography variant="h6"></Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      );
    });
  };

  // 표시 방식에 따라 학생 렌더링 함수 선택
  const renderStudents = () => {
    if (displayMode === "seat") {
      return renderStudentsBySeatLayout();
    } else if (displayMode === "number") {
      return renderStudentsByNumber();
    } else {
      return <Typography>알 수 없는 표시 방식입니다.</Typography>;
    }
  };

  if (!checkboard) return <Typography>체크판을 찾을 수 없습니다.</Typography>;

  return (
    <div>
      {/* 전체화면 아이콘 */}
      <IconButton onClick={handleToggleFullscreen} style={{ float: "right" }}>
        <FullscreenIcon />
      </IconButton>
      {/* 체크판 목록으로 돌아가는 아이콘 */}
      <IconButton
        style={{ float: "left" }}
        onClick={() => navigate("/checkboards")} // 체크판 목록으로 이동
      >
        <Menu />
      </IconButton>
      {isFullscreen ? (
        <Dialog fullScreen open={isFullscreen} onClose={handleToggleFullscreen}>
          <AppBar>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleToggleFullscreen}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" style={{ flex: 1, textAlign: "center" }}>
                {checkboard.name}
              </Typography>
            </Toolbar>
          </AppBar>
          <div style={{ marginTop: "64px", padding: "16px" }}>
            <Grid container spacing={2}>
              {renderStudents()}
            </Grid>
            <Box
              display="flex"
              gap={2}
              marginTop="20px"
              flexWrap="wrap"
              justifyContent="flex-start"
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setCheckedStudents([]);
                  const dateStr = selectedDate.toISOString().slice(0, 10);
                  saveData(
                    `check_${checkboard.classroomId}_${id}_${dateStr}`,
                    []
                  );
                  console.log(`Initialized checked students for ${dateStr}`);
                }}
              >
                초기화
              </Button>

              <Button
                variant="outlined"
                color="primary"
                onClick={handleSaveCheckData}
              >
                저장
              </Button>
            </Box>
          </div>
        </Dialog>
      ) : (
        <div>
          <Typography variant="h4" align="center" gutterBottom>
            {checkboard.name}
          </Typography>
          <Grid container spacing={2}>
            {renderStudents()}
          </Grid>
          <Box
            display="flex"
            gap={2}
            marginTop="20px"
            flexWrap="wrap"
            justifyContent="flex-start"
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                setCheckedStudents([]);
                const dateStr = selectedDate.toISOString().slice(0, 10);
                saveData(
                  `check_${checkboard.classroomId}_${id}_${dateStr}`,
                  []
                );
                console.log(`Initialized checked students for ${dateStr}`);
              }}
            >
              초기화
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              onClick={handleSaveCheckData}
            >
              저장
            </Button>
          </Box>

          {/* 저장된 체크 데이터를 불러오는 섹션 */}
          <Box marginTop="20px" width="20%">
            <Select
              value={selectedSaveTime}
              onChange={(e) => {
                const selectedTime = e.target.value;
                setSelectedSaveTime(selectedTime);
                handleLoadCheckData(selectedTime); // 선택하자마자 불러오기
              }}
              displayEmpty
              fullWidth
            >
              <MenuItem value="" disabled>
                저장된 시간대 선택
              </MenuItem>
              {savedCheckData.map((entry, index) => (
                <MenuItem
                  key={entry.time}
                  value={entry.time}
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>{entry.time}</span>
                  {/* 삭제 버튼 */}
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={(e) => {
                      e.stopPropagation(); // 드롭다운 열림 방지
                      handleDeleteCheckData(index);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </MenuItem>
              ))}
            </Select>
          </Box>
        </div>
      )}
    </div>
  );
}

export default CheckboardRunPage;
