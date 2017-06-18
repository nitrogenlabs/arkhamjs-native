import 'react-native';
// import React from 'react';
// import renderer from 'react-test-renderer';
import View from '../../src/components/View';

describe('View', () => {
  let rendered;

  beforeAll(() => {
    // Render
    const history = {};
    const location = {};
    const match = {};

    rendered = new View({history, location, match});
  });

  it('should render null initially', () => {
    return expect(rendered.render()).toEqual(null);
  });
});
