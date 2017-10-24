// @flow
import React from 'react';
import { graphql, gql } from 'react-apollo';

const Commit = ({ commit: { sha, message, author: { login: author } } }) => (
  <p>
    <a href={`https://github.com/xing/hops/commit/${sha}`}>{message}</a>
    <span> by </span>
    <a href={`https://github.com/${author}`}>{author}</a>
  </p>
);

Commit.fragments = {
  commit: gql`
    fragment Commit on GithubCommit {
      sha
      message
      author {
        ... on GithubUser {
          login
        }
      }
    }
  `
};

export default Commit;
