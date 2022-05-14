import React from 'react';

import './index.scss';

import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import './components/main.css';
// import { Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';

import { useParams } from 'react-router-dom';

import CodeMain from './CodeMain';
import VideoMain from './VideoMain';

export default function SocialArticle() {
    const { category } = useParams();

    console.log('category', category);
    return (
        <>
            {category === 'code' ? <CodeMain /> : null}
            {category === 'video' ? <VideoMain /> : null}
        </>
    );
}
