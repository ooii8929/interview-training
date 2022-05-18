import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Grid from '@mui/material/Grid';
import TutorCard from './../TutorCard';
import Typography from '@mui/material/Typography';
export default function LabTabs(props) {
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="近期課程" value="1" />
                        <Tab label="過去課程" value="2" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <Grid container columns={12} className="account-box-grid" spacing={4}>
                        {props.appointments
                            ? props.appointments.map((appointment, index) => {
                                  return (
                                      <Grid item xs={4} key={index} className="account-box-grid-self">
                                          <TutorCard
                                              key={index}
                                              tutor={appointment['name']}
                                              profession={appointment['profession']}
                                              picture={appointment['picture']}
                                              tID={appointment['question_id']}
                                              createDT={appointment['available_time'].replace('T', ' ').replace('Z', ' ').split('.', 1)}
                                              href={appointment['course_url']}
                                          />
                                      </Grid>
                                  );
                              })
                            : null}
                    </Grid>
                </TabPanel>
                <TabPanel value="2">
                    {props.appointmentsFinished ? (
                        <Grid container columns={12} className="account-box-grid" spacing={4}>
                            {props.appointmentsFinished.map((appointment, index) => {
                                return (
                                    <Grid item xs={4} key={index} className="account-box-grid-self">
                                        <TutorCard
                                            key={index}
                                            tutor={appointment['name']}
                                            profession={appointment['profession']}
                                            picture={appointment['picture']}
                                            tID={appointment['question_id']}
                                            createDT={appointment['available_time'].replace('T', ' ').replace('Z', ' ').split('.', 1)}
                                        />
                                    </Grid>
                                );
                            })}
                        </Grid>
                    ) : null}
                </TabPanel>
            </TabContext>
        </Box>
    );
}
