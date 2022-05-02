import React, { useContext } from 'react';
import { AppContext } from '../../../App';
import { Grid, Box, Typography } from '@mui/material';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useParams } from 'react-router-dom';

import axios from 'axios';
let allArticles;
export default function Article(props) {
    const { id } = useParams();
    const { Constant } = useContext(AppContext);

    const baseURL = `${Constant}/article`;
    const jobType = sessionStorage.getItem('jobType');
    const [articles, setArticles] = React.useState(null);

    React.useEffect(() => {
        async function getArticles() {
            try {
                allArticles = await axios.get(baseURL, {
                    params: {
                        profession: jobType,
                    },
                });
                console.log('allArticles["data"]', allArticles['data']);
                setArticles(allArticles['data']);
            } catch (error) {
                console.log(error);
            }
        }
        getArticles();
    }, []);
    return (
        <Grid container spacing={4} className="article-block">
            <Grid item xs={8} className="article-container">
                <div>
                    <Grid container spacing={4}>
                        {' '}
                        <Grid item xs={2} className="article-main-left">
                            <Box
                                component="img"
                                sx={{
                                    height: 233,
                                    width: 350,
                                    maxHeight: { xs: 233, md: 167 },
                                    maxWidth: { xs: 350, md: 250 },
                                }}
                                alt="The house from the offer."
                                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2"
                            />
                        </Grid>
                        {articles
                            .filter((card) => card._id === id)
                            .map((card, index) => (
                                <div key={index} className="allcard">
                                    <Grid item xs={10} className="article-main-right">
                                        {card.title}
                                        {card.description}
                                        <SyntaxHighlighter language="javascript" style={docco}>
                                            {' '}
                                            {card.code}
                                        </SyntaxHighlighter>
                                    </Grid>
                                </div>
                            ))}
                    </Grid>
                </div>
            </Grid>
            <Grid item xs={4} className="article-container">
                <div>
                    stats
                    <Grid container spacing={4} className="article-block">
                        <Grid item xs={3} className="article-container">
                            chat
                        </Grid>
                        <Grid item xs={3} className="article-container">
                            share
                        </Grid>
                        <Grid item xs={3} className="article-container">
                            view
                        </Grid>
                    </Grid>
                </div>
                <div>
                    Related Question
                    {[1, 2, 3].map((e, index) => {
                        return (
                            <div key={index}>
                                <h3>hey</h3>
                                <p>artiest:alvin</p>
                            </div>
                        );
                    })}
                </div>
            </Grid>
        </Grid>
    );
}
