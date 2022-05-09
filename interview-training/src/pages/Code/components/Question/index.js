import React, { useContext } from 'react';
import { AppContext } from '../../../../App';

import { Box, Grid } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import CodeEditor from '@uiw/react-textarea-code-editor';
import Accordion from './components/accordion';
// import Select from "./select";

let response;
const defaultLanguage = 'javascript';
let languages = ['javascript', 'python'];

const steps = [
    {
        label: 'Select campaign settings',
        description: `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`,
    },
    {
        label: 'Create an ad group',
        description: 'An ad group contains one or more ads which target a shared set of keywords.',
    },
    {
        label: 'Create an ad',
        description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`,
    },
];

export default function Question() {
    const { Constant } = useContext(AppContext);

    const [language, setLanguage] = React.useState(defaultLanguage);
    const [code, setCode] = React.useState(null);
    const [questionID, setQuestionID] = React.useState(null);
    const [post, setPost] = React.useState(null);
    const [runCodeResponse, setRunCodeResponse] = React.useState(null);
    const [runCodeResponseStatus, setRunCodeResponseStatus] = React.useState(null);
    const [runCodeResponseInput, setRunCodeResponseInput] = React.useState(null);
    const [runCodeResponseOutput, setRunCodeResponseOutput] = React.useState(null);
    const [runCodeResponseExpect, setRunCodeResponseExpect] = React.useState(null);
    const [userCodeLogs, setUserCodeLogs] = React.useState(null);

    const jobType = localStorage.getItem('jobType');
    const userId = localStorage.getItem('userid');

    const [answer, setAnswer] = React.useState(null);
    const baseURL = `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/training/questions`;

    async function runCode() {
        try {
            response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/training/run/compile`, {
                question_id: questionID,
                language: language,
                content: code,
            });
            console.log('run code response', response);
            setRunCodeResponse(response['data']);
            if (response['data']['answer_status'] == -1) {
                setRunCodeResponseStatus('Fail');
            } else {
                setRunCodeResponseStatus('Success');
            }
            setRunCodeResponseInput(response['data']['input']);
            setRunCodeResponseOutput(response['data']['output']);
            setRunCodeResponseExpect(response['data']['except']);
        } catch (error) {
            console.error(error);
        }
    }

    React.useEffect(() => {
        async function getPost() {
            console.log('run get post');
            try {
                response = await axios.get(baseURL, {
                    params: {
                        profession: 'backend',
                    },
                });
                console.log('get run response', response);
                setQuestionID(response['data'][0]['id']);
                setPost(response['data']);
                setCode(response['data'][0][language]);
            } catch (error) {
                console.log(error);
            }
        }
        getPost();
    }, []);

    // change code by language
    const isInitialMount = React.useRef(true);
    // const isInitialLanguage = React.useRef(language);

    React.useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            console.log('run code by language , response => ', response);
            console.log('run code by language', language);
            // Your useEffect code here to be run on update
            setCode(response['data'][0][language]);
        }
    }, [language]);

    // submit answer
    async function submitAnswer(e) {
        response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/training/submit/compile/`, {
            user_id: userId,
            question_id: questionID,
            content: code,
            language: language,
        });
        setRunCodeResponse(response['data']);
        if (response['data']['answer_status'] === -1) {
            setRunCodeResponseStatus('Fail');
        } else {
            setRunCodeResponseStatus('Success');
        }
        setRunCodeResponseInput(response['data']['input']);
        setRunCodeResponseOutput(response['data']['output']);
        setRunCodeResponseExpect(response['data']['except']);
        await getUserCodeLog(questionID);
    }

    async function getUserCodeLog(questionID) {
        let codeLog = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/user/code/log`, {
            params: {
                question_id: questionID,
                user_id: userId,
            },
        });
        setUserCodeLogs(codeLog.data);
    }
    let steps = [post, 'answer'];
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <Box>
            <Stepper activeStep={activeStep} orientation="vertical">
                {post
                    ? post.map((e, index) => {
                          return (
                              <Step key={index}>
                                  <StepLabel optional={index === 2 ? <Typography variant="caption">Last step</Typography> : null}>{e.title}</StepLabel>
                                  <StepContent>
                                      {e.title}
                                      <div dangerouslySetInnerHTML={{ __html: e.description }}></div>
                                      <div className="ControlsBox">
                                          <select onChange={(e) => setLanguage(e.target.value)}>
                                              {languages.map((theme, index) => {
                                                  return (
                                                      <option key={index} value={theme}>
                                                          {theme}
                                                      </option>
                                                  );
                                              })}
                                          </select>
                                      </div>
                                      {steps
                                          ? steps.map((e, i) => {
                                                return (
                                                    <div key={i}>
                                                        <div>{e.title}</div>
                                                        <CodeEditor
                                                            value={code}
                                                            language={language}
                                                            placeholder="Please enter JS code."
                                                            onChange={(evn) => setCode(evn.target.value)}
                                                            padding={15}
                                                            style={{
                                                                fontSize: 12,
                                                                backgroundColor: '#f5f5f5',
                                                                fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                                                            }}
                                                        />
                                                    </div>
                                                );
                                            })
                                          : null}
                                      {runCodeResponse ? (
                                          <>
                                              <Grid container spacing={{ md: 4 }} columns={{ md: 12 }} className="runcode-container">
                                                  <Grid item xs={1} className="runcode-result-label">
                                                      <p>測試結果</p>
                                                  </Grid>
                                                  <Grid item xs={4} className="runcode-result">
                                                      <div> {runCodeResponseStatus}</div>
                                                  </Grid>
                                                  <Grid item xs={1} className="runcode-result-label">
                                                      <p>測試數據</p>
                                                  </Grid>
                                                  <Grid item xs={4} className="runcode-result">
                                                      <div>{runCodeResponseInput}</div>
                                                  </Grid>
                                              </Grid>
                                              <Grid container spacing={{ md: 4 }} columns={{ md: 12 }} className="runcode-container">
                                                  <Grid item xs={1} className="runcode-result-label">
                                                      <p>期待答案</p>
                                                  </Grid>
                                                  <Grid item xs={4} className="runcode-result">
                                                      <div>{runCodeResponseExpect}</div>
                                                  </Grid>
                                                  <Grid item xs={1} className="runcode-result-label">
                                                      <p>你的答案</p>
                                                  </Grid>

                                                  <Grid item xs={4} className="runcode-result">
                                                      <div>{runCodeResponseOutput}</div>
                                                  </Grid>
                                              </Grid>
                                          </>
                                      ) : null}

                                      {userCodeLogs ? <Accordion userLogs={userCodeLogs} /> : null}
                                      <Button variant="contained" className="run-answer" data-question={e.id} sx={{ mt: 1, mr: 1 }} onClick={runCode}>
                                          跑看看
                                      </Button>
                                      <Button variant="contained" className="run-answer" data-question={e.id} onClick={submitAnswer} sx={{ mt: 1, mr: 1 }}>
                                          提交答案
                                      </Button>

                                      <Box sx={{ mb: 2 }}>
                                          <div>
                                              <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
                                                  {index === e.length - 1 ? 'Finish' : 'Continue'}
                                              </Button>
                                              <Button disabled={index === 0} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                                                  Back
                                              </Button>
                                          </div>
                                      </Box>
                                  </StepContent>
                              </Step>
                          );
                      })
                    : null}
            </Stepper>
            {activeStep === steps.length && (
                <Paper square elevation={0} sx={{ p: 3 }}>
                    <Typography>All steps completed - you&apos;re finished</Typography>
                    <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                        Reset
                    </Button>
                </Paper>
            )}
        </Box>
    );
}
