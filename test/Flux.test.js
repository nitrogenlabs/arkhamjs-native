import Flux from '../src/Flux';
import Store from '../src/Store';
import {AsyncStorage} from 'react-native';
import {mock, release} from 'mock-async-storage';
import Promise from 'bluebird';

describe('Flux', () => {
  let sessionSpy;
  let storePromise = Promise.resolve();
  const val = 'hello_world';
  const key = 'test';
  const cfg = {
    debugLevel: Flux.DEBUG_DISPATCH,
    name: 'arkhamjs',
    useCache: true,
    useImmutable: true
  };

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
    mock();

    // Configure
    Flux.config({useCache: false});

    // Spy
    sessionSpy = jest.spyOn(Flux, 'setSessionData');

    // Method
    storePromise = Flux.registerStore(TestStore);
  });

  afterAll(() => {
    sessionSpy.mockRestore();
    release();
  });

  describe('#clearAppData', () => {
    let promise, sessionSetSpy;

    beforeAll(() => {
      // Spy
      sessionSetSpy = jest.spyOn(AsyncStorage, 'setItem');

      // Set test data
      Flux.setStore(['test', 'item'], 'clear');

      // Method
      promise = Flux.clearAppData();
    });

    afterAll(() => {
      sessionSetSpy.mockRestore();
    });

    it('should re-initialize session data', () => {
      return promise
        .then(() => {
          return expect(sessionSetSpy.mock.calls.length).toBe(0);
        });
    });

    it('should reset the store data', () => {
      return promise
        .then(() => {
          return expect(Flux.getStore(['test', 'item'])).toBe('default');
        });
    });
  });

  describe('#config', () => {
    // Vars
    const opts = {
      debugLevel: Flux.DEBUG_LOGS,
      name: 'testApp',
      useCache: false,
      useImmutable: false
    };

    beforeAll(() => {
      // Method
      Flux.config(opts);
    });

    afterAll(() => {
      // Method
      Flux.config(cfg);
    });

    it('should set debugLevel', () => {
      expect(Flux._debugLevel).toBe(opts.debugLevel);
    });

    it('should set name', () => {
      expect(Flux._name).toBe(opts.name);
    });

    it('should set useCache', () => {
      expect(Flux._useCache).toBe(opts.useCache);
    });

    it('should set useImmutable', () => {
      expect(Flux._useImmutable).toBe(opts.useImmutable);
    });
  });

  describe('#debugError', () => {
    let consoleSpy;
    const msg = 'test';

    beforeAll(() => {
      // Spy
      consoleSpy = jest.spyOn(console, 'error');

      // Method
      Flux.debugError(msg);
    });

    afterAll(() => {
      consoleSpy.mockRestore();
    });

    it('should send data to console.error', () => {
      expect(consoleSpy.mock.calls[0][0]).toBe(msg);
    });
  });

  describe('#debugInfo', () => {
    let consoleSpy;
    const msg = 'test';

    beforeAll(() => {
      // Spy
      consoleSpy = jest.spyOn(console, 'info');

      // Method
      Flux.debugInfo(msg);
    });

    afterAll(() => {
      consoleSpy.mockRestore();
    });

    it('should send data to console.info', () => {
      expect(consoleSpy.mock.calls[0][0]).toBe(msg);
    });
  });

  describe('#debugLog', () => {
    let consoleSpy;
    const msg = 'test';

    beforeAll(() => {
      // Spy
      consoleSpy = jest.spyOn(console, 'log');

      // Method
      Flux.debugLog(msg);
    });

    afterAll(() => {
      consoleSpy.mockRestore();
    });

    it('should send data to console.log', () => {
      expect(consoleSpy.mock.calls[0][0]).toBe(msg);
    });
  });

  describe('#delSessionData', () => {
    let sessionDelSpy;

    beforeAll(() => {
      sessionDelSpy = jest.spyOn(AsyncStorage, 'removeItem');
    });

    afterAll(() => {
      sessionDelSpy.mockRestore();
    });

    it('should remove session data', () => {
      // Method
      return Flux.delSessionData(key)
        .then(() => {
          return expect(sessionDelSpy.mock.calls.length).toBe(1);
        });
    });
  });

  describe('#deregisterStore', () => {
    beforeAll(() => {
      // Method
      Flux.deregisterStore('test');
    });

    afterAll(() => {
      // Method
      Flux.registerStore(TestStore);
    });

    it('should remove class', () => {
      expect(Flux._storeClasses.has('test')).toBe(false);
    });

    it('should remove store data', () => {
      expect(Flux._store.has('test')).toBe(false);
    });
  });

  describe('#dispatch', () => {
    let action, eventSpy;

    beforeAll(async() => {
      // Spy
      eventSpy = jest.fn();
      Flux.on('TEST_EVENT', eventSpy);

      // Method
      await Flux.dispatch({type: 'TEST_EVENT', testVar: 'test'});
    });

    afterAll(() => {
      Flux.off('TEST_EVENT', eventSpy);
    });

    it('should return a JSON action', async() => {
      Flux._useImmutable = false;
      action = await Flux.dispatch({type: 'TEST_EVENT', testVar: 'test'});
      expect(action.type).toBe('TEST_EVENT');
      expect(action.testVar).toBe('test');
    });

    it('should return an immutable action', async() => {
      Flux._useImmutable = true;
      action = await Flux.dispatch({type: 'TEST_EVENT', testVar: 'test'});
      expect(action.get('type')).toBe('TEST_EVENT');
      expect(action.get('testVar')).toBe('test');
    });

    it('should alter the store data', () => {
      const item = Flux.getStore(['test', 'testAction']);
      expect(item).toBe('test');
    });

    it('should dispatch an event', () => {
      expect(eventSpy.mock.calls.length).toBe(3);
    });
  });

  describe('#enableDebugger', () => {
    it('should disable debugger', () => {
      Flux.enableDebugger(Flux.DEBUG_DISABLED);
      expect(Flux._debugLevel).toBe(0);
    });

    it('should enable debugger for logs', () => {
      Flux.enableDebugger(Flux.DEBUG_LOGS);
      expect(Flux._debugLevel).toBe(1);
    });

    it('should enable debugger for dispatch actions', () => {
      Flux.enableDebugger(Flux.DEBUG_DISPATCH);
      expect(Flux._debugLevel).toBe(2);
    });
  });

  describe('#getClass', () => {
    it('should get a class', () => {
      const cls = Flux.getClass('test');
      expect(cls.name).toBe('test');
    });
  });

  describe('#getSessionData', () => {
    it('should get session data', async() => {
      await Flux.setSessionData(key, val);

      // Method
      return Flux.getSessionData(key)
        .then(testVal => {
          console.log('testVal', testVal, val);
          expect(testVal).toBe(val);
        });
    });
  });

  describe('#getStore', () => {
    it('should get a global store', () => {
      const item = Flux.getStore();
      expect(item.getIn(['test', 'item'])).toBe('default');
    });

    it('should get a specific store', () => {
      const item = Flux.getStore('test');
      expect(item.get('item')).toBe('default');
    });

    it('should get a specific item within a store', () => {
      const item = Flux.getStore(['test', 'item']);
      expect(item).toBe('default');
    });
  });

  describe('#off', () => {
    it('should remove a listener', () => {
      const spy = jest.fn();
      Flux.on('test', spy);
      Flux.off('test', spy);
      Flux.dispatch({type: 'test'});

      expect(spy.mock.calls.length).toBe(0);
    });
  });

  describe('#registerStore', () => {
    it('should save the class', () => {
      const cls = Flux._storeClasses.get('test');
      expect(cls.name).toBe('test');
    });

    it('should set the initial value', () => {
      const item = Flux._store.getIn(['test', 'item']);
      expect(item).toBe('default');
    });

    it('should save store in cache', () => {
      expect(sessionSpy.mock.calls.length).toBe(6);
    });

    it('should return the class', done => {
      storePromise.then(data => {
        expect(data.name).toBe('test');
        done();
      });
    });
  });

  describe('#setSessionData', () => {
    let sessionSetSpy;

    beforeAll(() => {
      sessionSetSpy = jest.spyOn(AsyncStorage, 'setItem');
    });

    afterAll(() => {
      sessionSetSpy.mockRestore();
    });

    it('should set session data', () => {
      // Method
      return Flux.setSessionData(key, val)
        .then(() => {
          expect(sessionSetSpy.mock.calls.length).toBe(1);
        });
    });
  });

  describe('#setStore', () => {
    let oldItem, changedItem, newItem;

    beforeAll(() => {
      oldItem = Flux.getStore(['test', 'testUpdate']);
      changedItem = Flux.setStore(['test', 'testUpdate'], 'test');
      newItem = Flux.getStore(['test', 'testUpdate']);
    });

    it('should have the original value', () => {
      expect(oldItem).toBe('default');
    });

    it('should return the updated object', () => {
      expect(changedItem.getIn(['test', 'testUpdate'])).toBe('test');
    });

    it('should update the property within the store', () => {
      expect(newItem).toBe('test');
    });
  });
});
