'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _events=require('events');var _events2=_interopRequireDefault(_events);
var _reactNative=require('react-native');
var _immutable=require('immutable');var _immutable2=_interopRequireDefault(_immutable);
var _bluebird=require('bluebird');var _bluebird2=_interopRequireDefault(_bluebird);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _objectWithoutProperties(obj,keys){var target={};for(var i in obj){if(keys.indexOf(i)>=0)continue;if(!Object.prototype.hasOwnProperty.call(obj,i))continue;target[i]=obj[i];}return target;}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var






FluxNative=function(_EventEmitter){_inherits(FluxNative,_EventEmitter);







function FluxNative(){var options=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};_classCallCheck(this,FluxNative);var _this=_possibleConstructorReturn(this,(FluxNative.__proto__||Object.getPrototypeOf(FluxNative)).call(this));



options=_immutable2.default.fromJS(options);


_this._storeClasses=(0,_immutable.Map)();
_this._store=(0,_immutable.Map)();
_this._debug=!!options.get('debug',false);
_this._useCache=!!options.get('cache',true);

if(_this._useCache){
_this.getCache();
}return _this;
}_createClass(FluxNative,[{key:'getCache',value:function getCache()

{var _this2=this;
this.getSessionData('arkhamjs').then(function(data){
_this2._store=_immutable.Map.isMap(data)?data:(0,_immutable.Map)();
});
}},{key:'off',value:function off(

event,listener){
this.removeListener(event,listener);
}},{key:'dispatch',value:function dispatch()






{var _this3=this;for(var _len=arguments.length,actions=Array(_len),_key=0;_key<_len;_key++){actions[_key]=arguments[_key];}
if(!Array.isArray(actions)){
return;
}

var list=_immutable2.default.fromJS(actions);


return list.map(function(a){
if(typeof a.get('type')!=='string'){
return;
}var _a$toJS=

a.toJS(),type=_a$toJS.type,data=_objectWithoutProperties(_a$toJS,['type']);
data=_immutable2.default.fromJS(data);
var oldState=_this3._store;
var promises=[];


_this3._storeClasses.map(function(storeClass){
var name=storeClass.name;
var state=_this3._store.get(name)||_immutable2.default.fromJS(storeClass.initialState())||(0,_immutable.Map)();
_this3._store=_this3._store.set(name,storeClass.onAction(type,data,state)||state);


if(_this3._useCache){
promises.push(_this3.setSessionData('arkhamjs',_this3._store));
}

return storeClass.setState(_this3._store.get(name));
});

if(_this3._debug){
var hasChanged=!_this3._store.equals(oldState);
var updatedLabel=hasChanged?'Changed State':'Unchanged State';
var updatedColor=hasChanged?'#00d484':'#959595';

if(console.group){
console.group('%c FLUX DISPATCH: '+type,'font-weight:700');
console.log('%c Action: ','color: #00C4FF',a.toJS());
console.log('%c Last State: ','color: #959595',oldState.toJS());
console.log('%c '+updatedLabel+': ','color: '+updatedColor,_this3._store.toJS());
console.groupEnd();
}else{
console.log('FLUX DISPATCH: '+type);
console.log('Action: '+a.toJS());
console.log('Last State: ',oldState.toJS());
console.log(updatedLabel+': ',_this3._store.toJS());
}
}

if(promises.length){
_bluebird2.default.all(promises).
then(function(){
_this3.emit(type,data);
});
}else{
_this3.emit(type,data);
}
});
}},{key:'getStore',value:function getStore()









{var name=arguments.length>0&&arguments[0]!==undefined?arguments[0]:'';var defaultValue=arguments[1];
var store=void 0;

if(Array.isArray(name)){
store=this._store.getIn(name,defaultValue);
}else
if(name!==''){
store=this._store.get(name,defaultValue);
}else{
store=this._store||(0,_immutable.Map)();
}

return store;
}},{key:'registerStore',value:function registerStore(







StoreClass){var _this4=this;
var name=StoreClass.name.toLowerCase();

if(!this._storeClasses.has(name)){(function(){

var store=new StoreClass();
_this4._storeClasses=_this4._storeClasses.set(name,store);


if(_this4._useCache){
_this4.getSessionData('arkhamjs').then(function(data){
var cache=_immutable.Map.isMap(data)?data:(0,_immutable.Map)();


var state=_this4._store.get(name)||cache.get(name)||_immutable2.default.fromJS(store.initialState())||(0,_immutable.Map)();
_this4._store=_this4._store.set(name,state);


_this4.setSessionData('arkhamjs',_this4._store);
});
}})();
}

return this._storeClasses.get(name);
}},{key:'deregisterStore',value:function deregisterStore()






{var name=arguments.length>0&&arguments[0]!==undefined?arguments[0]:'';
name=name.toLowerCase();
this._storeClasses=this._storeClasses.delete(name);
this._store=this._store.delete(name);
}},{key:'getClass',value:function getClass()







{var name=arguments.length>0&&arguments[0]!==undefined?arguments[0]:'';
name=name.toLowerCase();
return this._storeClasses.get(name);
}},{key:'setSessionData',value:function setSessionData(







key,value){
if(_immutable2.default.Iterable.isIterable(value)){
value=value.toJS();
}

value=JSON.stringify(value);

return new _bluebird2.default(function(resolve,reject){
try{
_reactNative.AsyncStorage.setItem(key,value).then(resolve);
}
catch(error){
reject(error);
}
});
}},{key:'getSessionData',value:function getSessionData(







key){
return new _bluebird2.default(function(resolve,reject){
try{
_reactNative.AsyncStorage.getItem(key).
then(function(value){
resolve(_immutable2.default.fromJS(JSON.parse(value||'""')));
});
}
catch(error){
reject(error);
}
});
}},{key:'delSessionData',value:function delSessionData(






key){
return new _bluebird2.default(function(resolve,reject){
try{
_reactNative.AsyncStorage.removeItem(key).then(resolve);
}
catch(error){
reject(error);
}
});
}},{key:'enableDebugger',value:function enableDebugger()






{var value=arguments.length>0&&arguments[0]!==undefined?arguments[0]:true;
this._debug=value;
}}]);return FluxNative;}(_events2.default);


var fluxNative=new FluxNative((window||{}).arkhamjs);exports.default=
fluxNative;