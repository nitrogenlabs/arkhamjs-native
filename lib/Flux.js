'use strict';var _createClass=function(){function a(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,'value'in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}(),_events=require('events'),_events2=_interopRequireDefault(_events),_reactNative=require('react-native'),_immutable=require('immutable'),_immutable2=_interopRequireDefault(_immutable),_bluebird=require('bluebird'),_bluebird2=_interopRequireDefault(_bluebird);Object.defineProperty(exports,'__esModule',{value:!0});function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError('Cannot call a class as a function')}function _possibleConstructorReturn(a,b){if(!a)throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');return b&&('object'==typeof b||'function'==typeof b)?b:a}function _inherits(a,b){if('function'!=typeof b&&null!==b)throw new TypeError('Super expression must either be null or a function, not '+typeof b);a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),b&&(Object.setPrototypeOf?Object.setPrototypeOf(a,b):a.__proto__=b)}var









Flux=function(a){







function b(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{};_classCallCheck(this,b);var c=_possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).call(this));return(



c._deregister=c._deregister.bind(c),
c._getCache=c._getCache.bind(c),
c._register=c._register.bind(c),
c.clearAppData=c.clearAppData.bind(c),
c.config=c.config.bind(c),
c.debugError=c.debugError.bind(c),
c.debugInfo=c.debugInfo.bind(c),
c.debugLog=c.debugLog.bind(c),
c.delSessionData=c.delSessionData.bind(c),
c.deregisterStore=c.deregisterStore.bind(c),
c.dispatch=c.dispatch.bind(c),
c.enableDebugger=c.enableDebugger.bind(c),
c.getClass=c.getClass.bind(c),
c.getSessionData=c.getSessionData.bind(c),
c.getStore=c.getStore.bind(c),
c.off=c.off.bind(c),
c.registerStore=c.registerStore.bind(c),
c.setSessionData=c.setSessionData.bind(c),
c.setStore=c.setStore.bind(c),


c._storeClasses=(0,_immutable.Map)(),
c._store=(0,_immutable.Map)(),


c.DEBUG_DISABLED=0,
c.DEBUG_LOGS=1,
c.DEBUG_DISPATCH=2,


c.ARKHAMJS_INIT='ARKHAMJS_INIT',


c.config(a),c);
}return _inherits(b,a),_createClass(b,[{key:'_deregister',value:function _deregister()

{var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:'';
this._storeClasses=this._storeClasses.delete(a),
this._store=this._store.delete(a);
}},{key:'_getCache',value:function _getCache()

{var a=this;
return this.getSessionData(this._name).then(function(b){
if(_immutable.Map.isMap(b))

return a._store=b,b;

});
}},{key:'_register',value:function _register(a)

{var b=this;
if(!a)
throw Error('Class is undefined. Cannot register with Flux.');


var c=_bluebird2.default.resolve(),
d=a.constructor.toString().substr(0,5);

if('class'!==d&&'funct'!==d)
throw Error(a+' is not a class. Cannot register with Flux.');



var e=new a,
f=e.name;

if(!this._storeClasses.get(f))




if(this._storeClasses=this._storeClasses.set(f,e),this._useCache)
c=this.getSessionData(this._name).
then(function(a){
var c=_immutable.Map.isMap(a)?a:(0,_immutable.Map)(),


d=c.get(f)||b._store.get(f)||e.getInitialState()||(0,_immutable.Map)();




return b._store=b._store.set(f,d),b.setSessionData(b._name,b._store),b._storeClasses.get(f);
});else
{

var g=this._store.get(f)||e.getInitialState()||(0,_immutable.Map)();
this._store=this._store.set(f,g);
}


return c.then(function(){return b._storeClasses.get(f)});
}},{key:'clearAppData',value:function clearAppData()






{var a=this;
try{return(

this._storeClasses.forEach(function(b){
var c=_immutable2.default.fromJS(b.getInitialState());
a._store=a._store.set(b.name,c),
b.store=c;
}),

this._useCache?
_reactNative.AsyncStorage.setItem(this._name,this._store).then(function(){return!0}).catch(function(){return _bluebird2.default.resolve(!1)}):

_bluebird2.default.resolve(!0));

}
catch(a){
return _bluebird2.default.resolve(!1);
}
}},{key:'config',value:function config(a)






{
this._options=a||{},


this._name=this._options.name||'arkhamjs',


this._useCache=!1!==this._options.useCache,

this._useCache&&
this._getCache(),



this._useImmutable=!1!==this._options.useImmutable,


this._debugLevel=this._options.debugLevel||this.DEBUG_DISABLED;
}},{key:'debugError',value:function debugError()







{for(var a=arguments.length,b=Array(a),c=0;c<a;c++)b[c]=arguments[c];
if(this._debugLevel){var d;
(d=console).error.apply(d,b);
}

var e=this._options.debugErrorFnc;e&&


e.apply(void 0,[this._debugLevel,b]);

}},{key:'debugInfo',value:function debugInfo()







{for(var a=arguments.length,b=Array(a),c=0;c<a;c++)b[c]=arguments[c];
if(this._debugLevel){var d;
(d=console).info.apply(d,b);
}

var e=this._options.debugInfoFnc;e&&


e.apply(void 0,[this._debugLevel,b]);

}},{key:'debugLog',value:function debugLog()







{for(var a=arguments.length,b=Array(a),c=0;c<a;c++)b[c]=arguments[c];
if(this._debugLevel){var d;
(d=console).log.apply(d,b);
}

var e=this._options.debugLogFnc;e&&


e.apply(void 0,[this._debugLevel,b]);

}},{key:'delSessionData',value:function delSessionData(a)







{
try{
return _reactNative.AsyncStorage.removeItem(a).then(function(){return!0}).catch(function(){return _bluebird2.default.resolve(!1)});
}
catch(a){
return _bluebird2.default.resolve(!1);
}
}},{key:'deregisterStore',value:function deregisterStore(a)






{var b=this;
Array.isArray(a)?
a.forEach(function(a){
b._deregister(a);
}):

this._deregister(a);

}},{key:'dispatch',value:function dispatch(a)









{var b=this,c=1<arguments.length&&void 0!==arguments[1]&&arguments[1];
a=_immutable2.default.fromJS(a);
var d=a.get('type'),
e=a.filter(function(a,b){return'type'!==b});


if(d){



var f=this._store;









if(this._storeClasses.forEach(function(a){var c=a.name,f=b._store.get(c)||_immutable2.default.fromJS(a.getInitialState())||(0,_immutable.Map)();b._store=b._store.set(c,a.onAction(d,e,f)||f),a.state=b._store.get(c)}),this._debugLevel>this.DEBUG_LOGS){
var h=!this._store.equals(f),
i=h?'Changed State':'Unchanged State',
j=h?'#00d484':'#959595';

console.groupCollapsed?(
console.groupCollapsed('FLUX DISPATCH: '+d),
console.log('%c Action: ','color: #00C4FF',a.toJS()),
console.log('%c Last State: ','color: #959595',f.toJS()),
console.log('%c '+i+': ','color: '+j,this._store.toJS()),
console.groupEnd()):(

console.log('FLUX DISPATCH: '+d),
console.log('Action: '+a.toJS()),
console.log('Last State: ',f.toJS()),
console.log(i+': ',this._store.toJS()));

}


var g=_bluebird2.default.resolve();return(

this._useCache&&(
g=this.setSessionData(this._name,this._store)),


this._useImmutable?(c||

g.then(function(){return b.emit(d,e)}),


g.then(function(){return a})):(c||


g.then(function(){return b.emit(d,e.toJS())}),


g.then(function(){return a.toJS()})))}

}},{key:'enableDebugger',value:function enableDebugger()









{var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:2;
this._debugLevel=a;
}},{key:'getClass',value:function getClass()







{var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:'';
return this._storeClasses.get(a);
}},{key:'getSessionData',value:function getSessionData(a)







{var b=this;
try{
return _reactNative.AsyncStorage.getItem(a).
then(function(a){return(
a=JSON.parse(a||'""'),

console.log('getSessionData::value',b._useImmutable,a),
b._useImmutable?
_immutable2.default.fromJS(a):a);



}).
catch(_bluebird2.default.resolve(null));
}
catch(a){
return _bluebird2.default.resolve(null);
}
}},{key:'getStore',value:function getStore()









{var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:'',b=arguments[1],
c=void 0;return(


_immutable2.default.Iterable.isIterable(b)||(
b=b?_immutable2.default.fromJS(b):null),c=


Array.isArray(a)?
this._store.getIn(a,b):

''===a?


this._store||(0,_immutable.Map)():this._store.get(a,b),


this._useImmutable?c:


_immutable2.default.Iterable.isIterable(c)?c.toJS():c);

}},{key:'onInit',value:function onInit(a)






{
this.on(this.ARKHAMJS_INIT,a);
}},{key:'offInit',value:function offInit(a)






{
this.off(this.ARKHAMJS_INIT,a);
}},{key:'off',value:function off(a,b)







{
this.removeListener(a,b);
}},{key:'registerStore',value:function registerStore(a)







{var b=this,
c=function(a){

return b.emit(b.ARKHAMJS_INIT),a;
};return(

Array.isArray(a)?
_bluebird2.default.all(a.map(function(a){return b._register(a)})).then(c):

this._register(a).then(c));

}},{key:'setSessionData',value:function setSessionData(a,b)








{
_immutable2.default.Iterable.isIterable(b)&&(
b=b.toJS()),


b=JSON.stringify(b);

try{
return _reactNative.AsyncStorage.setItem(a,b).
then(function(){return!0}).
catch(function(){return _bluebird2.default.resolve(!1)});
}
catch(a){
return _bluebird2.default.resolve(!1);
}
}},{key:'setStore',value:function setStore()









{var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:'',b=arguments[1];return(
Array.isArray(a)?
this._store=this._store.setIn(a,b):

''===a?


this._store||(0,_immutable.Map)():this._store=this._store.set(a,b));

}}]),b}(_events2.default),


flux=new Flux;exports.default=
flux;