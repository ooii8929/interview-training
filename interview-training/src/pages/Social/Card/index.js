import * as React from 'react';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

import './main.scss';
export default function BasicCard(props) {
    return (
        <div
            className="card"
            onClick={() => {
                props.isArticle(props.href);
            }}
        >
            <Link to={`/social/${props.href}`}>
                <div className="ovelay"> </div>
                <header className="user">
                    <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                        alt=""
                    />
                    <div className="user-info">
                        <h2 className="user-info-name">{props.authorName}</h2>
                        <p className="user-info-time">{props.postTime.replace('T', ' ').replace('Z', ' ')}</p>
                    </div>
                </header>
                <main>
                    <h2>{props.title}</h2>
                    <p className="social-desc">{props.description} </p>
                    <p>{props.language}</p>
                </main>
                <section>
                    <div className="users-avatars">
                        <img
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80"
                            alt=""
                        />
                        <img
                            src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                            alt=""
                        />
                        <img
                            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80"
                            alt=""
                        />
                    </div>
                    <p>{props.liked.length} 人推薦這篇內容</p>
                    <p className="comment">{props.reply.length} 人參與回覆</p>
                </section>
            </Link>
        </div>
    );
}
