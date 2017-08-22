![ArkhamJS Native](https://nitrogenlabs.com/logos/gh-arkhamjs-native.png "ArkhamJS Native")

#### Flux Framework for React Native

ArkhamJS is a very lightweight framework that can accommodate a project of any size. From small start-up ideas to large enterprise projects. ReactJS is an amazing library but unfortunately, it is not a framework. Although the creators of ReactJS recommend using React in a Flux architecture, there is no official framework. The result is a wide variety of great third-party frameworks. Our goal is to create a simple framework with flexibility. And thus came ArkhamJS.

#### Lightweight
The framework is very small, coming in at about 7kb. The bulk of your app should lay within your code, not the framework. While larger frameworks come with lots of "magic", they become very limited when new features arise within your project. ReactJS is very powerful in itself. ArkhamJS simply complements it.

#### Single Store
All data is stored within a single, immutable store. The data can be accessed through all your views and components. Data is organized into multiple stores within the single store.

#### Immutability
To prevent object referencing, we use immutable objects, using ImmutableJS. When a state changes in a ReactJS component, the state's property is not the only item that is changed, the item it references is also updated. To prevent passing around an object between different scopes, immutable objects give your data a one way update path.

#### Cache
Your single store id stored in sessionStorage by default. While this can be turned off in your options, it can be very useful when saving state.

#### Debugger
The most important factor in choosing a framework is how easy it is to build with it. And with building comes debugging. A detailed debugger is included with the framework. When turned on, it will display any actions that come through the framework. Making the previous and new state visible to the developer. Great way to make your data transparent! Supported browsers: Chrome, Firefox, and Safari.

[![npm version](https://img.shields.io/npm/v/arkhamjs-native.svg?style=flat-square)](https://www.npmjs.com/package/arkhamjs-native)
[![Travis](https://img.shields.io/travis/nitrogenlabs/arkhamjs-native.svg?style=flat-square)](https://travis-ci.org/nitrogenlabs/arkhamjs-native)
[![npm downloads](https://img.shields.io/npm/dm/arkhamjs-native.svg?style=flat-square)](https://www.npmjs.com/package/arkhamjs-native)
[![Issues](http://img.shields.io/github/issues/nitrogenlabs/arkhamjs-native.svg?style=flat-square)](https://github.com/nitrogenlabs/arkhamjs-native/issues)
[![Gitter](https://img.shields.io/gitter/room/NitrgenLabs/arkhamjs-native.svg?style=flat-square)](https://gitter.im/NitrogenLabs/arkhamjs-native)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://opensource.org/licenses/MIT)

### Installation

Using [npm](https://www.npmjs.com/):

    $ npm install arkhamjs-native

### React Native Usage

```js
import {Flux, Store} from 'arkhamjs-native';

**Store:**
```js
import {Flux, Store} from 'arkhamjs-native';
import {Map} from 'immutable';

export default class AppStore extends Store {
  constructor() {
    super('app');
  }
  
  initialState() {
    return {
      test: 'default'
    };
  }

  onAction(type, data, state) {
    switch(type) {
      case 'APP_TEST':
        return state.set('test', data.get('demo'));
      case 'APP_RESET':
        return Map(this.initialState());
      default:
        return state;
    }
  }
}
```

**Action:**
```js
import {Flux} from 'arkhamjs-native';

const AppActions = {
  test: str => {
    Flux.dispatch({type: 'APP_TEST', demo: str});
  }
};

export default AppActions;
```

**Component:**
```js
import React, {Component} from 'react';
import {Text} from 'react-native';
import {Flux} from 'arkhamjs-native';
import AppStore from 'stores/AppStore';
import AppActions from 'services/AppActions';

export default class AppView extends Component {
  constructor(props) {
    super(props);
    
    // Initial state
    this.state = {
      init: false,
      myTest: ''
    };

    // Initialize Flux with custom configuration (optional)
    Flux.config({
      // Enable caching in session storage
      cache: true,
      
      // Enable debugger
      debugLevel: Flux.DEBUG_DISPATCH,
      
      // Name of your app
      name: 'MyApp'
    });

    // Bind methods
    this.onAppTest = this.onAppTest.bind(this);
    this.onInit = this.onInit.bind(this);
  }
  
  componentWillMount() {
    // Add listeners
    Flux.onInit(this.onInit);
    Flux.on('APP_TEST', this.onAppTest);
    
    // Register stores
    Flux.registerStore([AppStore]);
   
  }

  componentWillUnmount() {
    Flux.offInit(this.onInit);
    Flux.off('APP_TEST', this.onAppTest);
  }
  
  onInit() {
    // Initialize
    AppActions.test('Hello World');
    
    // Run any functions or Flus.getStore after ArkhamJS has initialized.
    this.setState({init: true});
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
    if(this.state.init) {
      return <Text>{this.state.myTest}</Text>
    } else {
      return null;
    }
  }
};

export default AppActions;
```

## Flux API

### Configuration

#### `config(options)`
Set configuration options.

#### Arguments
* [`options`] \(*Object*): Configuration options.
  * debugLevel \(*Number*) - Enable the debugger. You can specify to show console.logs and/or Flux dispatches. You can
  use a numeric value or one of the pre-defined constants below:
    * DEBUG_DISABLED (0) - Disable debugger.
    * DEBUG_LOGS (1) - Only allow console logs.
    * DEBUG_DISPATCH (2) - Display both, console logs and dispatcher action details.
  * debugLogFnc \(*Function*) - (optional) Passes the debug data to the specified function with the debugLevel as
  the first parameter and the data as the 1-n parameters. Executed when Flux.debugLog() is run.
  * debugInfoFnc \(*Function*) - (optional) Passes the debug data to the specified function with the debugLevel as
  the first parameter and the data as the 1-n parameters. Executed when Flux.debugError() is run.
  * debugErrorFnc \(*Function*) - (optional) Passes the debug data to the specified function with the debugLevel as
  the first parameter and the data as the 1-n parameters. Executed when Flux.debugInfo() is run.
  * name \(*String*) - Name of your app. Should not contain spaces. Is used as the session storage property for your 
  cache. *Default: arkhamjs*
  * useCache \(*Boolean*) - Enable caching to session storage. *Default: true*
  * useImmutable \(*Boolean*) - Enable immutable return values. If set to false, will return JSON objects. *Default: true*


### Events

#### `on(eventType, listener)`
Adds an event listener. It is called any time an action is dispatched to Flux, and some part of the state tree may 
potentially have changed. You may then call getStore() to read the current state tree inside the callback.

* [`eventType`] \(*String*): Event to subscribe for store updates.
* [`listener`] \(*Function*): The callback to be invoked any time an action has been dispatched.

#### `onInit(listener)`
Adds an event listener for ArkhamJS initialization. The listener is called once all stores have been created and cache 
has been obtained from the cache. You may start your app after initialization.

* [`listener`] \(*Function*): The callback to be invoked any time an action has been dispatched.

#### `off(eventType, listener)`
Removes an event listener.
* [`eventType`] \(*String*): Event to unsubscribe.
* [`listener`] \(*Function*): The callback associated with the subscribed event.

#### `offInit(listener)`
Removes the event listener for ArkhamJS initialization.

* [`listener`] \(*Function*): The callback to be invoked any time an action has been dispatched.


#### `dispatch(action, silent)`
Dispatches an Action to all stores
* [`action`] \(*Object*): An action object. The only required property is *type* which will indicate what is called in
the stores, all other properties will be sent to the store within the *data* object.
* [`silent`] \(*Boolean*): Silence event emitter for this dispatch. Default: false.

##### Returns
The promise is resolved when and if the app saves data to the AsyncStorage, returning the action.


### Stores

#### `getStore(name, default)`
Get the state tree. If only a particular store is needed, it can be specified.
* [`name`] \(*String*/*Array*): (optional) A store name. May also use an array to get a nested property value.
* [`default`] \(*String*/*Immutable*): (optional) The default value if undefined. This may be a string or immutable 
object (ie. Map, List, etc.).

##### Returns
The app store object as an immutable object.

#### `setStore(name, value)`
Used for unit testing. Set a store value. If only a particular store or property needs to be set, it can be specified.
* [`name`] \(*String*/*Array*): A store name. May also use an array to get a nested property value.
* [`value`] \(*Any*): The value to set. This may be a string, number, boolean or immutable 
object (ie. Map, List, etc.).

##### Returns
The updated store as an immutable object.


#### `getClass(name)`
Get the store class object.
* [`name`] \(*String*): The name of the store class object to retrieve. 

##### Returns
A store class object.

#### `registerStores(array)`
Registers stores with Flux. Use an array of classes to register multiple.
* [`Class`] \(*array*): The store class(s) to add to Flux.

##### Returns
An array of store class objects.

#### `deregisterStores(array)`
Deregisters stores from Flux. Use an array of names to deregister multiple stores.
* [`name`] \(*array*): Name of store(s) to remove from Flux.


### Storage

#### `getSessionData(key, immutable)`
Get an object from sessionStorage.
* [`key`] \(*String*): Key of object to retrieve.
* [`immutable`] \(*Boolean*): Return an immutable object. *Default: false*

##### Returns
A promise. Promise returns an immutable object or string associated with the key.

#### `setSessionData(key, value)`
Save an object to sessionStorage.
* [`key`] \(*String*): Key to reference object.
* [`value`] \(*String|Object|Immutable*): A string or object to save. Immutable objects will be converted to JSON. All 
objects will converted to a string before saving.

##### Returns
A promise with a boolean indicating whether the app data was saved.

#### `delSessionData(key)`
Remove an object from sessionStorage.
* [`key`] \(*String*): Key of object to delete.

##### Returns
A promise with a boolean indicating whether the data was removed.

#### `clearAppData()`
Removes all app related data from sessionStorage.

##### Returns
A promise with a boolean indicating whether the app data was removed.


### Debug
#### `enableDebugger(toggle)`
Turn on the console debugger to display each action call and store changes. By default the framework has the debugger 
disabled.
* [`toggle`] \(*Boolean*): Enable or disable debugger. Default: true.

#### `debugLog(obj1 [, obj2, ..., objN])`
Logs data in the console. Only logs when in debug mode.  Will also call the debugLogFnc method set in the config.
* [`obj`] \(*Any*): A list of JavaScript objects to output. The string representations of each of these objects are 
appended together in the order listed and output.

#### `debugInfo(obj1 [, obj2, ..., objN])`
Logs informational messages to the console. Will also call the debugInfoFnc method set in the config.
* [`obj`] \(*Any*): A list of JavaScript objects to output. The string representations of each of these objects are 
appended together in the order listed and output.

#### `debugError(obj1 [, obj2, ..., objN])`
Logs errors in the console. Will also call the debugErrorFnc method set in the config.
* [`obj`] \(*Any*): A list of JavaScript objects to output. The string representations of each of these objects are 
appended together in the order listed and output.


## Store API

### State

#### `getInitialState()`
Used for unit testing. Gets the initial state of the store.

##### Returns
The initial state of the store as an immutable object.
