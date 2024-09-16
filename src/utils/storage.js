// src/utils/storage.js

export const saveData = (key, data) => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error("데이터 저장 실패:", error);
  }
};

export const loadData = (key) => {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) return undefined;
    return JSON.parse(serializedData);
  } catch (error) {
    console.error("데이터 불러오기 실패:", error);
    return undefined;
  }
};
