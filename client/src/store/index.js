/** 
 * import reducers, create store, export provider component
 */

import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { reducer } from './reducers';

const store = createStore(reducer, applyMiddleware(thunk));

export default function StoreProvider(props) {
  return <Provider store={store} {...props} />;
}