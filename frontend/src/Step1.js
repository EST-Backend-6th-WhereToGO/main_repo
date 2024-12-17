import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Step1.css';
import axios from 'axios';

function Step1({ updateProgress }) {
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [mbti, setMbti] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [regions, setRegions] = useState([]); // 첫 번째 드롭다운 데이터
  const [selectedRegion, setSelectedRegion] = useState('');
  const [cities, setCities] = useState([]); // 두 번째 드롭다운 데이터
  const [selectedCity, setSelectedCity] = useState('');
  const [token, setToken] = useState(''); // sub 값을 token으로 저장
  const navigate = useNavigate();
  const location = useLocation();

  // URL 파라미터에서 값 추출
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');
  const name = queryParams.get('name');
  const sub = queryParams.get('sub');

  // 초기값 설정 (name → 닉네임, sub → token)
  useEffect(() => {
    if (name) setNickname(name); // name 값이 있으면 닉네임 초기화
    if (sub) setToken(sub); // sub 값을 token에 저장
  }, [name, sub]);

  const AUTH_API_URL = 'https://sgisapi.kostat.go.kr/OpenAPI3/auth/authentication.json';
  const REGION_API_URL = 'https://sgisapi.kostat.go.kr/OpenAPI3/addr/stage.json';

  const CONSUMER_KEY = 'b51e6fd37233422cb0a3';
  const CONSUMER_SECRET = '2992fa547d6a46ca8c2c';

  // 1. Access Token 가져오기
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

  // 데이터 전송
  const handleNext = async () => {
    if (nickname && age && gender && selectedRegion && selectedCity) {
      try {
        const payload = {
          email,
          nickname,
          age,
          gender,
          mbti,
          region: selectedRegion,
          city: selectedCity,
          token, // sub 값을 token으로 저장
        };
        console.log("Payload:", payload);

        await axios.post('/api/users/save', payload);

        updateProgress(100);
        alert('회원가입이 완료되었습니다!');
        navigate('/step3');
      } catch (error) {
        console.error('회원가입 데이터 저장 실패:', error);
      }
    } else {
      alert('모든 필드를 입력해주세요.');
    }
  };

  return (
      <div className="form-container">
        <h2>회원가입 정보 입력</h2>
        {email && <p>로그인된 이메일: {email}</p>}
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
          <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} />
        </label>
        <label>
          MBTI:
          <input type="text" value={mbti} onChange={(e) => setMbti(e.target.value)} />
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
        <button onClick={handleNext}>회원가입 완료</button>
      </div>
  );
}

export default Step1;
