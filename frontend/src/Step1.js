import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Step1.css'; // CSS 파일 추가
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
  const navigate = useNavigate();
  const location = useLocation();

  // Google 로그인에서 전달된 이메일
  const email = location.state?.email;

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
          setAccessToken(response.data.result.accessToken); // Access Token 저장
        } else {
          console.error('Access Token을 가져오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error('Access Token API 호출 실패:', error);
      }
    };
    fetchAccessToken();
  }, []);

  // 2. 첫 번째 드롭다운 데이터 로드
  useEffect(() => {
    const fetchRegions = async () => {
      if (!accessToken) return; // Access Token이 없으면 호출하지 않음
      try {
        const response = await axios.get(REGION_API_URL, {
          params: {
            accessToken: accessToken,
          },
        });
        if (response.data.result) {
          setRegions(response.data.result);
        }
      } catch (error) {
        console.error('첫 번째 드롭다운 데이터 로드 실패:', error);
      }
    };
    fetchRegions();
  }, [accessToken]);

  // 3. 두 번째 드롭다운 데이터 로드
  useEffect(() => {
    const fetchCities = async () => {
      if (!accessToken || !selectedRegion) return; // Access Token 또는 선택된 지역이 없으면 호출하지 않음
      try {
        const response = await axios.get(REGION_API_URL, {
          params: {
            accessToken: accessToken,
            cd: selectedRegion,
          },
        });
        if (response.data.result) {
          setCities(response.data.result);
        }
      } catch (error) {
        console.error('두 번째 드롭다운 데이터 로드 실패:', error);
      }
    };
    fetchCities();
  }, [accessToken, selectedRegion]);

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
    setSelectedCity(''); // 첫 번째 드롭박스 선택 시 두 번째 드롭박스를 초기화
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

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
        };
        await axios.post('/api/users/save', payload);

        updateProgress(100); // 진행 상태 업데이트
        navigate('/step2'); // 회원가입 완료 화면으로 이동
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
