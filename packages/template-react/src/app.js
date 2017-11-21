import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import Loadable from 'react-loadable';

import { render, Miss } from 'hops-react';
import { createContext } from 'hops-redux';

import reducers from './reducers';

const Home = Loadable({
  loader: () => import('./home').then(({ Home }) => Home),
  loading: () => (<div>loading...</div>),
  modules: ['./home']
});

const Counter = Loadable({
  loader: () => import('./counter').then(({ Counter }) => Counter),
  loading: () => (<div>loading...</div>),
  modules: ['./counter']
});

const App = () => (
  <div>
    <nav>
      <Link to='/'>Home</Link>&nbsp;
      <Link to='/counter'>Counter</Link>
    </nav>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/counter' component={Counter} />
      <Miss />
    </Switch>
  </div>
);

export default render(
  <App />,
  createContext({ reducers })
);
