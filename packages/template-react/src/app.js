// @flow
import React from 'react';
import Helmet from 'react-helmet';
import { Route, Switch, Link } from 'react-router-dom';

import { render, Miss } from 'hops-react';
import { createContext } from 'hops-graphql';

import { Home } from './home';
import { Counter } from './counter';
import { GitHub } from './github';

import reducers from './reducers';

const App = () => (
  <div>
    <Helmet>
      <title>Hops Demo</title>
    </Helmet>
    <nav>
      <Link to='/'>Home</Link>&nbsp;
      <Link to='/counter'>Counter</Link>&nbsp;
      <Link to='/github'>GitHub</Link>
    </nav>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/counter' component={Counter} />
      <Route exact path='/github' component={GitHub} />
      <Miss />
    </Switch>
  </div>
);

export default render(
  <App />,
  createContext({ reducers })
);
