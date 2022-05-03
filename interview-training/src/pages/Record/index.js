import Header from '../../layouts/sections/Header';
import { AppContext } from '../../App';
import React, { useRef, useEffect, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function SocialArticle() {
    const { Constant } = useContext(AppContext);

    const jobType = localStorage.getItem('jobType');
    const userId = localStorage.getItem('userid');
    const { id } = useParams();
    const tringleGood = useRef(null);

    const [articles, setArticles] = React.useState(null);
    const [videoQuestions, setVideoQuestions] = React.useState(null);

    React.useEffect((e) => {
        async function getVideoQuestions() {
            let response = await axios.get(`${Constant[0]}/training/video/questions`, {
                params: {
                    profession: 'backend',
                },
            });
            setVideoQuestions(response);
        }
        getVideoQuestions();
    }, []);

    React.useEffect(
        (e) => {
            if (videoQuestions) {
                console.log('videoQuestions', videoQuestions);
            }
        },
        [videoQuestions]
    );

    return (
        <>
            <Header />
            <div></div>
        </>
    );
}
