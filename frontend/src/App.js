import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home'
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3'
import CityTest from "./CityTest";
import './App.css';
import CitySelectionPage from './CitySelectionPage';

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
          <Route path="/cities/:categoryId" element={<CitySelectionPage />} />
          <Route path="/citiestest" element={<CityTest updateProgress={updateProgress}/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
