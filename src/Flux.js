import EventEmitter from 'events';
import {AsyncStorage} from 'react-native';
import Immutable, {Map} from 'immutable';
import Promise from 'bluebird';
import ArkhamConstants from './constants/ArkhamConstants';

/**
 * Copyright (c) 2017, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */

class Flux extends EventEmitter {
  /**
   * Create a new instance of Flux.  Note that the Flux object
   * is a Singleton pattern, so only one should ever exist.
   *
   * @constructor
   * @this {Flux}
   */
  constructor(options = {}) {
    super();
    
    // Methods
    this._deregister = this._deregister.bind(this);
    this._getCache = this._getCache.bind(this);
    this._register = this._register.bind(this);
    this.clearAppData = this.clearAppData.bind(this);
    this.config = this.config.bind(this);
    this.debugError = this.debugError.bind(this);
    this.debugInfo = this.debugInfo.bind(this);
    this.debugLog = this.debugLog.bind(this);
    this.delSessionData = this.delSessionData.bind(this);
    this.deregisterStore = this.deregisterStore.bind(this);
    this.dispatch = this.dispatch.bind(this);
    this.enableDebugger = this.enableDebugger.bind(this);
    this.getClass = this.getClass.bind(this);
    this.getSessionData = this.getSessionData.bind(this);
    this.getStore = this.getStore.bind(this);
    this.off = this.off.bind(this);
    this.registerStore = this.registerStore.bind(this);
    this.setSessionData = this.setSessionData.bind(this);
    this.setStore = this.setStore.bind(this);
    
    // Properties
    this._storeClasses = Map();
    this._store = Map();
    
    // Debug modes
    this.DEBUG_DISABLED = 0;
    this.DEBUG_LOGS = 1;

    // Configuration
    this.config(options);
  }
  
  _deregister(name = '') {
    this._storeClasses = this._storeClasses.delete(name);
    this._store = this._store.delete(name);
  }
  
  _getCache() {
    return this.getSessionData(this._name).then(data => {
      if(Map.isMap(data)) {
        this._store = data;
        return data;
      }
    });
  }
  
  _register(StoreClass) {
    if(!StoreClass) {
      throw Error('Class is undefined. Cannot register with Flux.');
    }
    
    let promise = Promise.resolve();
    const clsType = StoreClass.constructor.toString().substr(0, 5);
    
    if(clsType !== 'class' && clsType !== 'funct') {
      throw Error(`${StoreClass} is not a class. Cannot register with Flux.`);
    }
    
    // Create store object
    const storeCls = new StoreClass();
    const name = storeCls.name;
    
    if(!this._storeClasses.get(name)) {
      // Save store object
      this._storeClasses = this._storeClasses.set(name, storeCls);
      
      // Get cached data
      if(this._useCache) {
        promise = this.getSessionData(this._name)
          .then(data => {
            const cache = Map.isMap(data) ? data : Map();
            
            // Get default values
            const state = cache.get(name) || this._store.get(name) || storeCls.getInitialState() || Map();
            this._store = this._store.set(name, state);
            
            // Save cache in session storage
            this.setSessionData(this._name, this._store);
            return this._storeClasses.get(name);
          });
      } else {
        // Get default values
        const state = this._store.get(name) || storeCls.getInitialState() || Map();
        this._store = this._store.set(name, state);
      }
    }
    
    return promise.then(() => this._storeClasses.get(name));
  }
  
  /**
   * Removes all app data from sessionStorage.
   *
   * @returns {Boolean} Whether app data was successfully removed.
   */
  clearAppData() {
    try {
      // Set all store data to initial state
      this._storeClasses.forEach(storeCls => {
        const state = Immutable.fromJS(storeCls.getInitialState());
        this._store = this._store.set(storeCls.name, state);
        storeCls.store = state;
      });
      
      if(this._useCache) {
        return AsyncStorage.setItem(this._name, this._store).then(() => true).catch(() => Promise.resolve(false));
      } else {
        return Promise.resolve(true);
      }
    }
    catch(error) {
      return Promise.resolve(false);
    }
  }
  
  /**
   * Set configuration options.
   *
   * @param {object} options Configuration options.
   */
  config(options) {
    this._options = options || {};
    
    // Name
    this._name = this._options.name || 'arkhamjs';
    
    // Cache
    this._useCache = this._options.useCache !== false;
    
    if(this._useCache) {
      this._getCache();
    }

    // Output immutable objects
    this._useImmutable = this._options.useImmutable !== false;

    // Debug
    this._debugLevel = this._options.debugLevel || this.DEBUG_DISABLED;
  }
  
