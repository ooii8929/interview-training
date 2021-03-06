import React from 'react';
import Box from '@mui/material/Box';
import axios from 'axios';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Card from '../Card';
import VideoCard from '../VideoCard';
let allArticles;

export default function LabTabs() {
  const [value, setValue] = React.useState('1');

  const [codeArticles, setCodeArticles] = React.useState(null);
  const [videoArticles, setVideoArticles] = React.useState(null);

  const codeURL = `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/article/code`;
  const videoURL = `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/article/record`;

  const { cardContainer } = React.useRef();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  React.useEffect(() => {
    async function getCodeArticles() {
      try {
        allArticles = await axios.get(codeURL);

        console.log(allArticles);
        setCodeArticles(allArticles['data']);
      } catch (error) {
        console.log(error);
      }
    }
    getCodeArticles();

    async function getVideoArticles() {
      try {
        allArticles = await axios.get(videoURL);

        setVideoArticles(allArticles['data']);
      } catch (error) {
        console.log(error);
      }
    }
    getVideoArticles();
  }, []);

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
