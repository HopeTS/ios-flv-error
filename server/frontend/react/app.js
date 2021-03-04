import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import 'normalize.css/normalize.css';

import '../sass/main.scss';
import Home from './components/Home';

const $appRoot = document.querySelector('#app');
const jsx = (
    <div>
        <Home />
    </div>
);

ReactDOM.render(jsx, $appRoot);