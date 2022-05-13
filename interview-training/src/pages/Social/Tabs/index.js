import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import { AppContext } from '../../../App';
import axios from 'axios';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import { useLocation, useParams } from 'react-router-dom';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Card from '../Card';
import VideoCard from '../VideoCard';
let allArticles;

export default function LabTabs() {
    const [value, setValue] = React.useState('1');
    const { Constant } = useContext(AppContext);

    const { id } = useParams();
    const [display, setDisplay] = React.useState(false);
    const [article, setArticle] = React.useState(null);
    const [articles, setArticles] = React.useState(null);
    const [codeArticles, setCodeArticles] = React.useState(null);
    const [videoArticles, setVideoArticles] = React.useState(null);

    const [authors, setAuthors] = React.useState(null);
    const [videoAuthors, setVideoAuthors] = React.useState(null);

    const baseURL = `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/article`;
    const codeURL = `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/article/code`;
    const videoURL = `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/article/video`;

    const jobType = localStorage.getItem('jobType');
    const [isArticle, setIsArticle] = React.useState(false);
    const { cardContainer } = React.useRef();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    React.useEffect(() => {
        // async function getArticles() {
        //     try {
        //         allArticles = await axios.get(baseURL, {
        //             params: {
        //                 profession: jobType,
        //             },
        //         });

        //         setArticles(allArticles['data']['articles']);
        //         setAuthors(allArticles['data']['authors']);
        //     } catch (error) {
        //         console.log(error);
        //     }
        // }
        // getArticles();

        async function getCodeArticles() {
            try {
                allArticles = await axios.get(codeURL);

                console.log(allArticles);
                setCodeArticles(allArticles['data']);
                setAuthors(allArticles['data']['authors']);
            } catch (error) {
                console.log(error);
            }
        }
        getCodeArticles();

        async function getVideoArticles() {
            try {
                allArticles = await axios.get(videoURL);

                console.log('getVideoArticles', allArticles);
                setVideoArticles(allArticles['data']);
                setVideoAuthors(allArticles['data']['authors']);
            } catch (error) {
                console.log(error);
            }
        }
        getVideoArticles();
    }, []);

    React.useEffect(() => {
        console.log('isArticle', isArticle);
    }, [isArticle]);
    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Code" value="1" />
                        <Tab label="Video" value="2" />
                    </TabList>
                </Box>
                <div id="card-container" ref={cardContainer}>
                    <TabPanel value="1">
                        {codeArticles
                            ? Object.keys(codeArticles['articles']).map((qid, index) => {
                                  return (
                                      <Card
                                          key={index}
                                          title={codeArticles['articles'][qid][0]['title']}
                                          description={codeArticles['articles'][qid][0]['description']}
                                          qid={qid}
                                          codeArticles={codeArticles}
                                      />
                                  );
                              })
                            : null}
                    </TabPanel>
                    <TabPanel value="2">
                        {videoArticles
                            ? Object.keys(videoArticles['articles']).map((qid, index) => {
                                  return (
                                      <VideoCard
                                          key={index}
                                          title={videoArticles['articles'][qid][0]['title']}
                                          description={videoArticles['articles'][qid][0]['description']}
                                          qid={qid}
                                          videoArticles={videoArticles}
                                      />
                                  );
                              })
                            : null}
                    </TabPanel>
                </div>
            </TabContext>
        </Box>
    );
}