  /**
   * Logs errors in the console. Will also call the debugErrorFnc method set in the config.
   *
   * @param {object} obj A list of JavaScript objects to output. The string representations of each of these objects
   * are appended together in the order listed and output.
   */
  debugError(...obj) {
    if(this._debugLevel) {
      console.error(...obj);
    }
    
    const fnc = this._options.debugErrorFnc;
    
    if(fnc) {
      fnc(this._debugLevel, ...obj);
    }
  }
  
  /**
   * Logs informational messages to the console. Will also call the debugInfoFnc method set in the config.
   *
   * @param {object} obj A list of JavaScript objects to output. The string representations of each of these objects
   * are appended together in the order listed and output.
   */
  debugInfo(...obj) {
    if(this._debugLevel) {
      console.info(...obj);
    }
    
    const fnc = this._options.debugInfoFnc;
    
    if(fnc) {
      fnc(this._debugLevel, ...obj);
    }
  }
  
  /**
   * Logs data in the console. Only logs when in debug mode.  Will also call the debugLogFnc method set in the config.
   *
   * @param {object} obj A list of JavaScript objects to output. The string representations of each of these objects
   * are appended together in the order listed and output.
   */
  debugLog(...obj) {
    if(this._debugLevel) {
      console.log(...obj);
    }
    
    const fnc = this._options.debugLogFnc;
    
    if(fnc) {
      fnc(this._debugLevel, ...obj);
    }
  }
  
  /**
   * Removes a key from sessionStorage.
   *
   * @param {string} key Key associated with the data to remove.
   * @returns {Boolean} Whether data was successfully removed.
   */
  delSessionData(key) {
    try {
      return AsyncStorage.removeItem(key).then(() => true).catch(() => Promise.resolve(false));
    }
    catch(error) {
      return Promise.resolve(false);
    }
  }
  
  /**
   * De-registers a named store.
   *
   * @param {String|Array} name The name of the store or an array of store names.
   */
  deregisterStore(name) {
    if(Array.isArray(name)) {
      name.forEach(n => {
        this._deregister(n);
      });
    } else {
      this._deregister(name);
    }
  }
  
  /**
   * Dispatches an action to all stores.
   *
   * @param {object} action to dispatch to all the stores.
   * @param {boolean} silent To silence any events.
   * @returns {Promise} The promise is resolved when and if the app saves data to the AsyncStorage, returning
   * the action.
   */
  dispatch(action, silent = false) {
    action = Immutable.fromJS(action);
    const type = action.get('type');
    const data = action.filter((v, k) => k !== 'type');
    
    // Require a type
    if(!type) {
      return;
    }
    
    const oldState = this._store;
    
    // When an action comes in, it must be completely handled by all stores
    this._storeClasses.forEach(storeCls => {
      const name = storeCls.name;
      const state = this._store.get(name) || Immutable.fromJS(storeCls.getInitialState()) || Map();
      this._store = this._store.set(name, storeCls.onAction(type, data, state) || state);
      storeCls.state = this._store.get(name);
    });
    
    if(this._debugLevel > this.DEBUG_LOGS) {
      const hasChanged = !this._store.equals(oldState);
      const updatedLabel = hasChanged ? 'Changed State' : 'Unchanged State';
      const updatedColor = hasChanged ? '#00d484' : '#959595';
      
      if(console.groupCollapsed) {
        console.groupCollapsed(`FLUX DISPATCH: ${type}`);
        console.log('%c Action: ', 'color: #00C4FF', action.toJS());
        console.log('%c Last State: ', 'color: #959595', oldState.toJS());
        console.log(`%c ${updatedLabel}: `, `color: ${updatedColor}`, this._store.toJS());
        console.groupEnd();
      } else {
        console.log(`FLUX DISPATCH: ${type}`);
        console.log(`Action: ${action.toJS()}`);
        console.log('Last State: ', oldState.toJS());
        console.log(`${updatedLabel}: `, this._store.toJS());
      }
    }
    
    // Save cache in session storage
    let promise = Promise.resolve();
    
    if(this._useCache) {
      promise = this.setSessionData(this._name, this._store);
    }

    if(this._useImmutable) {
      if(!silent) {
        promise.then(() => this.emit(type, data));
      }

      return promise.then(() => action);
    } else {
      if(!silent) {
        promise.then(() => this.emit(type, data.toJS()));
      }

      return promise.then(() => action.toJS());
    }
  }
  
