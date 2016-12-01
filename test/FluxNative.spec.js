import {expect} from 'chai';
import sinon from 'sinon';
import {FluxNative as Flux, Store} from '../src';
import {AsyncStorage} from 'react-native';

describe('FluxNative', () => {
  let store, localSetSpy, sessionSetSpy, sessionSpy;
  const val = 'hello_world';
  const key = 'test';

  class Test extends Store {
    initialState() {
      return {
        item: 'default',
        testAction: 'default'
      };
    }

    onAction(type, data, state) {
      switch(type) {
        case 'TEST_EVENT':
          return state.set('testAction', data.testVar);
      }
    }
  }

  before(() => {
    // Vars
    Flux._useCache = true;

    // Spy
    sessionSpy = sinon.spy(Flux, 'setSessionData');

    // Method
    store = Flux.registerStore(Test);
  });

  after(() => {
    sessionSpy.restore();
  });

  describe('#off', () => {
    it('should remove a listener', () => {
      const spy = sinon.spy();
      Flux.on('test', spy);
      Flux.off('test', spy);
      Flux.dispatch({type: 'test'});

      return expect(spy.called).to.be.false;
    });
  });

  describe('#dispatch', () => {
    let eventSpy;

    before(() => {
      // Spy
      eventSpy = sinon.spy();
      Flux.on('TEST_EVENT', eventSpy);

      // Method
      Flux.dispatch({type: 'TEST_EVENT', testVar: 'test'});
    });

    after(() => {
      Flux.off('TEST_EVENT', eventSpy);
    });

    it('should alter the store data', () => {
      const item = Flux.getStore(['test', 'testAction']);
      return expect(item).to.eq('test');
    });

    it('should dispatch an event', () => {
      return expect(eventSpy.called).to.be.true;
    });
  });

  describe('#getStore', () => {
    it('should get a global store', () => {
      const item = Flux.getStore();
      return expect(item.getIn(['test', 'item'])).to.eq('default');
    });

    it('should get a specific store', () => {
      const item = Flux.getStore('test');
      return expect(item.get('item')).to.eq('default');
    });

    it('should get a specific item within a store', () => {
      const item = Flux.getStore(['test', 'item']);
      return expect(item).to.eq('default');
    });
  });

  describe('#registerStore', () => {
    it('should save the class', () => {
      const cls = Flux._storeClasses.get('test');
      return expect(cls.name).to.eq('test');
    });

    it('should set the initial value', () => {
      const item = Flux._store.getIn(['test', 'item']);
      return expect(item).to.eq('default');
    });

    it('should save store in cache', () => {
      return expect(sessionSpy.called).to.be.true;
    });

    it('should return the class', () => {
      return expect(store.name).to.eq('test');
    });
  });

  describe('#getClass', () => {
    it('should get a class', () => {
      const cls = Flux.getClass('test');
      return expect(cls.name).to.eq('test');
    });
  });

  describe('#enableDebugger', () => {
    it('should enable debugger', () => {
      Flux.enableDebugger();
      return expect(Flux._debug).to.be.true;
    });

    it('should disable debugger', () => {
      Flux.enableDebugger(false);
      return expect(Flux._debug).to.be.false;
    });
  });

  describe('#deregisterStore', () => {
    before(() => {
      // Method
      Flux.deregisterStore('test');
    });

    it('should remove class', () => {
      return expect(Flux._storeClasses.has('test')).to.be.false;
    });

    it('should remove store data', () => {
      return expect(Flux._store.has('test')).to.be.false;
    });
  });

  describe('#setSessionData', () => {
    let sessionSetSpy;

    before(() => {
      sessionSetSpy = sinon.spy(AsyncStorage, 'setItem');
    });

    after(() => {
      sessionSetSpy.restore();
    });

    it('should set session data', () => {
      // Method
      return Flux.setSessionData(key, val)
        .then(() => {
          return expect(sessionSetSpy.called).to.be.true;
        });
    });
  });

  describe('#getSessionData', () => {
    it('should get session data', () => {
      // Method
      Flux.setSessionData(key, val);
      return Flux.getSessionData(key)
        .then(testVal => {
          return expect(testVal).to.eq(val);
        });
    });
  });

  describe('#delSessionData', () => {
    let sessionDelSpy;

    before(() => {
      sessionDelSpy = sinon.spy(AsyncStorage, 'removeItem');
    });

    after(() => {
      sessionDelSpy.restore();
    });

    it('should remove session data', () => {
      // Method
      return Flux.delSessionData(key)
        .then(results => {
          return expect(sessionDelSpy.called).to.be.true;
        });
    });
  });
});