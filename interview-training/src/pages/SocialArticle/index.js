import './index.scss';

import React, { useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../App';

import VisibilityIcon from '@mui/icons-material/Visibility';
import { useParams, useLocation } from 'react-router-dom';
import { Grid, Box } from '@mui/material';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import StarIcon from '@mui/icons-material/Star';
let allArticles;

export default function SocialArticle() {
    const { id } = useParams();
    const { Constant } = useContext(AppContext);

    const tringleGood = useRef(null);
    const tringleBad = useRef(null);
    const [articles, setArticles] = React.useState(null);
    const [articleInfo, setArticleInfo] = React.useState(null);
    const baseURL = `${Constant[0]}/article/id`;
    const jobType = localStorage.getItem('jobType');
    const userId = localStorage.getItem('userid');
    const [goods, setGoods] = React.useState(null);
    const [language, setLanguage] = React.useState(null);
    const [isGood, setIsGood] = React.useState(false);
    const [authorPicture, setAuthorPicture] = React.useState('');
    const location = useLocation();
    console.log(location.pathname);
    async function postGood(e) {
        let postDetail = {
            user_id: userId,
            article_id: id,
        };

        try {
            let res = await axios.post(`${Constant[0]}/article/good`, postDetail);
            e.target.classList.add('good-clicked');
            tringleBad.current.classList.remove('good-clicked');
            setGoods((prev) => prev + 1);
        } catch (error) {
            console.log(error);
            alert('你需要先登入');
            localStorage.setItem('returnPage', location.pathname);
            // window.location.assign("/login");
        }
    }

    async function postBad(e) {
        let postDetail = {
            user_id: userId,
            article_id: id,
        };
        try {
            let res = await axios.post(`${Constant[0]}/article/bad`, postDetail);
            console.log('e', e.target);
            e.target.classList.remove('good-clicked');
            tringleGood.current.classList.remove('good-clicked');

            setGoods((prev) => prev - 1);

            console.log('post bad', res);
        } catch (error) {
            console.log(error);
            alert('你需要先登入');
            localStorage.setItem('returnPage', location.pathname);
            // window.location.assign("/login");
        }
    }

    React.useEffect(() => {
        async function getSpecificArticle() {
            try {
                let tmpArticleInfo = await axios.get(baseURL, {
                    params: {
                        article_id: id,
                    },
                });
                setGoods(tmpArticleInfo['data'][0]['goods'].length);
                let goodsClickedUser = tmpArticleInfo['data'][0]['goods'].filter(function (e) {
                    return e == userId;
                });
                console.log('goodsClickedUser', goodsClickedUser);
                if (goodsClickedUser.length > 0) {
                    tringleGood.current.classList.add('good-clicked');
                    tringleGood.current.disable = true;
                }
                setArticleInfo(tmpArticleInfo['data'][0]);
                setLanguage(tmpArticleInfo['data'][0]['language']);
                console.log('setArticleInfo', tmpArticleInfo);
            } catch (error) {
                console.log(error);
            }
        }
        getSpecificArticle();
    }, []);

    useEffect(
        (e) => {
            async function getArticles() {
                try {
                    let tmpAllArticles = await axios.get(`${Constant[0]}/article`, {
                        params: {
                            profession: language,
                        },
                    });
                    console.log('tmpAllArticles["data"]', tmpAllArticles['data']);
                    setArticles(tmpAllArticles['data']);
                } catch (error) {
                    console.log(error);
                }
            }
            if (language) {
                getArticles();
            }
        },
        [language]
    );
    useEffect(
        (e) => {
            if (articles)
                if (Array.isArray(articles['authors'])) {
                    let tmpAuthor = articles['authors'].filter((e) => (e.id = articles['authors'].authorID));
                    setAuthorPicture(tmpAuthor);
                } else {
                    let tmpAuthor = articles['authors']['picture'];
                    setAuthorPicture(tmpAuthor);
                }
        },
        [articles]
    );

    return (
        <>
            <Grid container spacing={4} className="article-block">
                <Grid item xs={8} className="article-container article-container-left">
                    <div>
                        <Grid container spacing={4}>
                            <Grid item xs={2} className="article-main-left">
                                {articles ? (
                                    <Box
                                        component="img"
                                        className="avator"
                                        sx={{
                                            height: 50,
                                            width: 50,
                                        }}
                                        alt="The house from the offer."
                                        src={authorPicture}
                                    />
                                ) : null}
                                <div className="goods-container">
                                    <div className="tringle good" onClick={postGood} ref={tringleGood}></div>
                                    {articles ? <div className="now-goods">{goods}</div> : null}
                                    <div className="tringle-bad good" onClick={postBad} ref={tringleBad}></div>
                                </div>
                            </Grid>
                            <Grid item xs={10} className="article-main-right">
                                {articleInfo ? (
                                    <div className="allcard">
                                        <h1>{articleInfo.title}</h1>
                                        <hr />
                                        <div dangerouslySetInnerHTML={{ __html: articleInfo.description }}></div>

                                        <SyntaxHighlighter language={language} style={docco}>
                                            {articleInfo.code}
                                        </SyntaxHighlighter>
                                    </div>
                                ) : null}
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
                <Grid item xs={4} className="article-container article-container-right">
                    <div className="article-side">
                        stats
                        <Grid container spacing={4} className="article-block">
                            <Grid item xs={3} className="article-info">
                                <VisibilityIcon />
                                300
                            </Grid>
                            <Grid item xs={3} className="article-info">
                                <ReplyAllIcon />
                                400
                            </Grid>
                            <Grid item xs={3} className="article-info">
                                <StarIcon />
                                200
                            </Grid>
                        </Grid>
                    </div>
                    <div className="article-side">
                        Related Question
                        {articles
                            ? articles['articles'].map((e, index) => {
                                  return (
                                      <div key={index}>
                                          <h3>{e.title}</h3>
                                          <p>{e.description}</p>
                                      </div>
                                  );
                              })
                            : null}
                    </div>
                </Grid>
            </Grid>
        </>
    );
}
