import './index.scss';
import React, { useContext } from 'react';
import { AppContext } from '../../App';

import axios from 'axios';
import Card from './Card';
import Article from './Article';
import BasicChips from './Tags';
import { useLocation, useParams } from 'react-router-dom';
import { useRef } from 'react';

import './index.scss';

let allArticles;

function Social() {
    const { Constant } = useContext(AppContext);

    const { id } = useParams();
    const [display, setDisplay] = React.useState(false);
    const [article, setArticle] = React.useState(null);
    const [articles, setArticles] = React.useState(null);
    const baseURL = `${Constant}/article`;
    const jobType = sessionStorage.getItem('jobType');
    const [isArticle, setIsArticle] = React.useState(false);
    const { cardContainer } = React.useRef();

    React.useEffect(() => {
        async function getArticles() {
            try {
                allArticles = await axios.get(baseURL, {
                    params: {
                        profession: jobType,
                    },
                });

                setArticles(allArticles['data']);
                console.log('allArticles', allArticles);
            } catch (error) {
                console.log(error);
            }
        }
        getArticles();
    }, []);

    React.useEffect(() => {
        console.log('isArticle', isArticle);
    }, [isArticle]);

    return (
        <>
            <div>
                {id ? (
                    <Article />
                ) : (
                    <>
                        <BasicChips />
                        <div id="card-container" ref={cardContainer}>
                            {articles
                                ? articles.map((article, index) => {
                                      return <Card key={index} title={article['title']} description={article['description']} href={article['_id']} isArticle={setIsArticle} />;
                                  })
                                : null}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default Social;
