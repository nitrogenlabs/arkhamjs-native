import {SpyInstance} from 'jest';
import * as React from 'react';
import * as renderer from 'react-test-renderer';
import {Store} from '../../Store/Store';
import {Arkham} from './Arkham';

describe('Arkham', () => {
  let rendered;

  class TestStore extends Store {
    constructor() {
      super('test');
    }

    initialState(): object {
      return {
        item: 'default',
        testAction: 'default',
        testUpdate: 'default'
      };
    }

    onAction(type, data, state): object {
      switch(type) {
        case 'TEST_EVENT':
          return state.set('testAction', data.get('testVar'));
        default:
          return state;
      }
    }
  }

  beforeAll(() => {
    // Render
    const props = {
      stores: [TestStore]
    };

    rendered = renderer.create(<Arkham {...props}/>);
  });

  it('should render null initially', () => {
    return expect(rendered).toBeDefined();
  });
});
