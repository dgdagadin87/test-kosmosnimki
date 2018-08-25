import 'core-js/es6/map';
import 'core-js/es6/set';
import 'core-js/es6/promise';

import '../../../css/style.css';

import React from 'react';
import reactDom from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk'
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

import history from '../../service/history';
import allReducers from './reducers/reducers';

import AppContainer from './components/AppContainer';

const rootDomComponent = document.getElementById('main-body');

const store = createStore(allReducers, applyMiddleware(thunk));

reactDom.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Switch>
                <Route
                    path="/"
                    render={ (props) => <AppContainer {...props} /> }
                />
            </Switch>
        </ConnectedRouter>
    </Provider>,
    rootDomComponent
);