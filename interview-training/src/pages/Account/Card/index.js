import React, { useState, useRef, useContext } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CodeEditor from '@uiw/react-textarea-code-editor';
import axios from 'axios';
import SendIcon from '@mui/icons-material/Send';
import ShareIcon from '@mui/icons-material/Share';
import Swal from 'sweetalert2';

export default function BasicCard(props) {
    let userId = localStorage.getItem('userid');
    const defaultLanguage = 'javascript';
    const refs = useRef([]);
    const [language, setLanguage] = React.useState(defaultLanguage);
    const shareBtn = useRef(null);
    let languages = ['javascript', 'python'];
    const [code, setCode] = React.useState(null);
    let shareResult;
    async function shareAnswer(e) {
        e.preventDefault();

        if (e.currentTarget.dataset.category === 'video') {
            try {
                let videoArticle = await axios({
                    withCredentials: true,
                    method: 'POST',
                    credentials: 'same-origin',
                    url: `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/article/video`,
                    data: {
                        user_id: userId,
                        article_id: e.currentTarget.value,
                        qid: e.currentTarget.dataset.qid,
                        question_id: props.questionID,
                        video_url: e.currentTarget.dataset.video,
                        category: e.currentTarget.dataset.category,
                    },
                    headers: { 'Access-Control-Allow-Origin': `${process.env.REACT_APP_NOW_URL}`, 'Content-Type': 'application/json' },
                });
            } catch (error) {
                await Swal.fire({
                    title: '發生問題!',
                    text: `${error.response.data.error}`,
                    icon: 'error',
                    confirmButtonText: '再試一次',
                });
            }
        }
        // try {
        //     shareResult = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/article/code`, {
        //         user_id: userId,
        //         question_id: n.qid,
        //         code: code,
        //         language: language,
        //         identity: localStorage.getItem('identity'),
        //     });
        // } catch (error) {
        //     console.error(error);
        // }

        // if (!shareResult) {
        //     console.log('share error');
        //     //     document.querySelector(`#answer-${QuestionNumString}`).innerHTML = `
        //     // <div class="answer-block"><div class="answer-title">error:</div><div id="answer-${QuestionNumString}-status" class="answer-reply">${response.data.stderr}</div></div>`;
        // } else {
        //     console.log('share reponse', shareResult);
        //     shareBtn.current.textContent = '分享成功';
        //     shareBtn.current.disabled = true;
        // }
    }

    return (
        <Card sx={{ mb: 5 }}>
            <CardContent>
                {props.video
                    ? props.video.map((e, index) => {
                          return (
                              <div key={index}>
                                  <div className="history-title-div">
                                      <Typography variant="h5" component="div">
                                          {e.title}
                                      </Typography>{' '}
                                      <Button
                                          variant="contained"
                                          ref={shareBtn}
                                          endIcon={<ShareIcon />}
                                          className="share-btn"
                                          size="large"
                                          value={`${props.questionID}-video-${e.qid}`}
                                          data-category={'video'}
                                          data-qid={e.qid}
                                          data-video={e.video_url}
                                          onClick={shareAnswer}
                                          sx={{ mt: 1, mr: 1 }}
                                      ></Button>
                                  </div>

                                  <video type="video/webm" controls src={e.video_url} />
                                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                      {e.description}
                                  </Typography>
                                  <hr />
                              </div>
                          );
                      })
                    : null}
                <hr />
                {props.code
                    ? props.code.map((c, index) => {
                          return (
                              <div key={index}>
                                  <div className="history-title-div">
                                      <Typography variant="h5" component="div">
                                          {c.title}
                                      </Typography>{' '}
                                      <Button
                                          variant="contained"
                                          ref={shareBtn}
                                          endIcon={<ShareIcon />}
                                          className="share-btn"
                                          size="large"
                                          value={`${props.questionID}-code-${c.id}`}
                                          onClick={(e) => shareAnswer(e)}
                                          sx={{ mt: 1, mr: 1 }}
                                      ></Button>
                                  </div>
                                  <Grid container spacing={2} style={{ background: '#fafafa' }}>
                                      <Grid item xs={6} style={{ padding: '3%' }}>
                                          <div dangerouslySetInnerHTML={{ __html: c.description }}></div>
                                      </Grid>
                                      <Grid item xs={6} style={{ padding: '3%' }}>
                                          <select onChange={(e) => setLanguage(e.target.value)}>
                                              {languages.map((theme, index) => {
                                                  return (
                                                      <option key={index} value={theme}>
                                                          {theme}
                                                      </option>
                                                  );
                                              })}
                                          </select>
                                          <CodeEditor
                                              value={c[`${language}_answer`]}
                                              language={language}
                                              placeholder="Please enter JS code."
                                              onChange={(evn) => setCode(evn.target.value)}
                                              padding={15}
                                              className="codeeditor"
                                              style={{
                                                  minHeight: '60vh',
                                                  fontSize: 16,
                                                  backgroundColor: '#161b22',
                                                  fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                                              }}
                                          />
                                      </Grid>
                                  </Grid>
                                  <hr />
                              </div>
                          );
                      })
                    : null}
            </CardContent>
        </Card>
    );
}
