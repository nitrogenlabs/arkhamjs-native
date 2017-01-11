'use strict';Object.defineProperty(exports,'__esModule',{value:!0});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,'value'in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}();var _events=require('events'),_events2=_interopRequireDefault(_events),_reactNative=require('react-native'),_immutable=require('immutable'),_immutable2=_interopRequireDefault(_immutable),_bluebird=require('bluebird'),_bluebird2=_interopRequireDefault(_bluebird);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _objectWithoutProperties(obj,keys){var target={};for(var i in obj)!(0<=keys.indexOf(i))&&Object.prototype.hasOwnProperty.call(obj,i)&&(target[i]=obj[i]);return target}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError('Cannot call a class as a function')}function _possibleConstructorReturn(self,call){if(!self)throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');return call&&('object'==typeof call||'function'==typeof call)?call:self}function _inherits(subClass,superClass){if('function'!=typeof superClass&&null!==superClass)throw new TypeError('Super expression must either be null or a function, not '+typeof superClass);subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:!1,writable:!0,configurable:!0}}),superClass&&(Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass)}var









FluxNative=function(_EventEmitter){







function FluxNative(){var b=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{};_classCallCheck(this,FluxNative);var _this=_possibleConstructorReturn(this,(FluxNative.__proto__||Object.getPrototypeOf(FluxNative)).call(this));return(



b=_immutable2.default.fromJS(b),


_this._storeClasses=(0,_immutable.Map)(),
_this._store=(0,_immutable.Map)(),
_this._debug=!!b.get('debug',!1),
_this._useCache=!!b.get('cache',!0),
_this._name='arkhamjs',

_this._useCache&&
_this.getCache(),_this);

}return _inherits(FluxNative,_EventEmitter),_createClass(FluxNative,[{key:'getCache',value:function getCache()

{var _this2=this;
this.getSessionData(this._name).then(function(b){
_this2._store=_immutable.Map.isMap(b)?b:(0,_immutable.Map)();
});
}},{key:'off',value:function off(

b,c){
this.removeListener(b,c);
}},{key:'dispatch',value:function dispatch()






{var _this3=this;for(var _len=arguments.length,b=Array(_len),_key=0;_key<_len;_key++)b[_key]=arguments[_key];
if(Array.isArray(b)){



var _c=_immutable2.default.fromJS(b);
















































return _c.forEach(function(d){if(!d.get('type')){var _d$toJS=d.toJS(),e=_d$toJS.type,f=_objectWithoutProperties(_d$toJS,['type']);f=_immutable2.default.fromJS(f);var _g=_this3._store;if(_this3._storeClasses.forEach(function(i){var j=i.name,k=_this3._store.get(j)||_immutable2.default.fromJS(i.initialState())||(0,_immutable.Map)();_this3._store=_this3._store.set(j,i.onAction(e,f,k)||k),i.state=_this3._store.get(j)}),_this3._debug){var i=!_this3._store.equals(_g),j=i?'Changed State':'Unchanged State',k=i?'#00d484':'#959595';console.group?(console.group('%c FLUX DISPATCH: '+e,'font-weight:700'),console.log('%c Action: ','color: #00C4FF',d.toJS()),console.log('%c Last State: ','color: #959595',_g.toJS()),console.log('%c '+j+': ','color: '+k,_this3._store.toJS()),console.groupEnd()):(console.log('FLUX DISPATCH: '+e),console.log('Action: '+d.toJS()),console.log('Last State: ',_g.toJS()),console.log(j+': ',_this3._store.toJS()))}var _h=_bluebird2.default.resolve();_this3._useCache&&(_h=_this3.setSessionData(_this3._name,_this3._store)),_h.then(function(){return _this3.emit(e,f)})}}),_c}
}},{key:'getStore',value:function getStore()









{var b=0<arguments.length&&void 0!==arguments[0]?arguments[0]:'',c=arguments[1];return(
Array.isArray(b)?
this._store.getIn(b,c):

''===b?


this._store||(0,_immutable.Map)():this._store.get(b,c));

}},{key:'registerStore',value:function registerStore(







b){var _this4=this,
c=b.name;






















return this._storeClasses.get(c)||function(){var d=new b;_this4._storeClasses=_this4._storeClasses.set(c,d),_this4._useCache&&_this4.getSessionData(_this4._name).then(function(e){var f=_immutable.Map.isMap(e)?e:(0,_immutable.Map)(),g=_this4._store.get(c)||f.get(c)||_immutable2.default.fromJS(d.initialState())||(0,_immutable.Map)();_this4._store=_this4._store.set(c,g),_this4.setSessionData(_this4._name,_this4._store)})}(),this._storeClasses.get(c);
}},{key:'deregisterStore',value:function deregisterStore()






{var b=0<arguments.length&&void 0!==arguments[0]?arguments[0]:'';
this._storeClasses=this._storeClasses.delete(b),
this._store=this._store.delete(b);
}},{key:'getClass',value:function getClass()







{var b=0<arguments.length&&void 0!==arguments[0]?arguments[0]:'';
return this._storeClasses.get(b);
}},{key:'setSessionData',value:function setSessionData(








b,c){
_immutable2.default.Iterable.isIterable(c)&&(
c=c.toJS()),


c=JSON.stringify(c);

try{
return _reactNative.AsyncStorage.setItem(b,c).
then(function(){return!0}).
catch(function(){return _bluebird2.default.resolve(!1)});
}
catch(d){
return _bluebird2.default.resolve(!1);
}
}},{key:'getSessionData',value:function getSessionData(







b){
try{
return _reactNative.AsyncStorage.getItem(b).
then(function(c){return _immutable2.default.fromJS(JSON.parse(c||'""'))}).
catch(_bluebird2.default.resolve(null));
}
catch(c){
return _bluebird2.default.resolve(null);
}
}},{key:'delSessionData',value:function delSessionData(







b){
try{
return _reactNative.AsyncStorage.removeItem(b).then(function(){return!0}).catch(function(){return _bluebird2.default.resolve(!1)});
}
catch(c){
return _bluebird2.default.resolve(!1);
}
}},{key:'clearSessionData',value:function clearSessionData()






{
try{
return _reactNative.AsyncStorage.removeItem(this._name).then(function(){return!0}).catch(function(){return _bluebird2.default.resolve(!1)});
}
catch(b){
return _bluebird2.default.resolve(!1);
}
}},{key:'enableDebugger',value:function enableDebugger()






{var b=0<arguments.length&&void 0!==arguments[0]?arguments[0]:!0;
this._debug=b;
}}]),FluxNative}(_events2.default);


var fluxNative=new FluxNative((window||{}).arkhamjs);exports.default=
fluxNative;