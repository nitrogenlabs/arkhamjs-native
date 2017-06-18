import 'react-native';
// import React from 'react';
// import renderer from 'react-test-renderer';
import Arkham from '../../src/components/Arkham';
import Flux from '../../src/Flux';
import Store from '../../src/Store';

describe('Arkham', () => {
  let rendered;

  class TestStore extends Store {
    constructor() {
      super('test');
    }

    initialState() {
      return {
        item: 'default',
        testUpdate: 'default',
        testAction: 'default'
      };
    }

    onAction(type, data, state) {
      switch(type) {
        case 'TEST_EVENT':
          return state.set('testAction', data.get('testVar'));
      }
    }
  }

  beforeAll(() => {
    // Render
    const props = {
      stores: [TestStore]
    };
    
    rendered = new Arkham(props);
  });

  it('should render null initially', () => {
    return expect(rendered.render()).toBe(null);
  });

  describe('#componentWillMount', () => {
    const initSpy = jest.spyOn(Flux, 'onInit');
    const registerSpy = jest.spyOn(Flux, 'registerStore');

    beforeAll(() => {
      rendered.componentWillMount();
    });

    afterAll(() => {
      initSpy.mockRestore();
      registerSpy.mockRestore();
    });

    it('should initialize Flux', () => {
      expect(initSpy).toHaveBeenCalled();
    });

    it('should register stores', () => {
      return expect(registerSpy).toHaveBeenCalled();
    });
  });

  describe('#componentWillUnmount', () => {
    const initSpy = jest.spyOn(Flux, 'offInit');

    beforeAll(() => {
      rendered.componentWillUnmount();
    });

    afterAll(() => {
      initSpy.mockRestore();
    });

    it('should remove initialization listeners', () => {
      return expect(initSpy).toHaveBeenCalled();
    });
  });

  describe('#onInit', () => {
    beforeAll(() => {
      rendered.onInit();
    });

    it('should set state to initialized', () => {
      // rendered = renderer.create(<Arkham/>);
      return expect(rendered.render()).toBe(null);
    });
  });
});
