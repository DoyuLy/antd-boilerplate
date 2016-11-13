import 'antd/dist/antd.css'
import 'babel-polyfill'
import * as React from 'react';
import {render} from 'react-dom'
import 'react-router'
import 'antd'
import {useStrict} from 'mobx'
import App from './App';
// import './models/globals/index'

useStrict(true)

const rootEl = document.getElementById('root');

render(<App/>, rootEl);

