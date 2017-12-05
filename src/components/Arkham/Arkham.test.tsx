/**
 * Copyright (c) 2017, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */

 import {set} from 'lodash';
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
          return set(state, 'testAction', data.testVar);
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
    expect(rendered).toBeDefined();
  });
});
