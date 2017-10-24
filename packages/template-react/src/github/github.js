// @flow
import React from 'react';
import { graphql, gql } from 'react-apollo';

import Commit from './commit';

const Repo = ({ data: { loading, github } }) => (
  loading && !github ? (<span>loading...</span>) : (
    <div>
      {github.repo.commits.map(commit => (
        <Commit commit={commit} key={commit.sha} />
      ))}
    </div>
  )
);

export default graphql(gql`
  query Repo {
    github {
      repo(ownerUsername: "xing", name: "hops") {
        commits(limit: 10) {
          sha
          ...Commit
        }
      }
    }
  }
  ${Commit.fragments.commit}
`)(Repo);
