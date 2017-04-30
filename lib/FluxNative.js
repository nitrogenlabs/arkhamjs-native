'use strict';var _createClass=function(){function a(b,c){for(var e,d=0;d<c.length;d++)e=c[d],e.enumerable=e.enumerable||!1,e.configurable=!0,'value'in e&&(e.writable=!0),Object.defineProperty(b,e.key,e)}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}(),_events=require('events'),_events2=_interopRequireDefault(_events),_reactNative=require('react-native'),_immutable=require('immutable'),_immutable2=_interopRequireDefault(_immutable),_bluebird=require('bluebird'),_bluebird2=_interopRequireDefault(_bluebird);Object.defineProperty(exports,'__esModule',{value:!0});function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError('Cannot call a class as a function')}function _possibleConstructorReturn(a,b){if(!a)throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');return b&&('object'==typeof b||'function'==typeof b)?b:a}function _inherits(a,b){if('function'!=typeof b&&null!==b)throw new TypeError('Super expression must either be null or a function, not '+typeof b);a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),b&&(Object.setPrototypeOf?Object.setPrototypeOf(a,b):a.__proto__=b)}var









FluxNative=function(a){







function b(){var c=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{};_classCallCheck(this,b);var d=_possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).call(this));return(



d._deregister=d._deregister.bind(d),
d._getCache=d._getCache.bind(d),
d._register=d._register.bind(d),
d.clearAppData=d.clearAppData.bind(d),
d.config=d.config.bind(d),
d.debugError=d.debugError.bind(d),
d.debugInfo=d.debugInfo.bind(d),
d.debugLog=d.debugLog.bind(d),
d.delSessionData=d.delSessionData.bind(d),
d.deregisterStore=d.deregisterStore.bind(d),
d.dispatch=d.dispatch.bind(d),
d.enableDebugger=d.enableDebugger.bind(d),
d.getClass=d.getClass.bind(d),
d.getSessionData=d.getSessionData.bind(d),
d.getStore=d.getStore.bind(d),
d.off=d.off.bind(d),
d.registerStore=d.registerStore.bind(d),
d.setSessionData=d.setSessionData.bind(d),
d.setStore=d.setStore.bind(d),


d._storeClasses=(0,_immutable.Map)(),
d._store=(0,_immutable.Map)(),


d.DEBUG_DISABLED=0,
d.DEBUG_LOGS=1,
d.DEBUG_DISPATCH=2,


d.ARKHAMJS_INIT='ARKHAMJS_INIT',


d.config(c),d);
}return _inherits(b,a),_createClass(b,[{key:'_deregister',value:function _deregister()

{var c=0<arguments.length&&void 0!==arguments[0]?arguments[0]:'';
this._storeClasses=this._storeClasses.delete(c),
this._store=this._store.delete(c);
}},{key:'_getCache',value:function _getCache()

{var c=this;
return this.getSessionData(this._name).then(function(d){
if(_immutable.Map.isMap(d))

return c._store=d,d;

});
}},{key:'_register',value:function _register(c)

{var d=this;
if(!c)
throw Error('Class is undefined. Cannot register with Flux.');


var e=_bluebird2.default.resolve(),
f=c.constructor.toString().substr(0,5);

if('class'!==f&&'funct'!==f)
throw Error(c+' is not a class. Cannot register with Flux.');



var g=new c,
h=g.name;

if(!this._storeClasses.get(h))




if(this._storeClasses=this._storeClasses.set(h,g),this._useCache)
e=this.getSessionData(this._name).
then(function(j){
var l=_immutable.Map.isMap(j)?j:(0,_immutable.Map)(),


m=l.get(h)||d._store.get(h)||g.getInitialState()||(0,_immutable.Map)();




return d._store=d._store.set(h,m),d.setSessionData(d._name,d._store),d._storeClasses.get(h);
});else
{

var j=this._store.get(h)||g.getInitialState()||(0,_immutable.Map)();
this._store=this._store.set(h,j);
}


return e.then(function(){return d._storeClasses.get(h)});
}},{key:'clearAppData',value:function clearAppData()






{var c=this;
try{return(

this._storeClasses.forEach(function(d){
var e=_immutable2.default.fromJS(d.getInitialState());
c._store=c._store.set(d.name,e),
d.store=e;
}),

this._useCache?
_reactNative.AsyncStorage.setItem(this._name,this._store).then(function(){return!0}).catch(function(){return _bluebird2.default.resolve(!1)}):

_bluebird2.default.resolve(!0));

}
catch(d){
return _bluebird2.default.resolve(!1);
}
}},{key:'config',value:function config(c)






{
this._options=c||{},


this._name=this._options.name||'arkhamjs',


this._useCache=!!this._options.useCache,

this._useCache&&
this._getCache(),



this._debugLevel=this._options.debugLevel||this.DEBUG_DISABLED;
}},{key:'debugError',value:function debugError()







{for(var c=arguments.length,d=Array(c),e=0;e<c;e++)d[e]=arguments[e];
if(this._debugLevel){var f;
(f=console).error.apply(f,d);
}

var g=this._options.debugErrorFnc;

g&&
g.apply(void 0,[this._debugLevel].concat(d));

}},{key:'debugInfo',value:function debugInfo()







{for(var c=arguments.length,d=Array(c),e=0;e<c;e++)d[e]=arguments[e];
if(this._debugLevel){var f;
(f=console).info.apply(f,d);
}

var g=this._options.debugInfoFnc;

g&&
g.apply(void 0,[this._debugLevel].concat(d));

}},{key:'debugLog',value:function debugLog()







{for(var c=arguments.length,d=Array(c),e=0;e<c;e++)d[e]=arguments[e];
if(this._debugLevel){var f;
(f=console).log.apply(f,d);
}

var g=this._options.debugLogFnc;

g&&
g.apply(void 0,[this._debugLevel].concat(d));

}},{key:'delSessionData',value:function delSessionData(c)







{
try{
return _reactNative.AsyncStorage.removeItem(c).then(function(){return!0}).catch(function(){return _bluebird2.default.resolve(!1)});
}
catch(d){
return _bluebird2.default.resolve(!1);
}
}},{key:'deregisterStore',value:function deregisterStore(c)






{var d=this;
Array.isArray(c)?
c.forEach(function(e){
d._deregister(e);
}):

this._deregister(c);

}},{key:'dispatch',value:function dispatch(c)









{var d=this,e=1<arguments.length&&void 0!==arguments[1]&&arguments[1];
c=_immutable2.default.fromJS(c);
var f=c.get('type'),
g=c.filter(function(l,m){return'type'!==m});


if(f){



var h=this._store;









if(this._storeClasses.forEach(function(l){var m=l.name,o=d._store.get(m)||_immutable2.default.fromJS(l.getInitialState())||(0,_immutable.Map)();d._store=d._store.set(m,l.onAction(f,g,o)||o),l.state=d._store.get(m)}),this._debugLevel>this.DEBUG_LOGS){
var l=!this._store.equals(h),
m=l?'Changed State':'Unchanged State',
o=l?'#00d484':'#959595';

console.groupCollapsed?(
console.groupCollapsed('FLUX DISPATCH: '+f),
console.log('%c Action: ','color: #00C4FF',c.toJS()),
console.log('%c Last State: ','color: #959595',h.toJS()),
console.log('%c '+m+': ','color: '+o,this._store.toJS()),
console.groupEnd()):(

console.log('FLUX DISPATCH: '+f),
console.log('Action: '+c.toJS()),
console.log('Last State: ',h.toJS()),
console.log(m+': ',this._store.toJS()));

}


var j=_bluebird2.default.resolve();









return this._useCache&&(j=this.setSessionData(this._name,this._store)),e||j.then(function(){return d.emit(f,g)}),j.then(function(){return c})}
}},{key:'enableDebugger',value:function enableDebugger()









{var c=0<arguments.length&&void 0!==arguments[0]?arguments[0]:2;
this._debugLevel=c;
}},{key:'getClass',value:function getClass()







{var c=0<arguments.length&&void 0!==arguments[0]?arguments[0]:'';
return this._storeClasses.get(c);
}},{key:'getSessionData',value:function getSessionData(c)







{
try{
return _reactNative.AsyncStorage.getItem(c).
then(function(d){return _immutable2.default.fromJS(JSON.parse(d||'""'))}).
catch(_bluebird2.default.resolve(null));
}
catch(d){
return _bluebird2.default.resolve(null);
}
}},{key:'getStore',value:function getStore()









{var c=0<arguments.length&&void 0!==arguments[0]?arguments[0]:'',d=arguments[1];return(
Array.isArray(c)?
this._store.getIn(c,d):

''===c?


this._store||(0,_immutable.Map)():this._store.get(c,d));

}},{key:'onInit',value:function onInit(c)






{
this.on(this.ARKHAMJS_INIT,c);
}},{key:'offInit',value:function offInit(c)






{
this.off(this.ARKHAMJS_INIT,c);
}},{key:'off',value:function off(c,d)







{
this.removeListener(c,d);
}},{key:'registerStore',value:function registerStore(c)







{var d=this,
e=function onRegister(f){

return d.emit(d.ARKHAMJS_INIT),f;
};return(

Array.isArray(c)?
_bluebird2.default.all(c.map(function(f){return d._register(f)})).then(e):

this._register(c).then(e));

}},{key:'setSessionData',value:function setSessionData(c,d)








{
_immutable2.default.Iterable.isIterable(d)&&(
d=d.toJS()),


d=JSON.stringify(d);

try{
return _reactNative.AsyncStorage.setItem(c,d).
then(function(){return!0}).
catch(function(){return _bluebird2.default.resolve(!1)});
}
catch(e){
return _bluebird2.default.resolve(!1);
}
}},{key:'setStore',value:function setStore()









{var c=0<arguments.length&&void 0!==arguments[0]?arguments[0]:'',d=arguments[1];return(
Array.isArray(c)?
this._store=this._store.setIn(c,d):

''===c?


this._store||(0,_immutable.Map)():this._store=this._store.set(c,d));

}}]),b}(_events2.default),


fluxNative=new FluxNative((window||{}).arkhamjs);exports.default=
fluxNative;