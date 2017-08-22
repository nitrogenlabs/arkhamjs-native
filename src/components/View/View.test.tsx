import * as React from 'react';
import * as renderer from 'react-test-renderer';
import {View} from './View';

describe('View', () => {
  let rendered;

  beforeAll(() => {
    // Render
    const history = {};
    const location = {};
    const match = {};

    rendered = renderer.create(<View history={history} location={location} match={match}/>);
  });

  it('should render null initially', () => {
    return expect(rendered).toBeDefined();
  });
});
