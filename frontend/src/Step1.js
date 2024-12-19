import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Step1.css';
import MBTIPopup from './MBTIPopup';
import axios from 'axios';

function Step1({ updateProgress, mode = "signup" }) {
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [mbti, setMbti] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [showMBTIPopup, setShowMBTIPopup] = useState(false);

  const AUTH_API_URL = 'https://sgisapi.kostat.go.kr/OpenAPI3/auth/authentication.json';
  const REGION_API_URL = 'https://sgisapi.kostat.go.kr/OpenAPI3/addr/stage.json';
  const CONSUMER_KEY = 'b51e6fd37233422cb0a3';
  const CONSUMER_SECRET = '2992fa547d6a46ca8c2c';

  // 회원정보 수정 모드에서 사용자 데이터 로드
  useEffect(() => {
    if (mode === "edit") {
      setLoading(true);
      axios.get('/api/users/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
      })
          .then((response) => {
            const userData = response.data;
            setNickname(userData.nickname || '');
            setAge(userData.age || '');
            setGender(userData.gender || '');
            setMbti(userData.mbti || '');
            setSelectedRegion(userData.region || '');
            setSelectedCity(userData.city || '');
          })
          .catch((error) => {
            console.error("Failed to fetch user data:", error);
          })
          .finally(() => setLoading(false));
    }
  }, [mode]);

  // Access Token 가져오기
  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const response = await axios.get(AUTH_API_URL, {
          params: {
            consumer_key: CONSUMER_KEY,
            consumer_secret: CONSUMER_SECRET,
          },
        });
        if (response.data.result?.accessToken) {
          setAccessToken(response.data.result.accessToken);
        } else {
          console.error('Access Token을 가져오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error('Access Token API 호출 실패:', error);
      }
    };
    fetchAccessToken();
  }, []);

  // 첫 번째 드롭다운 데이터 로드
  useEffect(() => {
    const fetchRegions = async () => {
      if (!accessToken) return;
      try {
        const response = await axios.get(REGION_API_URL, {
          params: { accessToken },
        });
        if (response.data.result) setRegions(response.data.result);
      } catch (error) {
        console.error('첫 번째 드롭다운 데이터 로드 실패:', error);
      }
    };
    fetchRegions();
  }, [accessToken]);

  // 두 번째 드롭다운 데이터 로드
  useEffect(() => {
    const fetchCities = async () => {
      if (!accessToken || !selectedRegion) return;
      try {
        const response = await axios.get(REGION_API_URL, {
          params: { accessToken, cd: selectedRegion },
        });
        if (response.data.result) setCities(response.data.result);
      } catch (error) {
        console.error('두 번째 드롭다운 데이터 로드 실패:', error);
      }
    };
    fetchCities();
  }, [accessToken, selectedRegion]);

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
    setSelectedCity('');
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const handleSubmit = async () => {
    if (nickname && age && gender && selectedRegion && selectedCity) {
      try {
        const regionName = regions.find(region => region.cd === selectedRegion)?.addr_name;
        const payload = {
          nickname,
          age,
          gender,
          mbti,
          region: regionName,
          city: selectedCity,
        };

        if (mode === "signup") {
          // 회원가입 요청
          await axios.post('/api/users/save', payload);
          updateProgress(100);
          alert('회원가입이 완료되었습니다!');
          navigate('/step3');
        } else if (mode === "edit") {
          // 회원정보 수정 요청
          await axios.put('/api/users/update', payload, {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
          });
          alert('회원정보가 성공적으로 수정되었습니다!');
          navigate('/mypage');
        }
      } catch (error) {
        console.error('데이터 저장 실패:', error);
        alert('저장 중 문제가 발생했습니다.');
      }
    } else {
      alert('모든 필드를 입력해주세요.');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
      <div className="form-container">
        <h2>{mode === "signup" ? "회원가입 정보 입력" : "회원정보 수정"}</h2>
        <label>
          닉네임:
          <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
        </label>
        <label>
          나이:
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
        </label>
        <label>
          성별:
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">성별 선택</option>
            <option value="남성">남성</option>
            <option value="여성">여성</option>
          </select>
        </label>
        <label>
          MBTI:
          <button onClick={() => setShowMBTIPopup(true)}>
            {mbti || "MBTI 선택"}
          </button>
        </label>
        <label>
          거주지 선택:
          <select value={selectedRegion} onChange={handleRegionChange}>
            <option value="">지역 선택</option>
            {regions.map((region) => (
                <option key={region.cd} value={region.cd}>
                  {region.addr_name}
                </option>
            ))}
          </select>
        </label>
        {selectedRegion && (
            <label>
              세부 지역 선택:
              <select value={selectedCity} onChange={handleCityChange}>
                <option value="">세부 지역 선택</option>
                {cities.map((city) => (
                    <option key={city.cd} value={city.addr_name}>
                      {city.addr_name}
                    </option>
                ))}
              </select>
            </label>
        )}
        <button onClick={handleSubmit}>
          {mode === "signup" ? "회원가입 완료" : "회원정보 수정 완료"}
        </button>
        {showMBTIPopup && (
            <MBTIPopup
                onClose={() => setShowMBTIPopup(false)}
                onSelect={(selectedMBTI) => {
                  setMbti(selectedMBTI);
                  setShowMBTIPopup(false);
                }}
            />
        )}
      </div>
  );
}

export default Step1;
