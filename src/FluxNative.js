import EventEmitter from 'events';
import {AsyncStorage} from 'react-native';
import Immutable, {Map} from 'immutable';
import Promise from 'bluebird';

/**
 * Copyright (c) 2017, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */

class FluxNative extends EventEmitter {
  /**
   * Create a new instance of Flux.  Note that the Flux object
   * is a Singleton pattern, so only one should ever exist.
   *
   * @constructor
   * @this {FluxNative}
   */
  constructor(options = {}) {
    super();

    // Options
    options = Immutable.fromJS(options);

    // Create a hash of all the stores - used for registration / de-registration
    this._storeClasses = Map();
    this._store = Map();
    this._debug = !!options.get('debug', false);
    this._useCache = !!options.get('cache', true);
    this._name = 'arkhamjs';

    if(this._useCache) {
      this.getCache();
    }
  }

  getCache() {
    this.getSessionData(this._name).then(data => {
      this._store = Map.isMap(data) ? data : Map();
    });
  }

  off(event, listener) {
    this.removeListener(event, listener);
  }

  /**
   * Dispatches an action to all stores.
   *
   * @param {...Objects} actions to dispatch to all the stores.
   */
  dispatch(...actions) {
    if(!Array.isArray(actions)) {
      return;
    }

    const list = Immutable.fromJS(actions);

    // Loop through actions
    list.forEach(a => {
      if(!a.get('type')) {
        return;
      }

      let {type, ...data} = a.toJS();
      data = Immutable.fromJS(data);
      const oldState = this._store;

      // When an action comes in, it must be completely handled by all stores
      this._storeClasses.forEach(storeCls => {
        const name = storeCls.name;
        const state = this._store.get(name) || Immutable.fromJS(storeCls.initialState()) || Map();
        this._store = this._store.set(name, storeCls.onAction(type, data, state) || state);
        storeCls.state = this._store.get(name);
      });

      if(this._debug) {
        const hasChanged = !this._store.equals(oldState);
        const updatedLabel = hasChanged ? 'Changed State' : 'Unchanged State';
        const updatedColor = hasChanged ? '#00d484' : '#959595';

        if(console.group) {
          console.group(`%c FLUX DISPATCH: ${type}`, 'font-weight:700');
          console.log('%c Action: ', 'color: #00C4FF', a.toJS());
          console.log('%c Last State: ', 'color: #959595', oldState.toJS());
          console.log(`%c ${updatedLabel}: `, `color: ${updatedColor}`, this._store.toJS());
          console.groupEnd();
        } else {
          console.log(`FLUX DISPATCH: ${type}`);
          console.log(`Action: ${a.toJS()}`);
          console.log('Last State: ', oldState.toJS());
          console.log(`${updatedLabel}: `, this._store.toJS());
        }
      }

      // Save cache in session storage
      let promise = Promise.resolve();

      if(this._useCache) {
        promise = this.setSessionData(this._name, this._store);
      }

      promise.then(() => this.emit(type, data));
    });

    return list;
  }

  /**
   * Gets the current state object.
   *
   * @param {string} [name] (optional) The name of the store for just that object, otherwise it will return all store
   *   objects.
   * @param {string} [defaultValue] (optional) A default value to return if null.
   * @returns {Map} the state object.
   */
  getStore(name = '', defaultValue) {
    if(Array.isArray(name)) {
      return this._store.getIn(name, defaultValue);
    }
    else if(name !== '') {
      return this._store.get(name, defaultValue);
    } else {
      return this._store || Map();
    }
  }

  /**
   * Registers a new Store with Flux.
   *
   * @param {Class} StoreClass A unique name for the Store.
   * @returns {Object} the class object.
   */
  registerStore(StoreClass) {
    // Create store object
    const storeCls = new StoreClass();
    const name = storeCls.name;

    if(!this._storeClasses.get(name)) {
      // Save store object
      this._storeClasses = this._storeClasses.set(name, storeCls);

      // Get cached data
      if(this._useCache) {
        this.getSessionData(this._name)
          .then(data => {
            const cache = Map.isMap(data) ? data : Map();

            // Get default values
            const state = this._store
                .get(name) || cache.get(name) || Immutable.fromJS(storeCls.initialState()) || Map();
            this._store = this._store.set(name, state);

            // Save cache in session storage
            this.setSessionData(this._name, this._store);
          });
      }
    }

    return this._storeClasses.get(name);
  }

  /**
   * De-registers a named store from Flux.
   *
   * @param {string} name The name of the store.
   */
  deregisterStore(name = '') {
    this._storeClasses = this._storeClasses.delete(name);
    this._store = this._store.delete(name);
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
   * Gets data from session storage.
   *
   * @param {string} key The key for data.
   * @returns {Immutable} the data object associated with the key.
   */
  getSessionData(key) {
    try {
      return AsyncStorage.getItem(key)
        .then(value => Immutable.fromJS(JSON.parse(value || '""')))
        .catch(Promise.resolve(null));
    }
    catch(error) {
      return Promise.resolve(null);
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
   * Removes all app data from sessionStorage.
   *
   * @returns {Boolean} Whether app data was successfully removed.
   */
  clearAppData() {
    try {
      return AsyncStorage.removeItem(this._name).then(() => true).catch(() => Promise.resolve(false));
    }
    catch(error) {
      return Promise.resolve(false);
    }
  }

  /**
   * Enables the console debugger.
   *
   * @param {boolean} value Enable or disable the debugger. Default value: false.
   */
  enableDebugger(value = false) {
    this._debug = value;
  }
}

const fluxNative = new FluxNative((window || {}).arkhamjs);
export default fluxNative;
