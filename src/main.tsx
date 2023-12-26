import App from './component/App'
import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import store from './redux/store';
import { Provider } from 'react-redux';

createRoot(document.getElementById('app')).render(
    <React.StrictMode>
        <Provider store={store}>
            <div>hh</div>
            <App />
        </Provider>
    </React.StrictMode>
);