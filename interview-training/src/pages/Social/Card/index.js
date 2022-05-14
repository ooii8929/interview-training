import * as React from 'react';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import CodeEditor from '@uiw/react-textarea-code-editor';
import Grid from '@mui/material/Grid';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import './main.scss';
export default function BasicCard(props) {
    return (
        <div className="card">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <main>
                        <h2>題目：{props.title}</h2>

                        <div className="social-desc" dangerouslySetInnerHTML={{ __html: props.description }}></div>
                    </main>
                </Grid>
            </Grid>
            <h2 style={{ margin: 30, marginLeft: 15, borderLeft: '3px solid #0D6EFD', paddingLeft: 15 }}>看看其他人如何解這題</h2>
            <Grid container spacing={2}>
                {props.codeArticles
                    ? props.codeArticles['articles'][props.qid].map((e, index) => {
                          return (
                              <Grid item xs={6} key={index}>
                                  <div className="card-share">
                                      <p style={{ textAlign: 'center' }}>發表人：{props.codeArticles['authors'][e['author_id']][0]['name']}</p>
                                      <CodeEditor
                                          value={e['code'][0]['javascript_answer']}
                                          language={'javascript'}
                                          placeholder="Please enter JS code."
                                          padding={15}
                                          className="codeeditor"
                                          style={{
                                              minHeight: '60vh',
                                              fontSize: 16,
                                              backgroundColor: '#161b22',
                                              fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                                          }}
                                      />
                                      <Grid item xs={12} style={{ textAlign: 'center' }}>
                                          {e['code'][0].javascript_answer_status ? (
                                              <>
                                                  <Grid container spacing={{ md: 2 }} columns={{ md: 12 }} className="runcode-container-social">
                                                      <Grid item xs={6} className="runcode-result-label-social">
                                                          <DoneAllIcon style={{ marginRight: 10 }} />
                                                          <p>測試結果：</p>
                                                          <div>
                                                              <p>{e['code'][0].javascript_answer_status.answer_status === -1 ? 'Fail' : 'Success'}</p>
                                                          </div>
                                                      </Grid>
                                                      {e['code'][0].javascript_answer_status.answer_status === -1 ? null : (
                                                          <Grid item xs={6} className="runcode-result-social">
                                                              <AccessTimeFilledIcon style={{ marginRight: 10 }} />
                                                              <p>測試時間：</p>
                                                              <div>
                                                                  <p>{e['code'][0].javascript_answer_status.input}</p>
                                                              </div>
                                                          </Grid>
                                                      )}
                                                  </Grid>
                                              </>
                                          ) : null}
                                          <p style={{ textAlign: 'center', marginTop: 20 }}>發布時間：{e.post_time.replace('T', ' ').replace('Z', ' ').split('.', 1)}</p>
                                          <Button>
                                              <Link to={`/social/${e.category}/${e._id}`}>參與討論</Link>
                                          </Button>
                                      </Grid>
                                  </div>
                              </Grid>
                          );
                      })
                    : null}
            </Grid>
        </div>
    );
}
