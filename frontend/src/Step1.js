import React, { useState, useEffect } from "react";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Step1({ updateProgress, mode = "signup" }) {
  const [nickname, setNickname] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [mbti, setMbti] = useState("");
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMBTIPopup, setShowMBTIPopup] = useState(false);
  const navigate = useNavigate();

  const AUTH_API_URL = "https://sgisapi.kostat.go.kr/OpenAPI3/auth/authentication.json";
  const REGION_API_URL = "https://sgisapi.kostat.go.kr/OpenAPI3/addr/stage.json";
  const CONSUMER_KEY = "b51e6fd37233422cb0a3";
  const CONSUMER_SECRET = "2992fa547d6a46ca8c2c";

  useEffect(() => {
    if (mode === "edit") {
      setLoading(true);
      axios
          .get("/api/users/me", {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
          })
          .then((response) => {
            const userData = response.data;
            setNickname(userData.nickname || "");
            setAge(userData.age || "");
            setGender(userData.gender || "");
            setMbti(userData.mbti || "");
            setSelectedRegion(userData.region || "");
            setSelectedCity(userData.city || "");
          })
          .catch((error) => console.error("Failed to fetch user data:", error))
          .finally(() => setLoading(false));
    }
  }, [mode]);

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
    setSelectedCity("");
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  const handleSubmit = () => {
    if (!nickname || !age || !gender || !selectedRegion || !selectedCity) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const payload = {
      nickname,
      age,
      gender,
      mbti,
      region: selectedRegion,
      city: selectedCity,
    };

    if (mode === "signup") {
      axios
          .post("/api/users/save", payload)
          .then(() => {
            alert("회원가입이 완료되었습니다!");
            navigate("/step3");
          })
          .catch((error) => {
            console.error("Error during signup:", error);
            alert("회원가입에 실패했습니다.");
          });
    } else {
      axios
          .put("/api/users/update", payload, {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
          })
          .then(() => {
            alert("회원정보가 성공적으로 수정되었습니다!");
            navigate("/mypage");
          })
          .catch((error) => {
            console.error("Error during update:", error);
            alert("회원정보 수정에 실패했습니다.");
          });
    }
  };

  if (loading) {
    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <CircularProgress />
        </Box>
    );
  }

  return (
      <Box
          sx={{
            maxWidth: 600,
            mx: "auto",
            mt: 4,
            p: 3,
            borderRadius: 2,
            boxShadow: 3,
            bgcolor: "background.paper",
          }}
      >
        <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
          {mode === "signup" ? "회원가입 정보 입력" : "회원정보 수정"}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
                fullWidth
                label="닉네임"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
                fullWidth
                type="number"
                label="나이"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <Select
                fullWidth
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                displayEmpty
                variant="outlined"
            >
              <MenuItem value="">
                <em>성별 선택</em>
              </MenuItem>
              <MenuItem value="남성">남성</MenuItem>
              <MenuItem value="여성">여성</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12}>
            <Button variant="outlined" fullWidth onClick={() => setShowMBTIPopup(true)}>
              {mbti || "MBTI 선택"}
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Select
                fullWidth
                value={selectedRegion}
                onChange={handleRegionChange}
                displayEmpty
                variant="outlined"
            >
              <MenuItem value="">
                <em>지역 선택</em>
              </MenuItem>
              {regions.map((region) => (
                  <MenuItem key={region.cd} value={region.addr_name}>
                    {region.addr_name}
                  </MenuItem>
              ))}
            </Select>
          </Grid>

          {selectedRegion && (
              <Grid item xs={12}>
                <Select
                    fullWidth
                    value={selectedCity}
                    onChange={handleCityChange}
                    displayEmpty
                    variant="outlined"
                >
                  <MenuItem value="">
                    <em>세부 지역 선택</em>
                  </MenuItem>
                  {cities.map((city) => (
                      <MenuItem key={city.cd} value={city.addr_name}>
                        {city.addr_name}
                      </MenuItem>
                  ))}
                </Select>
              </Grid>
          )}

          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
              {mode === "signup" ? "회원가입 완료" : "회원정보 수정 완료"}
            </Button>
          </Grid>
        </Grid>

        <Dialog open={showMBTIPopup} onClose={() => setShowMBTIPopup(false)}>
          <DialogTitle>MBTI 선택</DialogTitle>
          <DialogContent>
            <Typography>MBTI 선택 팝업 내용</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowMBTIPopup(false)}>닫기</Button>
          </DialogActions>
        </Dialog>
      </Box>
  );
}

export default Step1;
