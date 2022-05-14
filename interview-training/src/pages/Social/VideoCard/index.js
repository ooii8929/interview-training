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
                {props.videoArticles
                    ? props.videoArticles['articles'][props.qid].map((e, index) => {
                          return (
                              <Grid item xs={6} key={index} style={{ textAlign: 'center' }}>
                                  {console.log('video e', e)}

                                  <div className="card-share">
                                      <p style={{ textAlign: 'center' }}>發表人：{props.videoArticles['authors'][e['author_id']][0]['name']}</p>

                                      <Grid item xs={12}>
                                          {e['video_url'] ? <video src={e['video_url']} /> : null}
                                      </Grid>

                                      <p style={{ textAlign: 'center', marginTop: 20 }}>發布時間：{e.post_time.replace('T', ' ').replace('Z', ' ').split('.', 1)}</p>
                                      <Button>
                                          <Link to={`/social/${e.category}/${e._id}`}>參與討論</Link>
                                      </Button>
                                  </div>
                              </Grid>
                          );
                      })
                    : null}
            </Grid>
        </div>
    );
}
