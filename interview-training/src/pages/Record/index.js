import Header from '../../layouts/sections/Header';
import { AppContext } from '../../App';
import React, { useRef, useEffect, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function SocialArticle() {
  const { Constant } = useContext(AppContext);

  const profession = localStorage.getItem('profession');
  const userId = localStorage.getItem('userid');
  const { id } = useParams();
  const tringleGood = useRef(null);

  const [articles, setArticles] = React.useState(null);
  const [videoQuestions, setVideoQuestions] = React.useState(null);

  React.useEffect((e) => {
    async function getVideoQuestions() {
      let response = await axios({
        withCredentials: true,
        method: 'GET',
        credentials: 'same-origin',
        url: `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/training/video/questions`,
        params: {
          profession: profession || 'backend',
        },
        headers: { 'Access-Control-Allow-Origin': `${process.env.REACT_APP_NOW_URL}`, 'Content-Type': 'application/json' },
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
