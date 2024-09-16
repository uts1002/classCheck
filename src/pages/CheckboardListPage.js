// src/pages/CheckboardListPage.js

import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  IconButton,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { loadData, saveData } from "../utils/storage";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import AddIcon from "@mui/icons-material/Add";

function CheckboardListPage() {
  const navigate = useNavigate();
  const [checkboards, setCheckboards] = useState([]);
  const [mainClassroomId, setMainClassroomId] = useState("");

  useEffect(() => {
    const fetchCheckboards = () => {
      const savedCheckboards = loadData("checkboards") || [];
      const savedMainClassroomId = loadData("mainClassroomId") || "";
      setMainClassroomId(savedMainClassroomId);

      // 메인 학급에 속한 체크판만 필터링
      const filteredCheckboards = savedCheckboards.filter(
        (cb) => cb.classroomId === savedMainClassroomId
      );
      setCheckboards(filteredCheckboards);
    };

    fetchCheckboards();

    // 로컬 스토리지의 mainClassroomId가 변경될 때마다 체크판 목록 업데이트
    const handleStorageChange = () => {
      fetchCheckboards();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleDelete = (id) => {
    const savedCheckboards = loadData("checkboards") || [];
    const updatedCheckboards = savedCheckboards.filter((cb) => cb.id !== id);
    saveData("checkboards", updatedCheckboards);
    setCheckboards(
      updatedCheckboards.filter((cb) => cb.classroomId === mainClassroomId)
    );
  };

  const handleEdit = (id) => {
    navigate(`/checkboards/${id}`);
  };

  const handleOpen = (id) => {
    navigate(`/checkboards/${id}/run`);
  };

  const handleCreate = () => {
    navigate("/checkboards/create");
  };

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={2}
      >
        <Typography variant="h5">체크판 목록</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          체크판 생성
        </Button>
      </Box>
      <Grid container spacing={2}>
        {checkboards.map((checkboard) => (
          <Grid item xs={12} sm={6} md={4} key={checkboard.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {checkboard.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  표시 방식:{" "}
                  {checkboard.displayMode === "number" ? "번호순" : "자리배치"}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  color="primary"
                  onClick={() => handleOpen(checkboard.id)}
                  aria-label="open"
                >
                  <OpenInNewIcon />
                </IconButton>
                <IconButton
                  color="primary"
                  onClick={() => handleEdit(checkboard.id)}
                  aria-label="edit"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => handleDelete(checkboard.id)}
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {checkboards.length === 0 && (
        <Typography variant="body1">
          메인 학급에 속한 체크판이 없습니다.
        </Typography>
      )}
    </div>
  );
}

export default CheckboardListPage;
