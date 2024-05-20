import React, { useEffect, useState } from 'react';
import { EuiProvider, EuiThemeProvider} from "@elastic/eui";
import Login from "./pages/Login.js";
import Dashboard from './pages/Dashboard.js';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAppSelector } from './app/hooks.js';
import ThemeSelector from './components/ThemeSelector.js';
import CreateMeeting from './pages/CreateMeeting.js';
import OneonOneMeeting from './pages/OneonOneMeeting.js';
import VideoConference from './pages/VideoConference.js';
import MyMeetings from './pages/MyMeetings.js';
import Meeting from './pages/Meeting.js';
import JoinMeeting from './pages/JoinMeeting.js';


export default function App() {
  const isDarkTheme = useAppSelector((quirxtalk)=>quirxtalk.auth.isDarkTheme);
  const [theme, setTheme] = useState("light");
  const [isIntialTheme,setIsInitialTheme] = useState(true);


  useEffect(() =>{
    const theme=localStorage.getItem("quirxtalk-theme");
    if(theme){
      setTheme(theme);
    }
    else
    {
      localStorage.setItem("quirxtalk-theme", "light")
    }
  },[]);

  useEffect(() =>{
    if(isIntialTheme) setIsInitialTheme(false);
      else{
    window.location.reload();
    }
  },[isDarkTheme]
    )

  const overrides={
    colors:{
      LIGHT: { primary:"#0b5cff"},
      DARK: {primary:"#0b5cff"},
    },
  };



  return (
    <ThemeSelector>
    <EuiProvider colorMode={theme}>
      <EuiThemeProvider modify={overrides}>
        <Router> 
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/create" element={<CreateMeeting />} />
            <Route path="/create1on1" element={<OneonOneMeeting />} />
            <Route path="/videoconference" element={<VideoConference />} />
            <Route path="/mymeetings" element={<MyMeetings />} />
            <Route path="/meetings" element={<Meeting />} />
            <Route path="/join/:id" element={<JoinMeeting />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </Router>
       
        </EuiThemeProvider>
      </EuiProvider>
    </ThemeSelector>
  );
}
