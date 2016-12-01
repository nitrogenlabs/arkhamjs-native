ArkhamJS Native - Flux Framework for React Native
=======================

An ES6 Flux library that uses immutability and includes:
- FluxNative
- Store

[![npm version](https://img.shields.io/npm/v/arkhamjs-native.svg?style=flat-square)](https://www.npmjs.com/package/arkhamjs-native)
[![npm downloads](https://img.shields.io/npm/dm/arkhamjs-native.svg?style=flat-square)](https://www.npmjs.com/package/arkhamjs-native)
[![Issues](http://img.shields.io/github/issues/nitrogenlabs/arkhamjs-native.svg?style=flat-square)](https://github.com/nitrogenlabs/arkhamjs-native/issues)
[![Gitter](https://img.shields.io/gitter/room/NitrgenLabs/arkhamjs-native.svg?style=flat-square)](https://gitter.im/NitrogenLabs/arkhamjs-native)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://opensource.org/licenses/MIT)

### Installation

Using [npm](https://www.npmjs.com/):

    $ npm install arkhamjs-native

###React Native Usage

```js
// Using an ES6 transpiler for React Native apps
import {Flux as FluxNative, Store} from 'arkhamjs-native';

// not using an ES6 transpiler
var Flux = require('arkhamjs-native').FluxNative;
var Store = require('arkhamjs-native').Store;
```

### How to use

A complete example can be found in the [nl-react-skeleton](https://github.com/nitrog7/nl-react-skeleton). Below is an example of an action and a store.

**Store:**
```js
import {Flux as FluxNative, Store} from 'arkhamjs-native';
import {Map} from 'immutable';

class App extends Store {
  initialState() {
    return {
      test: 'default'
    };
  }

  onAction(type, data, state) {
    switch(type) {
      case 'APP_TEST':
        return state.set('test', data.demo);
      case 'APP_RESET':
        return Map(this.initialState());
      default:
        return state;
    }
  }
}

export default Flux.registerStore(App);
```

**Action:**
```js
import {Flux as FluxNative} from 'arkhamjs-native';

const AppActions = {
  test: (str) => {
    Flux.dispatch({type: 'APP_TEST', demo: str});
  }
};

export default AppActions;
```

**Component:**
```js
import React, {Component} from 'react';
import {Flux} from '../flux';

// Enable console debugger
Flux.enableDebugger();

export default class AppView extends Component {
  constructor(props) {
    super(props);
    
    // Initial state
    this.state = {
      myTest: ''
    };

    // Bind methods
    this.onAppTest = this.onAppTest.bind(this);
  }
  
  componentWillMount() {
    // Add listeners
    Flux.on('APP_TEST', this.onAppTest);
    
    // Initialize
    AppActions.test('Hello World');
  }

  componentWillUnmount() {
    Flux.off('APP_TEST', this.onAppTest);
  }
  
  onAppTest() {
    // Gets the immutable store
    const myTest = Flux.getStore(['app', 'test']);
    
    // Show the output in the console
    console.log('onAppTest::myTest', myTest);
    
    // Set state to re-render component
    this.setState({myTest});
  }
  
  render() {
    return <div>{this.state.myTest}</div>
  }
};

export default AppActions;
```

### API
#### `on(eventType, data)`

Adds an event listener. It is called any time an action is dispatched to Flux, and some part of the state tree may 
potentially have changed. You may then call getStore() to read the current state tree inside the callback.

#### Arguments

* [`eventType`] \(*String*): Event to subscribe for store updates.
* [`listener`] \(*Function*): The callback to be invoked any time an action has been dispatched.

#### `off()`

Removes the event listener.

* [`eventType`] \(*String*): Event to unsubscribe.
* [`listener`] \(*Function*): The callback associated with the subscribed event.

#### `dispatch(action)`

Dispatches an Action to all stores

* [`action`] \(*Object*): An action object. The only required property is *type* which will indicate what is called in
the stores, all other properties will be sent to the store within the *data* object.

#### `getStore(name, default)`

Get the state tree. If only a particular store is needed, it can be specified.

* [`name`] \(*String*/*Array*): (optional) A store name. May also use an array to get a nested property value.
* [`default`] \(*String*/*Immutable*): (optional) The default value if undefined. This may be a string or immutable 
object (ie. Map, List, etc.).

#####Returns

An Immutable object or a string.

#### `getClass(name)`

Get the store class object.

* [`name`] \(*String*): The name of the store class object to retrieve. 

#####Returns

A store class object.

#### `registerStore(Class)`

Registers the store with Flux.

* [`Class`] \(*Class*): The store class.

#####Returns

A new object from the class. This is usually exported at the end of the store class.

#### `deregisterStore(name)`

Unregisters the store with Flux.

* [`name`] \(*String*): Name of store to remove from Flux.

#### `getSessionData(key)`

Get an object from sessionStorage.

* [`key`] \(*String*): Key of object to retrieve.

#####Returns

A promise. Promise returns an immutable object or string associated with the key.

#### `setSessionData(key, value)`

Save an object to sessionStorage.

* [`key`] \(*String*): Key to reference object.
* [`value`] \(*String|Object|Immutable*): A string or object to save. Immutable objects will be converted to JSON. All 
objects will converted to a string before saving.

#####Returns

A promise with an empty result.

#### `delSessionData(key)`

Remove an object from sessionStorage.

* [`key`] \(*String*): Key of object to delete.

#####Returns

A promise with an empty result.

#### `enableDebugger()`

Turn on the console debugger to display each action call and store changes.

