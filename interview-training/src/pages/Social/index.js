import './index.scss';
import React from 'react';
import Article from './Article';
import Tabs from './Tabs';
import { useParams } from 'react-router-dom';

import './index.scss';

function Social() {
  const { id } = useParams();

  return <div>{id ? <Article /> : <Tabs />}</div>;
}

export default Social;
