import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Google OAuth Provider 추가
import Home from './Home';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Post from './Post';
import Result from './ResultPage';
import Board from './Board';
import CreatePost from "./CreatePost";

import './App.css';
import TripPlanner from "./TripPlanner";
import MyPage from './MyPage';
import MyPostDetail from "./MyPostDetail";

function App() {
  const [progress, setProgress] = useState(0); // 진행 상태 (0~100)

  const updateProgress = (value) => {
    setProgress(value);
  };

  return (
    <Router>
      <div className="App">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/step1" element={<Step1 updateProgress={updateProgress} />} />
          <Route path="/step2" element={<Step2 updateProgress={updateProgress} />} />
          <Route path="/step3" element={<Step3 updateProgress={updateProgress} />} />
          <Route path="/post" element={<Post updateProgress={updateProgress} />} />
          <Route path="/post/:postId" element={<Post />} /> {/* 동적 라우팅 */}
          <Route path="/results" element={<Result />} />
          <Route path="/tripplan" element={<TripPlanner />} />
          <Route path="/board" element={<Board />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/plan/:postId" element={<MyPostDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
