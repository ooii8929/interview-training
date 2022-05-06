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
    React.useEffect(() => {
        console.log('testing');
    }, []);
    const [profileQuestion, setProfileQuestion] = React.useState('');
    const jobType = localStorage.getItem('jobType');
    const [userId, setUserId] = React.useState('');
    const [avatorURL, setAvatorURL] = React.useState('');

    const appContextValue = {
        userId,
        jobType,
        profileQuestion,
        setProfileQuestion,
        setUserId,
        Constant,
    };

    React.useEffect((e) => {
        console.log('0. get user id by session storage', localStorage.getItem('userid'), localStorage.getItem('useremail'));

        async function getAvator() {
            let getAvatorResult = await axios.get(`${Constant[0]}/user/profile/avator`, {
                params: {
                    user_id: localStorage.getItem('userid'),
                    user_email: localStorage.getItem('useremail'),
                    identity: localStorage.getItem('identity'),
                },
            });
            if (localStorage.getItem('identity') === 'student') {
                setAvatorURL(getAvatorResult['data'][0][0]['picture']);
            }
            if (localStorage.getItem('identity') === 'teacher') {
                setAvatorURL(getAvatorResult['data']['userProfile']['picture']);
            }
        }

        if (localStorage.getItem('userid')) {
            getAvator();
        }

        if (!userId && localStorage.getItem('userid')) console.log('0. get user id by session storage run');
        setUserId(localStorage.getItem('userid'));
    }, []);

    React.useEffect(
        (e) => {
            console.log('userId change');
        },
        [userId]
    );

    React.useEffect(
        (e) => {
            console.log('APP.js profileQuestion', profileQuestion);
        },
        [profileQuestion]
    );

    function RequireAuth({ Component }) {
        // <Route path="/course/" element={<RequireAuth Component={Course} />} />
        let location = useLocation();
        let nowUserId = localStorage.getItem('userid');
        if (!nowUserId) {
            alert('你需要先登入');
            localStorage.setItem('returnPage', location.pathname);
            return <Navigate to="/login" />;
        }
        console.log('Auth');
        return <Component />;
    }

    return (
        <BrowserRouter>
            <AppContext.Provider value={appContextValue}>
                <Header avator={avatorURL} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/code" element={<Code />} />
                    <Route path="/reserve" element={<Reserve />} />
                    <Route path="/social" element={<Social />} />
                    <Route path="/social/:id" element={<SocialArticle />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/tutor" element={<Tutor />} />
                    <Route path="/course" element={<RequireAuth Component={Course} />} />
                    <Route path="/course/video" element={<RequireAuth Component={CourseVideo} />} />
                    <Route path="/course/code" element={<RequireAuth Component={CourseCode} />} />
                    <Route path="/arrange" element={<RequireAuth Component={Arrange} />} />
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
