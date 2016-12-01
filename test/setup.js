import fs from 'fs';
import path from 'path';
import register from 'babel-core/register';
import chai from 'chai';

// Ignore all node_modules except these
const modulesToCompile = [
  'react-native',
  'react-native-mock',
  'react-native-simple-store'
].map((moduleName) => new RegExp(`/node_modules/${moduleName}`));
const rcPath = path.join(__dirname, '..', '.babelrc');
const source = fs.readFileSync(rcPath).toString();
const config = JSON.parse(source);
config.ignore = function(filename) {
  if(!(/\/node_modules\//).test(filename)) {
    return false;
  } else {
    const matches = modulesToCompile.filter((regex) => regex.test(filename));
    return matches.length === 0;
  }
};

register(config);
// Setup globals / chai
global.__DEV__ = true;
global.expect = chai.expect;

// Setup mocks
require('react-native-mock/mock');
const React = require('react-native');
React.NavigationExperimental = {
  AnimatedView: React.View
};