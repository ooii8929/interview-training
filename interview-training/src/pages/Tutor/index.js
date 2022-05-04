import Fragment from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import RCT from './components/RTC';
import { useParams } from 'react-router-dom';
import './index.scss';

export default function Course() {
    return (
        <div>
            <RCT />
        </div>
    );
}
