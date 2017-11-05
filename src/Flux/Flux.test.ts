import {set} from 'lodash';
import {default as MockAsyncStorage} from 'mock-async-storage';
import {AsyncStorage} from 'react-native';
import {Store} from '../Store/Store';
import {Flux, FluxAction, FluxDebugLevel, FluxOptions} from './Flux';

describe('Flux', () => {
  let storePromise: Promise<Store[]> = Promise.resolve();
  const val = 'hello_world';
  const key = 'test';
  const cfg: FluxOptions = {
    debugLevel: FluxDebugLevel.DISPATCH,
    name: 'arkhamjs',
    useCache: true
  };

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

    onAction(type: string, data, state): object {
      switch(type) {
        case 'TEST_EVENT':
          return set(state, 'testAction', data.testVar);
        default:
          return state;
      }
    }
  }

  beforeAll(() => {
    const mockImpl = new MockAsyncStorage();
    jest.mock('AsyncStorage', () => mockImpl);

    // Configure
    Flux.config({useCache: false});

    // Method
    storePromise = Flux.registerStores([TestStore]);
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
      debugLevel: FluxDebugLevel.LOGS,
      name: 'testApp',
      useCache: false
    };
    let config: FluxOptions;

    beforeAll(() => {
      // Method
      Flux.config(opts);
      config = Flux.getOptions();
    });

    afterAll(() => {
      // Method
      Flux.config(cfg);
    });

    it('should set debugLevel', () => {
      expect(config.debugLevel).toBe(opts.debugLevel);
    });

    it('should set name', () => {
      expect(config.name).toBe(opts.name);
    });

    it('should set useCache', () => {
      expect(config.useCache).toBe(opts.useCache);
    });
  });

  describe('#debugError', () => {
    let consoleSpy;
    const msg = 'test';

    beforeAll(() => {
      // Spy
      consoleSpy = jest.spyOn(console, 'error');

      // Method
      Flux._debugLevel = Flux.DEBUG_LOGS;
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
      Flux._debugLevel = Flux.DEBUG_LOGS;
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
      Flux._debugLevel = FluxDebugLevel.LOGS;
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

  describe('#deregisterStores', () => {
    beforeAll(async() => {
      // Method
      await Flux.deregisterStores(['test']);
    });

    afterAll(async() => {
      // Method
      await Flux.registerStores([TestStore]);
    });

    it('should remove class', () => {
      expect(!!Flux['storeClasses'].test).toBe(false);
    });

    it('should remove store data', () => {
      expect(!!Flux['store'].test).toBe(false);
    });
  });

  describe('#dispatch', () => {
    let action: FluxAction;
    let eventSpy: jest.SpyInstance;

    beforeAll(async() => {
      // Spy
      eventSpy = jest.fn();
      Flux.on('TEST_EVENT', eventSpy);
    });

    afterAll(() => {
      Flux.off('TEST_EVENT', eventSpy);
    });

    describe('on event dispatch', () => {
      beforeAll(async() => {
        action = await Flux.dispatch({type: 'TEST_EVENT', testVar: 'test'});
      });

      it('should dispatch an event', () => {
        expect(eventSpy.mock.calls.length).toBe(1);
      });

      it('should return a valid type', () => {
        expect(action.type).toBe('TEST_EVENT');
      });

      it('should return valid data', () => {
        expect(action.testVar).toBe('test');
      });

      it('should alter the store data', () => {
        const item = Flux.getStore(['test', 'testAction']);
        expect(item).toBe('test');
      });
    });
  });

  describe('#enableDebugger', () => {
    it('should disable debugger', () => {
      Flux.enableDebugger(FluxDebugLevel.DISABLED);
      const options: FluxOptions = Flux.getOptions();
      expect(options.debugLevel).toBe(0);
    });

    it('should enable debugger for logs', () => {
      Flux.enableDebugger(FluxDebugLevel.LOGS);
      const options: FluxOptions = Flux.getOptions();
      expect(options.debugLevel).toBe(1);
    });

    it('should enable debugger for dispatch actions', () => {
      Flux.enableDebugger(FluxDebugLevel.DISPATCH);
      const options: FluxOptions = Flux.getOptions();
      expect(options.debugLevel).toBe(2);
    });
  });

  describe('#getClass', () => {
    it('should get a store class', () => {
      const storeCls: Store = Flux.getClass('test');
      expect(storeCls.name).toBe('test');
    });
  });

  describe('#getSessionData', () => {
    it('should get session data', async() => {
      await Flux.setSessionData(key, val);

      // Method
      return Flux.getSessionData(key)
        .then((testVal: string) => {
          expect(testVal).toBe(val);
        });
    });
  });

  describe('#getStore', () => {
    it('should get a global store', () => {
      const storeValue: object = Flux.getStore();
      expect(storeValue.test.item).toBe('default');
    });

    it('should get a specific store', () => {
      const storeValue: object = Flux.getStore('test');
      expect(storeValue.item).toBe('default');
    });

    it('should get a specific item within a store', () => {
      const storeValue: string = Flux.getStore(['test', 'item']);
      expect(storeValue).toBe('default');
    });

    it('should return default value from a null item', () => {
      const storeValue: string = Flux.getStore(['test', 'notDefault'], '');
      expect(storeValue).toBe('');
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

  describe('#registerStores', () => {
    let sessionSpy;

    beforeAll(async() => {
      // Spy
      sessionSpy = jest.spyOn(Flux, 'setSessionData');

      // Create a new store class
      class DemoStore extends Store {
        constructor() {
          super('demo');
        }

        initialState(): object {
          return {
            item: 'default',
            testAction: 'default',
            testUpdate: 'default'
          };
        }
      }

      // Method
      storePromise = await Flux.registerStores([DemoStore]);
    });

    afterAll(() => {
      sessionSpy.mockRestore();
    });

    it('should save the store class', () => {
      const storeCls: Store = Flux['storeClasses'].demo;
      expect(storeCls.name).toBe('demo');
    });

    it('should set the initial value', () => {
      const value: string = Flux['store'].demo.item;
      expect(value).toBe('default');
    });

    it('should save store in cache', () => {
      expect(sessionSpy.mock.calls.length).toBe(1);
    });

    it('should not save duplicate store in cache', async() => {
      // Method
      await Flux.registerStores([TestStore]);
      expect(sessionSpy.mock.calls.length).toBe(1);
    });

    it('should return the store class', async() => {
      const stores: Store[] = await storePromise;
      await expect(stores[0].name).toBe('demo');
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
    let oldItem, newItem;

    beforeAll(() => {
      oldItem = Flux.getStore(['test', 'testUpdate']);
      Flux.setStore(['test', 'testUpdate'], 'test');
      newItem = Flux.getStore(['test', 'testUpdate']);
    });

    it('should have the original value', () => {
      expect(oldItem).toBe('default');
    });

    it('should update the property within the store', () => {
      expect(newItem).toBe('test');
    });
  });
});