  /**
   * Enables the console debugger.
   *
   * @param {number} level Enable or disable the debugger. Uses the constants:
   *   DEBUG_DISABLED (0) - Disable.
   *   DEBUG_LOGS (1) - Enable console logs.
   *   DEBUG_DISPATCH (2) - Enable console logs and dispatch action data (default).
   */
  enableDebugger(level = 2) {
    this._debugLevel = level;
  }
  
  /**
   * Gets a store object that is registered with Flux
   *
   * @param {string} name The name of the store.
   * @returns {Store} the store object.
   */
  getClass(name = '') {
    return this._storeClasses.get(name);
  }
  
  /**
   * Gets data from session storage.
   *
   * @param {string} key The key for data.
   * @returns {Immutable} the data object associated with the key.
   */
  getSessionData(key) {
    try {
      return AsyncStorage.getItem(key)
        .then(value => {
          value = JSON.parse(value || '""');

          console.log('getSessionData::value', this._useImmutable, value);
          if(this._useImmutable) {
            return Immutable.fromJS(value);
          } else {
            return value;
          }
        })
        .catch(Promise.resolve(null));
    }
    catch(error) {
      return Promise.resolve(null);
    }
  }
  
  /**
   * Gets the current state object.
   *
   * @param {string|array} [name] (optional) The name of the store for an object, otherwise it will return all store
   *   objects. You can also use an array to specify a property within the object (uses the immutable, getIn).
   * @param {string} [defaultValue] (optional) A default value to return if null.
   * @returns {Map} the state object.
   */
  getStore(name = '', defaultValue) {
    let store;

    // Make the defaultValue immutable if not already
    if(this._useImmutable && typeof defaultValue === 'object' && !Immutable.Iterable.isIterable(defaultValue)) {
      defaultValue = defaultValue ? Immutable.fromJS(defaultValue) : null;
    }

    if(Array.isArray(name)) {
      store = this._store.getIn(name, defaultValue);
    }
    else if(name !== '') {
      store = this._store.get(name, defaultValue);
    } else {
      store = this._store || Map();
    }

    if(this._useImmutable) {
      return store;
    } else {
      return Immutable.Iterable.isIterable(store) ? store.toJS() : store;
    }
  }
  
  /**
   * Adds an initialization listener.
   *
   * @param {function} [listener] The callback associated with the subscribed event.
   */
  onInit(listener) {
    this.on(ArkhamConstants.INIT, listener);
  }
  
  /**
   * Removes the initialization listener.
   *
   * @param {function} [listener] The callback associated with the subscribed event.
   */
  offInit(listener) {
    this.off(ArkhamConstants.INIT, listener);
  }
  
  /**
   * Removes an event listener.
   *
   * @param {string} [eventType] Event to unsubscribe.
   * @param {function} [listener] The callback associated with the subscribed event.
   */
  off(eventType, listener) {
    this.removeListener(eventType, listener);
  }
  
  /**
   * Registers a new Store.
   *
   * @param {Class|Array} StoreClass Store class.
   * @returns {Object|Array} the class object(s).
   */
  registerStore(StoreClass) {
    const onRegister = (clsObj => {
      this.emit(ArkhamConstants.INIT);
      return clsObj;
    });
    
    if(Array.isArray(StoreClass)) {
      return Promise.all(StoreClass.map(cls => this._register(cls))).then(onRegister);
    } else {
      return this._register(StoreClass).then(onRegister);
    }
  }
  
  /**
   * Saves data to the session storage.
   *
   * @param {string} key Key to store data.
   * @param {string|object|array|Immutable} value Data to store.
   * @returns {Boolean} Whether data was successfully saved.
   */
  setSessionData(key, value) {
    if(Immutable.Iterable.isIterable(value)) {
      value = value.toJS();
    }
    
    value = JSON.stringify(value);
    
    try {
      return AsyncStorage.setItem(key, value)
        .then(() => true)
        .catch(() => Promise.resolve(false));
    }
    catch(error) {
      return Promise.resolve(false);
    }
  }
  
  /**
   * Sets the current state object.
   *
   * @param {string|array} [name] The name of the store to set. You can also use an array to specify a property
   * within the object (uses the immutable, setIn).
   * @param {any} [value] The value to set.
   * @returns {Immutable} the object that was set.
   */
  setStore(name = '', value) {
    if(Array.isArray(name)) {
      return this._store = this._store.setIn(name, value);
    }
    else if(name !== '') {
      return this._store = this._store.set(name, value);
    } else {
      return this._store || Map();
    }
  }
}

const flux = new Flux();
export default flux;
