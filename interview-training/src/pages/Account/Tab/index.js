import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Card from '../Card';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`vertical-tabpanel-${index}`} aria-labelledby={`vertical-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function VerticalTabs(props) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 224 }}>
      <Tabs orientation="vertical" variant="scrollable" value={value} onChange={handleChange} aria-label="Vertical tabs example" sx={{ borderRight: 1, borderColor: 'divider' }}>
        {props.training
          ? props.training.map((e, index) => {
              return <Tab key={index} label={e['create_dt'].replace('T', ' ').replace('Z', ' ').split('.', 1)} {...a11yProps(index)} />;
            })
          : null}
      </Tabs>

      {props.training
        ? props.training.map((e, index) => {
            return (
              <TabPanel value={value} index={index} key={index}>
                <Card sx={{ mb: 5 }} video={e['video']} code={e['code']} questionID={e['_id']} setAllTraining={props.setAllTraining} />
              </TabPanel>
            );
          })
        : null}
    </Box>
  );
}
