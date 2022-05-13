import * as React from 'react';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import CodeEditor from '@uiw/react-textarea-code-editor';
import Grid from '@mui/material/Grid';
import './main.scss';
export default function BasicCard(props) {
    // let authorPicture;
    // if (Array.isArray(props.authors)) {
    //     authorPicture = props.authors.filter((e) => (e.id = props.authorID));
    // } else {
    //     authorPicture = props.authors['picture'];
    // }

    return (
        <div className="card">
            <div className="ovelay"> </div>
            <header className="user"></header>
            <main>
                <h2>{props.title}</h2>

                <div className="social-desc" dangerouslySetInnerHTML={{ __html: props.description }}></div>
            </main>
            <div>
                <Grid container spacing={2} className="card-all-share-video">
                    {props.videoArticles
                        ? props.videoArticles['articles'][props.qid].map((e) => {
                              return (
                                  <Grid item xs={6}>
                                      <Link to={`/social/${e.category}/${e._id}`}>
                                          <div className="card-share-video">
                                              <p>{props.videoArticles['authors'][e['author_id']][0]['name']}</p>
                                              <a>{e.post_time.replace('T', ' ').replace('Z', ' ').split('.', 1)}</a>
                                          </div>
                                      </Link>
                                  </Grid>
                              );
                          })
                        : null}
                </Grid>
            </div>
        </div>
    );
}
