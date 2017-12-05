![ArkhamJS Native](https://nitrogenlabs.com/logos/gh-arkhamjs-native.png "ArkhamJS Native")

#### Flux Framework for React Native

ArkhamJS is a very lightweight framework that can accommodate a project of any size. From small start-up ideas to large enterprise projects. ReactJS is an amazing library but unfortunately, it is not a framework. Although the creators of ReactJS recommend using React in a Flux architecture, there is no official framework. The result is a wide variety of great third-party frameworks. Our goal is to create a simple framework with flexibility. And thus came ArkhamJS.

#### Lightweight
The framework is very small, coming in at about 7kb. The bulk of your app should lay within your code, not the framework. While larger frameworks come with lots of "magic", they become very limited when new features arise within your project. ReactJS is very powerful in itself. ArkhamJS simply complements it.

#### Single Store
All data is stored within a single, immutable store. The data can be accessed through all your views and components. Data is organized into multiple stores within the single store.

#### Immutability
To prevent object referencing, we use immutable objects. When a state changes in a ReactJS component, the state's property is not the only item that is changed, the item it references is also updated. To prevent passing around an object between different scopes, immutable objects give your data a one way update path.

#### Cache
Your single store id stored in sessionStorage by default. While this can be turned off in your options, it can be very useful when saving state.

#### Documentation
For some detailed [Documentation](http://www.arkhamjs.com) and additional options on the framework.

#### React
Looking into developing for the web? There is a React version of ArkhamJS, [ArkhamJS](https://github.com/nitrogenlabs/arkhamjs). The biggest difference here is in the way storage is managed.

[![npm version](https://img.shields.io/npm/v/arkhamjs-native.svg?style=flat-square)](https://www.npmjs.com/package/arkhamjs-native)
[![Travis](https://img.shields.io/travis/nitrogenlabs/arkhamjs-native.svg?style=flat-square)](https://travis-ci.org/nitrogenlabs/arkhamjs-native)
[![npm downloads](https://img.shields.io/npm/dm/arkhamjs-native.svg?style=flat-square)](https://www.npmjs.com/package/arkhamjs-native)
[![Issues](http://img.shields.io/github/issues/nitrogenlabs/arkhamjs-native.svg?style=flat-square)](https://github.com/nitrogenlabs/arkhamjs-native/issues)
[![Gitter](https://img.shields.io/gitter/room/NitrgenLabs/arkhamjs-native.svg?style=flat-square)](https://gitter.im/NitrogenLabs/arkhamjs-native)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://opensource.org/licenses/MIT)

### Installation

Using [npm](https://www.npmjs.com/):
```bash
$ npm install arkhamjs-native
```
or
```bash
$ yarn add arkhamjs-native
```
