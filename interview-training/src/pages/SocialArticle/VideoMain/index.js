import './../index.scss';

import React, { useRef, useEffect } from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import Swal from 'sweetalert2';
import axios from 'axios';
import './../components/main.css';
// import { Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';

import { useParams, useLocation, useNavigate } from 'react-router-dom';

import { Grid, Box } from '@mui/material';

export default function SocialCodeArticle() {
  let navigate = useNavigate();

  const { id } = useParams();
  const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty());
  const tringleGood = useRef(null);
  const tringleBad = useRef(null);
  const [articles, setArticles] = React.useState('');
  // this article info
  const [articleInfo, setArticleInfo] = React.useState('');
  const baseVideoURL = `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/article/record/id`;
  const display = useRef(null);
  const userId = localStorage.getItem('userid');
  const [authorInfo, setAuthorInfo] = React.useState('');
  const [goods, setGoods] = React.useState(null);
  const [language, setLanguage] = React.useState('');
  const location = useLocation();

  // get article info by id
  React.useEffect(() => {
    async function getSpecificArticle() {
      try {
        let tmpArticleInfo = await axios.get(baseVideoURL, {
          params: {
            article_id: id,
          },
        });
        console.log('first tmpArticleInfo', tmpArticleInfo);
        setArticleInfo(tmpArticleInfo['data'][0]);
        setAuthorInfo(tmpArticleInfo['data'][0]['author']);
        setLanguage('javascript');
        display.current.src = tmpArticleInfo['data'][0]['video_url'];
      } catch (error) {
        console.log('getSpecificArticle', error);
      }
    }
    getSpecificArticle();
  }, []);

  useEffect(
    (e) => {
      if (articleInfo) {
        setGoods(articleInfo['goods'].length);
        let goodsClickedUser = articleInfo['goods'].filter(function (e) {
          return e === Number(userId);
        });

        if (goodsClickedUser.length > 0) {
          tringleGood.current.classList.add('good-clicked');
          tringleGood.current.disable = true;
        }
      }
    },
    [articleInfo]
  );

  async function postGood(e) {
    if (tringleGood.current.disable === true) {
      return;
    }
    let postDetail = {
      article_id: id,
    };

    try {
      await axios({
        withCredentials: true,
        method: 'POST',
        credentials: 'same-origin',
        url: `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/article/record/good`,
        data: postDetail,
        headers: { 'Access-Control-Allow-Origin': `${process.env.REACT_APP_NOW_URL}`, 'Content-Type': 'application/json' },
      });

      e.target.classList.add('good-clicked');
      tringleBad.current.classList.remove('good-clicked');
      setGoods((prev) => prev + 1);
    } catch (error) {
      console.log(error.response);
      if (error.response.status === 401) {
        await Swal.fire({
          title: `${error.response.data.error}`,
          icon: 'error',
          confirmButtonText: '????????????',
        });
      }

      if (error.response.status === 400) {
        await Swal.fire({
          title: `${error.response.data.error}`,
          icon: 'error',
          confirmButtonText: '????????????',
        });
        localStorage.setItem('returnPage', location.pathname);
        window.location.assign('/login');
      }
    }
  }

  async function postBad(e) {
    let postDetail = {
      article_id: id,
    };
    try {
      await axios({
        withCredentials: true,
        method: 'POST',
        credentials: 'same-origin',
        url: `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/article/record/bad`,
        data: postDetail,
        headers: { 'Access-Control-Allow-Origin': `${process.env.REACT_APP_NOW_URL}`, 'Content-Type': 'application/json' },
      });

      e.target.classList.remove('good-clicked');
      tringleGood.current.classList.remove('good-clicked');
      tringleGood.current.disable = false;
      setGoods((prev) => prev - 1);
    } catch (error) {
      if (error.response.status === 401) {
        await Swal.fire({
          title: `${error.response.data.error}`,
          icon: 'error',
          confirmButtonText: '????????????',
        });
      }

      if (error.response.status === 400) {
        await Swal.fire({
          title: `${error.response.data.error}`,
          icon: 'error',
          confirmButtonText: '????????????',
        });
        localStorage.setItem('returnPage', location.pathname);
        window.location.assign('/login');
      }
    }
  }
  async function getArticles() {
    try {
      let tmpAllArticles = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/article/record`, {
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

  useEffect(
    (e) => {
      console.log('language', language);
      if (language) {
        getArticles();
      }
    },
    [language]
  );
  useEffect(
    (e) => {
      if (articles) {
        console.log('articles', articles);
      }
    },
    [articles]
  );

  useEffect(
    (e) => {
      if (editorState) console.log('editorState success');
    },
    [editorState]
  );

  async function postComment(msg) {
    let postCommentResult;
    try {
      postCommentResult = await axios({
        withCredentials: true,
        method: 'POST',
        credentials: 'same-origin',
        url: `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/article/code/comment`,
        data: {
          article_id: id,
          summerNote: msg,
        },
        headers: { 'Access-Control-Allow-Origin': `${process.env.REACT_APP_NOW_URL}`, 'Content-Type': 'application/json' },
      });

      console.log('postCommentResult', postCommentResult);
      let tmpArticleInfo;

      tmpArticleInfo = await axios({
        withCredentials: true,
        method: 'GET',
        credentials: 'same-origin',
        url: baseVideoURL,
        params: {
          article_id: id,
        },
        headers: { 'Access-Control-Allow-Origin': `${process.env.REACT_APP_NOW_URL}`, 'Content-Type': 'application/json' },
      });

      setArticleInfo(tmpArticleInfo['data'][0]);
    } catch (error) {
      console.log('error', error);
      await Swal.fire({
        title: '????????????????????????!',
        text: '????????????????????????????????????',
        icon: 'error',
        confirmButtonText: '??????????????????',
      });
      localStorage.setItem('returnPage', location.pathname);
      navigate('/login');
    }
  }

  return (
    <React.Fragment>
      <Grid container spacing={4} className="article-block">
        <Grid item xs={8} className="article-container article-container-left">
          <div>
            {articleInfo ? (
              <Grid container spacing={4}>
                <Grid item xs={2} className="article-main-left">
                  <Box
                    component="img"
                    className="avator"
                    sx={{
                      height: 50,
                      width: 50,
                    }}
                    alt="The house from the offer."
                    src={authorInfo.picture}
                  />

                  <div className="goods-container">
                    <div className="tringle good" onClick={postGood} ref={tringleGood}></div>
                    <div className="now-goods">{goods ? goods : 0}</div>
                    <div className="tringle-bad good" onClick={postBad} ref={tringleBad}></div>
                  </div>
                </Grid>
                <Grid item xs={10} className="article-main-right">
                  <>
                    <div className="allcard">
                      <h1>{articleInfo.title}</h1>
                      <hr />
                      <div dangerouslySetInnerHTML={{ __html: articleInfo.description }}></div>
                      <video type="video/webm" autoPlay controls ref={display} />
                    </div>
                    <div className="reply-container">
                      {articleInfo['comments']
                        ? articleInfo['comments'].map((e, index) => {
                            return (
                              <div key={index} className="comment-specfic">
                                <div className="comment-specfic-avator">
                                  <Grid container spacing={2}>
                                    <Grid item xs={2}>
                                      <Box
                                        component="img"
                                        className="avator"
                                        sx={{
                                          height: 50,
                                          width: 50,
                                        }}
                                        src={e.picture}
                                      />
                                    </Grid>
                                    <Grid item xs={10} className="comment-specfic-avator-right">
                                      <div className="comment-specfic-title">
                                        <div dangerouslySetInnerHTML={{ __html: e.name }}></div>
                                      </div>
                                    </Grid>
                                  </Grid>
                                </div>
                                <div className="comment-specfic-content">
                                  <div dangerouslySetInnerHTML={{ __html: e.content }}></div>
                                </div>
                              </div>
                            );
                          })
                        : null}
                    </div>
                  </>

                  <div className="post-comment">
                    <br />
                    <hr />
                    <br />
                    <h5>??????????????????????????????????????????</h5>
                    <Editor onChange={setEditorState} />
                    <button
                      onClick={() => {
                        console.log('EditorComponent', editorState);
                        const rawContentState = draftToHtml(editorState);
                        postComment(rawContentState);
                      }}
                    >
                      ??????
                    </button>
                  </div>
                </Grid>
              </Grid>
            ) : null}
          </div>
        </Grid>
        <Grid item xs={4} className="article-container article-container-right">
          <div className="article-side">
            <h3>??????????????????</h3>
            {articles
              ? articles['articles'][articleInfo['question_id']].map((e, index) => {
                  return (
                    <div key={index}>
                      <div className="article-relate">
                        ????????????{e.author_name}
                        <br />
                        {e.post_time.replace('T', ' ').replace('Z', ' ').split('.', 1)}
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
