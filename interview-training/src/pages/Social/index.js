import './index.scss';
import React, { useContext } from 'react';
import { AppContext } from '../../App';
import axios from 'axios';
import Card from './Card';
import Article from './Article';
import Tabs from './Tabs';
import { useLocation, useParams } from 'react-router-dom';
import { useRef } from 'react';
import './index.scss';

let allArticles;

function Social() {
    const { id } = useParams();

    return <div>{id ? <Article /> : <Tabs />}</div>;
}

export default Social;
