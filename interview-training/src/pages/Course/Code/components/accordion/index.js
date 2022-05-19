import React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import CodeEditor from '@uiw/react-textarea-code-editor';
import Grid from '@mui/material/Grid';
const Accordion = styled((props) => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />} {...props} />)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function CustomizedAccordions(props) {
  const [expanded, setExpanded] = React.useState('panel1');
  // const [answerStatus, setAnswerStatus] = React.useStatu('fail');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  // React.useEffect(
  //     (e) => {
  //         if (e.code_answer.answer_status === 1) {
  //             setAnswerStatus('Success');
  //         }
  //     },
  //     [answerStatus]
  // );

  return (
    <div>
      {props.userLogs
        ? props.userLogs.map((e, index) => {
            return (
              <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} key={index}>
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                  <Typography>{e.create_dt.replace('T', ' ').replace('Z', ' ').split('.', 1)}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <CodeEditor
                        value={e.content}
                        language={e.language}
                        placeholder="Please enter JS code."
                        padding={15}
                        style={{
                          fontSize: 12,
                          backgroundColor: '#e4e4e4',
                          fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                        }}
                      />
                    </Grid>
                    <Grid item xs={4} className="history-div">
                      {e.code_answer.answer_status === 1 ? (
                        <div className="history-div">
                          <a>Success</a>
                          <br />
                          花費時間:{e.code_answer.run_time}{' '}
                        </div>
                      ) : (
                        <a>Fail</a>
                      )}
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            );
          })
        : null}
    </div>
  );
}
