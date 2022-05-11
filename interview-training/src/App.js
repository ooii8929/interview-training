import Header from './layouts/sections/Header';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Code from './pages/Code';
import Admin from './pages/Admin';
import Social from './pages/Social';
import NotFound from './pages/NotFound';
import Arrange from './pages/Arrange';
import Reserve from './pages/Reserve';
import Course from './pages/Course';
import CourseResult from './pages/CourseResult';
import Logout from './pages/Logout';
import Tutor from './pages/Tutor';
import CourseVideo from './pages/Course/Video';
import CourseCode from './pages/Course/Code';
import Account from './pages/Account';
import SocialArticle from './pages/SocialArticle';
import React, { createContext } from 'react';
import Constant from './components/Constant.js';
import axios from 'axios';

export const AppContext = createContext();

function App() {
    // console.log('Constant', Constant);

    const [profileQuestion, setProfileQuestion] = React.useState('');
    const [userId, setUserId] = React.useState('');
    const [isLogin, setIsLogin] = React.useState(false);
    const [identity, setIdentity] = React.useState('student');
    const [avatorURL, setAvatorURL] = React.useState('');
    const appContextValue = {
        userId,
        profileQuestion,
        setProfileQuestion,
        setUserId,
        Constant,
    };

    React.useEffect((e) => {
        try {
            async function getAvator() {
                let getAvatorResult = await axios({
                    withCredentials: true,
                    method: 'GET',
                    credentials: 'same-origin',
                    url: `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/user/profile`,
                    headers: { 'Access-Control-Allow-Origin': `${process.env.REACT_APP_NOW_URL}`, 'Content-Type': 'application/json' },
                });
                if (getAvatorResult.data.email) {
                    setIsLogin(true);
                    setAvatorURL(getAvatorResult['data']['picture']);
                    localStorage.setItem('userid', getAvatorResult.data.id);
                    localStorage.setItem('username', getAvatorResult.data.name);
                    localStorage.setItem('useremail', getAvatorResult.data.email);
                    localStorage.setItem('identity', getAvatorResult.data.identity);
                }
            }

            getAvator();
        } catch (error) {
            console.log('get avator fail', error);
        }
    }, []);

    return (
        <BrowserRouter>
            <AppContext.Provider value={appContextValue}>
                <Header avator={avatorURL} identity={identity} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/code" element={<Code />} />
                    <Route path="/reserve" element={<Reserve />} />
                    <Route path="/social" element={<Social />} />
                    <Route path="/social/:id" element={<SocialArticle />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/tutor" element={<Tutor />} />
                    <Route path="/course" element={<Course />} />
                    <Route path="/course/video" element={<CourseVideo />} />
                    <Route path="/course/code" element={<CourseCode />} />
                    <Route path="/arrange" element={<Arrange />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/course/result" element={<CourseResult />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AppContext.Provider>
        </BrowserRouter>
    );
}

export default App;
