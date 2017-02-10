'use strict';Object.defineProperty(exports,'__esModule',{value:!0});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,'value'in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}();var _events=require('events'),_events2=_interopRequireDefault(_events),_reactNative=require('react-native'),_immutable=require('immutable'),_immutable2=_interopRequireDefault(_immutable),_bluebird=require('bluebird'),_bluebird2=_interopRequireDefault(_bluebird);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError('Cannot call a class as a function')}function _possibleConstructorReturn(self,call){if(!self)throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');return call&&('object'==typeof call||'function'==typeof call)?call:self}function _inherits(subClass,superClass){if('function'!=typeof superClass&&null!==superClass)throw new TypeError('Super expression must either be null or a function, not '+typeof superClass);subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:!1,writable:!0,configurable:!0}}),superClass&&(Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass)}var









FluxNative=function(_EventEmitter){







function FluxNative(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{};_classCallCheck(this,FluxNative);var _this=_possibleConstructorReturn(this,(FluxNative.__proto__||Object.getPrototypeOf(FluxNative)).call(this));return(

































_this.config(a),_this._deregister=_this._deregister.bind(_this),_this._getCache=_this._getCache.bind(_this),_this._register=_this._register.bind(_this),_this.clearAppData=_this.clearAppData.bind(_this),_this.config=_this.config.bind(_this),_this.debugError=_this.debugError.bind(_this),_this.debugInfo=_this.debugInfo.bind(_this),_this.debugLog=_this.debugLog.bind(_this),_this.delSessionData=_this.delSessionData.bind(_this),_this.deregisterStore=_this.deregisterStore.bind(_this),_this.dispatch=_this.dispatch.bind(_this),_this.enableDebugger=_this.enableDebugger.bind(_this),_this.getClass=_this.getClass.bind(_this),_this.getSessionData=_this.getSessionData.bind(_this),_this.getStore=_this.getStore.bind(_this),_this.off=_this.off.bind(_this),_this.registerStore=_this.registerStore.bind(_this),_this.setSessionData=_this.setSessionData.bind(_this),_this.setStore=_this.setStore.bind(_this),_this._storeClasses=(0,_immutable.Map)(),_this._store=(0,_immutable.Map)(),_this.DEBUG_DISABLED=0,_this.DEBUG_LOGS=1,_this.DEBUG_DISPATCH=2,_this.config(a),_this);
}return _inherits(FluxNative,_EventEmitter),_createClass(FluxNative,[{key:'_deregister',value:function _deregister()

{var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:'';
this._storeClasses=this._storeClasses.delete(a),
this._store=this._store.delete(a);
}},{key:'_getCache',value:function _getCache()

{var _this2=this;
this.getSessionData(this._name).then(function(a){
_immutable.Map.isMap(a)&&(
_this2._store=a);

});
}},{key:'_register',value:function _register(

a){var _this3=this;
if(!a)
throw Error('Class is undefined. Cannot register with Flux.');


var b=a.constructor.toString().substr(0,5);

if('class'!==b&&'funct'!==b)
throw Error(a+' is not a class. Cannot register with Flux.');



var c=new a,
d=c.name;

if(!this._storeClasses.get(d))




if(this._storeClasses=this._storeClasses.set(d,c),this._useCache)
this.getSessionData(this._name).
then(function(e){
var f=_immutable.Map.isMap(e)?e:(0,_immutable.Map)(),


g=_this3._store.get(d)||f.get(d)||c.getInitialState()||(0,_immutable.Map)();
_this3._store=_this3._store.set(d,g),


_this3.setSessionData(_this3._name,_this3._store);
});else
{

var e=this._store.get(d)||c.getInitialState()||(0,_immutable.Map)();
this._store=this._store.set(d,e);
}


return this._storeClasses.get(d);
}},{key:'clearAppData',value:function clearAppData()






{var _this4=this;
try{return(

this._storeClasses.forEach(function(a){
var b=_immutable2.default.fromJS(a.getInitialState());
_this4._store=_this4._store.set(a.name,b),
a.store=b;
}),

this._useCache?
_reactNative.AsyncStorage.setItem(this._name,this._store).then(function(){return!0}).catch(function(){return _bluebird2.default.resolve(!1)}):

_bluebird2.default.resolve(!0));

}
catch(a){
return _bluebird2.default.resolve(!1);
}
}},{key:'config',value:function config(






a){
this._options=_immutable2.default.fromJS(a||{}),


this._name=this._options.get('name','arkhamjs'),


this._useCache=this._options.get('useCache',!0),

this._useCache&&
this._getCache(),



this._debugLevel=this._options.get('debugLevel',this.DEBUG_DISABLED);
}},{key:'debugError',value:function debugError()







{var _console;for(var _len=arguments.length,a=Array(_len),_key=0;_key<_len;_key++)a[_key]=arguments[_key];
this._debugLevel&&
(_console=console).error.apply(_console,a);


var b=this._options.get('debugErrorFnc');

b&&
b.apply(void 0,[this._debugLevel].concat(a));

}},{key:'debugInfo',value:function debugInfo()







{var _console2;for(var _len2=arguments.length,a=Array(_len2),_key2=0;_key2<_len2;_key2++)a[_key2]=arguments[_key2];
this._debugLevel&&
(_console2=console).info.apply(_console2,a);


var b=this._options.get('debugInfoFnc');

b&&
b.apply(void 0,[this._debugLevel].concat(a));

}},{key:'debugLog',value:function debugLog()






{var _console3;for(var _len3=arguments.length,a=Array(_len3),_key3=0;_key3<_len3;_key3++)a[_key3]=arguments[_key3];
this._debugLevel&&
(_console3=console).log.apply(_console3,a);


var b=this._options.get('debugLogFnc');

b&&
b.apply(void 0,[this._debugLevel].concat(a));

}},{key:'delSessionData',value:function delSessionData(







a){
try{
return _reactNative.AsyncStorage.removeItem(a).then(function(){return!0}).catch(function(){return _bluebird2.default.resolve(!1)});
}
catch(b){
return _bluebird2.default.resolve(!1);
}
}},{key:'deregisterStore',value:function deregisterStore(






a){var _this5=this;
Array.isArray(a)?
a.forEach(function(b){
_this5._deregister(b);
}):

this._deregister(a);

}},{key:'dispatch',value:function dispatch(







a){var _this6=this,b=1<arguments.length&&void 0!==arguments[1]&&arguments[1];
a=_immutable2.default.fromJS(a);
var c=a.get('type'),
d=a.filter(function(g,h){return'type'!==h});


if(c){



var _e=this._store;









if(this._storeClasses.forEach(function(g){var h=g.name,i=_this6._store.get(h)||_immutable2.default.fromJS(g.getInitialState())||(0,_immutable.Map)();_this6._store=_this6._store.set(h,g.onAction(c,d,i)||i),g.state=_this6._store.get(h)}),this._debugLevel>this.DEBUG_LOGS){
var g=!this._store.equals(_e),
h=g?'Changed State':'Unchanged State',
i=g?'#00d484':'#959595';

console.groupCollapsed?(
console.groupCollapsed('FLUX DISPATCH: '+c),
console.log('%c Action: ','color: #00C4FF',a.toJS()),
console.log('%c Last State: ','color: #959595',_e.toJS()),
console.log('%c '+h+': ','color: '+i,this._store.toJS()),
console.groupEnd()):(

console.log('FLUX DISPATCH: '+c),
console.log('Action: '+a.toJS()),
console.log('Last State: ',_e.toJS()),
console.log(h+': ',this._store.toJS()));

}


var _f=_bluebird2.default.resolve();









return this._useCache&&(_f=this.setSessionData(this._name,this._store)),b||_f.then(function(){return _this6.emit(c,d)}),_f.then(function(){return a})}
}},{key:'enableDebugger',value:function enableDebugger()









{var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:2;
this._debugLevel=a;
}},{key:'getClass',value:function getClass()







{var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:'';
return this._storeClasses.get(a);
}},{key:'getSessionData',value:function getSessionData(







a){
try{
return _reactNative.AsyncStorage.getItem(a).
then(function(b){return _immutable2.default.fromJS(JSON.parse(b||'""'))}).
catch(_bluebird2.default.resolve(null));
}
catch(b){
return _bluebird2.default.resolve(null);
}
}},{key:'getStore',value:function getStore()









{var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:'',b=arguments[1];return(
Array.isArray(a)?
this._store.getIn(a,b):

''===a?


this._store||(0,_immutable.Map)():this._store.get(a,b));

}},{key:'off',value:function off(







a,b){
this.removeListener(a,b);
}},{key:'registerStore',value:function registerStore(







a){var _this7=this;return(
Array.isArray(a)?
a.map(function(b){return _this7._register(b)}):

this._register(a));

}},{key:'setSessionData',value:function setSessionData(








a,b){
_immutable2.default.Iterable.isIterable(b)&&(
b=b.toJS()),


b=JSON.stringify(b);

try{
return _reactNative.AsyncStorage.setItem(a,b).
then(function(){return!0}).
catch(function(){return _bluebird2.default.resolve(!1)});
}
catch(c){
return _bluebird2.default.resolve(!1);
}
}},{key:'setStore',value:function setStore()









{var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:'',b=arguments[1];return(
Array.isArray(a)?
this._store=this._store.setIn(a,b):

''===a?


this._store||(0,_immutable.Map)():this._store=this._store.set(a,b));

}}]),FluxNative}(_events2.default);


var fluxNative=new FluxNative((window||{}).arkhamjs);exports.default=
fluxNative;