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
import Logout from './pages/Logout';
import CourseVideo from './pages/Course/Video';
import CourseCode from './pages/Course/Code';
import Account from './pages/Account';
import SocialArticle from './pages/SocialArticle';
import React, { createContext } from 'react';
import Constants from './components/Constants';
export const AppContext = createContext();

function App() {
    console.log('Constants', Constants);
    const [profileQuestion, setProfileQuestion] = React.useState('');
    const jobType = sessionStorage.getItem('jobType');
    const [userId, setUserId] = React.useState('');

    const appContextValue = {
        userId,
        jobType,
        profileQuestion,
        setProfileQuestion,
        setUserId,
        jobType,
    };

    React.useEffect((e) => {
        console.log('0. get user id by session storage');
        if (!userId && sessionStorage.getItem('userid')) console.log('0. get user id by session storage run');
        setUserId(sessionStorage.getItem('userid'));
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
        let location = useLocation();
        let nowUserId = sessionStorage.getItem('userid');
        if (!nowUserId) {
            alert('你需要先登入');
            sessionStorage.setItem('returnPage', location.pathname);
            return <Navigate to="/login" />;
        }
        console.log('Auth');
        return <Component />;
    }

    return (
        <BrowserRouter>
            <AppContext.Provider value={appContextValue}>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/code" element={<Code />} />
                    <Route path="/reserve" element={<Reserve />} />
                    <Route path="/social/" element={<Social />} />
                    <Route path="/social/:id" element={<SocialArticle />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/course/" element={<RequireAuth Component={Course} />} />
                    <Route path="/course/video" element={<RequireAuth Component={CourseVideo} />} />
                    <Route path="/course/code" element={<RequireAuth Component={CourseCode} />} />
                    <Route path="/arrange" element={<RequireAuth Component={Arrange} />} />
                    <Route path="/account/" element={<Account />} />
                    <Route path="/admin/" element={<Admin />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AppContext.Provider>
        </BrowserRouter>
    );
}

export default App;
