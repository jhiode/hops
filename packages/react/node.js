'use strict';

var path = require('path');
var React = require('react');
var ReactDOM = require('react-dom/server');
var ReactRouter = require('react-router');
var Helmet = require('react-helmet').Helmet;
var Loadable = require('react-loadable');

var hopsConfig = require('hops-config');


var Context = require('./lib/common').Context;
var defaultTemplate = require('./lib/template');

function getChunks(stats, modules) {
  return stats.chunks.filter(function (chunk) {
    return chunk.modules.some(function (module) {
      return module.reasons.some(function (reason) {
        return modules.indexOf(reason.userRequest) > -1;
      });
    });
  }).map(function (chunk) {
    return chunk.files.find(function (file) {
      return file.slice(-3) === '.js';
    });
  });
}


exports.Context = exports.createContext = Context.extend({
  clone: function (request) {
    return new this.constructor(Object.assign(
      {},
      this.options,
      { request: request }
    ));
  },
  initialize: function (options) {
    this.request = options.request || {};
    this.template = options.template || defaultTemplate;
  },
  bootstrap: function () {
    return Promise.resolve();
  },
  enhanceElement: function (reactElement) {
    return React.createElement(
      ReactRouter.StaticRouter,
      {
        basename: hopsConfig.basePath,
        location: this.request.path,
        context: this
      },
      reactElement
    );
  },
  prepareRender: function (enhancedElement) {
    return Promise.resolve();
  },
  getTemplateData: function () {
    return {
      options: this.options,
      helmet: Helmet.renderStatic(),
      assets: hopsConfig.assets,
      manifest: hopsConfig.manifest,
      globals: []
    };
  },
  renderTemplate: function (markup, templateData) {
    return this.template(Object.assign(
      this.getTemplateData(),
      templateData,
      { markup: markup }
    ));
  }
});

exports.render = function (reactElement, context) {
  if (!(context instanceof exports.Context)) {
    context = new exports.Context(context);
  }
  return function (req, res, next) {
    var reqContext = context.clone(req);
    reqContext.bootstrap().then(function () {
      var enhancedElement = reqContext.enhanceElement(reactElement);
      return context.prepareRender(enhancedElement)
        .then(Loadable.preloadAll)
        .then(function () {
          var stats = require(path.join(hopsConfig.cacheDir, 'stats.json'));
          var modules = [];
          var markup = ReactDOM.renderToString(
            React.createElement(
              Loadable.Capture,
              { report: function (moduleName) { modules.push(moduleName); }},
              enhancedElement
            )
          );
          if (reqContext.miss) {
            next();
          } else {
            if (reqContext.url) {
              res.status(reqContext.status || 301)
                .set('Location', reqContext.url);
            } else {
              res.status(reqContext.status || 200)
                .type('html');
              res.write(reqContext.renderTemplate(markup, { bundles: getChunks(stats, modules) }));
            }
            res.end();
          }
        });
    }).catch(next);
  };
};

Object.assign(exports, require('./lib/components'));
