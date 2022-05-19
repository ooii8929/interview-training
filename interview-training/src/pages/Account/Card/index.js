import React, { useRef } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CodeEditor from '@uiw/react-textarea-code-editor';
import axios from 'axios';
import ShareIcon from '@mui/icons-material/Share';
import Swal from 'sweetalert2';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function BasicCard(props) {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };
  let userId = localStorage.getItem('userid');
  const defaultLanguage = 'javascript';
  const [language, setLanguage] = React.useState(defaultLanguage);
  const shareBtn = useRef(null);

  let languages = ['javascript', 'python'];
  const [code, setCode] = React.useState(null);

  React.useEffect(() => {}, [code]);

  async function shareAnswer(e) {
    handleToggle();
    e.preventDefault();

    if (e.currentTarget.dataset.category === 'video') {
      try {
        await axios({
          withCredentials: true,
          method: 'POST',
          credentials: 'same-origin',
          url: `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/article/record`,
          data: {
            user_id: userId,
            article_id: e.currentTarget.value,
            qid: e.currentTarget.dataset.qid,
            question_id: props.questionID,
            answer_url: e.currentTarget.dataset.video,
            category: e.currentTarget.dataset.category,
          },
          headers: { 'Access-Control-Allow-Origin': `${process.env.REACT_APP_NOW_URL}`, 'Content-Type': 'application/json' },
        });

        async function getTraining() {
          try {
            let responseAllTraining = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/training`, {
              params: {
                user_id: userId,
              },
            });

            if (responseAllTraining) {
              console.log('responseAllTraining', responseAllTraining);
              let allTrainingFilter = responseAllTraining['data'].filter((e) => {
                return e['status'] === 1;
              });
              console.log('allTrainingFilter', allTrainingFilter);
              props.setAllTraining(allTrainingFilter);
            }
          } catch (error) {
            console.log(error);
          }
        }
        getTraining();
        handleClose();
        await Swal.fire({
          title: '成功了！！！',
          icon: 'success',
          confirmButtonText: '繼續查看',
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

    // share code topic
    if (e.currentTarget.dataset.category === 'code') {
      try {
        await axios({
          withCredentials: true,
          method: 'POST',
          credentials: 'same-origin',
          url: `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/article/code`,
          data: {
            user_id: userId,
            article_id: e.currentTarget.value,
            qid: e.currentTarget.dataset.qid,
            question_id: props.questionID,
            category: e.currentTarget.dataset.category,
          },
          headers: { 'Access-Control-Allow-Origin': `${process.env.REACT_APP_NOW_URL}`, 'Content-Type': 'application/json' },
        });

        async function getTraining() {
          try {
            let responseAllTraining = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/training`, {
              params: {
                user_id: userId,
              },
            });

            if (responseAllTraining) {
              console.log('responseAllTraining', responseAllTraining);
              let allTrainingFilter = responseAllTraining['data'].filter((e) => {
                return e['status'] === 1;
              });
              console.log('allTrainingFilter', allTrainingFilter);
              props.setAllTraining(allTrainingFilter);
            }
          } catch (error) {
            console.log(error);
          }
        }
        getTraining();
        handleClose();
        await Swal.fire({
          title: '成功了！！！',
          icon: 'success',
          confirmButtonText: '繼續查看',
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
  }

  return (
    <Card>
      <CardContent>
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open} onClick={handleClose}>
          <CircularProgress color="inherit" />
        </Backdrop>
        {props.video
          ? props.video.map((e, index) => {
              return (
                <div key={index}>
                  <div className="history-title-div">
                    <Typography variant="h5">{e.title}</Typography>
                    {e.shared ? (
                      <Button
                        variant="contained"
                        endIcon={<ShareIcon />}
                        className="share-btn"
                        size="large"
                        value={`${props.questionID}-video-${e.qid}`}
                        data-category={'video'}
                        data-qid={e.qid}
                        data-video={e.answer_url}
                        sx={{ mt: 1, mr: 1 }}
                        disabled={true}
                      ></Button>
                    ) : (
                      <Button
                        variant="contained"
                        ref={shareBtn}
                        endIcon={<ShareIcon />}
                        className="share-btn"
                        size="large"
                        value={`${props.questionID}-video-${e.qid}`}
                        data-category={'video'}
                        data-qid={e.qid}
                        data-video={e.answer_url}
                        onClick={shareAnswer}
                        sx={{ mt: 1, mr: 1 }}
                      ></Button>
                    )}
                  </div>

                  <video type="video/webm" controls src={e.answer_url} />
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
                    <Typography variant="h5">{c.title}</Typography>{' '}
                    {c.shared ? (
                      <Button
                        variant="contained"
                        endIcon={<ShareIcon />}
                        className="share-btn"
                        size="large"
                        value={`${props.questionID}-code-${c.qid}`}
                        data-category={'code'}
                        data-qid={c.qid}
                        sx={{ mt: 1, mr: 1 }}
                        disabled={true}
                      ></Button>
                    ) : (
                      <Button
                        variant="contained"
                        ref={shareBtn}
                        endIcon={<ShareIcon />}
                        className="share-btn"
                        size="large"
                        value={`${props.questionID}-code-${c.qid}`}
                        data-category={'code'}
                        data-qid={c.qid}
                        onClick={shareAnswer}
                        sx={{ mt: 1, mr: 1 }}
                      ></Button>
                    )}
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
                    <Grid item xs={12} style={{ padding: '3%' }}>
                      {c.javascript_answer_status ? (
                        <>
                          <Grid container spacing={{ md: 4 }} columns={{ md: 12 }} className="runcode-container">
                            <Grid item xs={2} className="runcode-result-label">
                              <span>測試結果</span>
                            </Grid>
                            <Grid item xs={4} className="runcode-result">
                              <div>
                                <span>{c.javascript_answer_status.answer_status}</span>
                              </div>
                            </Grid>
                            <Grid item xs={2} className="runcode-result-label">
                              <span>測試數據</span>
                            </Grid>
                            <Grid item xs={4} className="runcode-result">
                              <div>
                                <span>{c.javascript_answer_status.input}</span>
                              </div>
                            </Grid>
                          </Grid>
                          <Grid container spacing={{ md: 4 }} columns={{ md: 12 }} className="runcode-container">
                            <Grid item xs={2} className="runcode-result-label">
                              <div>
                                <span>期待答案</span>
                              </div>
                            </Grid>
                            <Grid item xs={4} className="runcode-result">
                              <div>
                                <span>{c.javascript_answer_status.except}</span>
                              </div>
                            </Grid>
                            <Grid item xs={2} className="runcode-result-label">
                              <div>
                                <span>你的答案</span>
                              </div>
                            </Grid>

                            <Grid item xs={4} className="runcode-result">
                              <div>
                                <span>{c.javascript_answer_status.output}</span>
                              </div>
                            </Grid>
                          </Grid>
                        </>
                      ) : null}
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
