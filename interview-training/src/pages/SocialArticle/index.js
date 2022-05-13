import './index.scss';

import React, { useRef, useEffect, useContext, useState, Component } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import Swal from 'sweetalert2';
import axios from 'axios';
import { AppContext } from '../../App';
import './components/main.css';
// import { Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';

import { useParams, useLocation, useNavigate } from 'react-router-dom';

import { Grid, Box } from '@mui/material';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import CodeEditor from '@uiw/react-textarea-code-editor';
import CodeMain from './CodeMain';
import VideoMain from './VideoMain';
let allArticles;

export default function SocialArticle() {
    let navigate = useNavigate();

    const [message, setMessage] = React.useState(null);
    const { category, id } = useParams();
    const { Constant } = useContext(AppContext);
    const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty());
    const tringleGood = useRef(null);
    const tringleBad = useRef(null);
    const [articles, setArticles] = React.useState(null);
    // this article info
    const [articleInfo, setArticleInfo] = React.useState(null);
    const baseCodeURL = `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/article/code/id`;
    const baseVideoURL = `${process.env.REACT_APP_BASE_URL}/api/${process.env.REACT_APP_BASE_VERSION}/article/video/id`;

    const jobType = localStorage.getItem('jobType');
    const userId = localStorage.getItem('userid');
    const userName = localStorage.getItem('username');
    const userEmail = localStorage.getItem('useremail');
    const identity = localStorage.getItem('identity');

    const [goods, setGoods] = React.useState(null);
    const [language, setLanguage] = React.useState(null);
    const [isGood, setIsGood] = React.useState(false);
    const [authorPicture, setAuthorPicture] = React.useState('');
    const [comments, setComments] = React.useState('');
    const location = useLocation();

    console.log('category', category);
    return (
        <>
            {category === 'code' ? <CodeMain /> : null}
            {category === 'video' ? <VideoMain /> : null}
        </>
    );
}
