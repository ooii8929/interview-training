import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SelectAutoWidth(props) {
  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 200 }}>
        <InputLabel id="demo-simple-select-autowidth-label">面試的工作類型</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={props.profession}
          onChange={props.onJobChange}
          autoWidth
          label="請選擇你要練習的JOB類型"
        >
          <MenuItem value={'Backend'}>Backend</MenuItem>
          <MenuItem value={'Frontend'}>Frontend</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
