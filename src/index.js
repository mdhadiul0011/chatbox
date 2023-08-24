import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import firebaseConfig from './dbConnection/firebaseConfig';
import App from './App';
import { Provider } from 'react-redux'
import store from './features/store/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}> <App /> </Provider>
);

