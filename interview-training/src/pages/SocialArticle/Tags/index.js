import React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

export default function BasicChips(props) {
  const [category, setCategory] = React.useState('');
  React.useEffect(() => {}, [category]);

  return (
    <div className="tags-container">
      <Stack direction="row" spacing={1}>
        <Chip
          label="Backend"
          clickable={true}
          onClick={() => {
            setCategory('Backend');
          }}
        />
        <Chip
          label="Frontend"
          variant="outlined"
          clickable={true}
          onClick={() => {
            setCategory('Frontend');
          }}
        />
      </Stack>
    </div>
  );
}
