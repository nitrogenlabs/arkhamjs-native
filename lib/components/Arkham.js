'use strict';var _createClass=function(){function a(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,'value'in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}(),_react=require('react'),_react2=_interopRequireDefault(_react),_reactRouterNative=require('react-router-native'),_propTypes=require('prop-types'),_propTypes2=_interopRequireDefault(_propTypes),_Flux=require('../Flux'),_Flux2=_interopRequireDefault(_Flux),_ArkhamConstants=require('../constants/ArkhamConstants'),_ArkhamConstants2=_interopRequireDefault(_ArkhamConstants);Object.defineProperty(exports,'__esModule',{value:!0});function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError('Cannot call a class as a function')}function _possibleConstructorReturn(a,b){if(!a)throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');return b&&('object'==typeof b||'function'==typeof b)?b:a}function _inherits(a,b){if('function'!=typeof b&&null!==b)throw new TypeError('Super expression must either be null or a function, not '+typeof b);a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),b&&(Object.setPrototypeOf?Object.setPrototypeOf(a,b):a.__proto__=b)}var













Arkham=function(a){


















function b(a){_classCallCheck(this,b);var c=_possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).call(this,a));return(



c.onInit=c.onInit.bind(c),
c.onUpdateView=c.onUpdateView.bind(c),


c.state={
init:!1},



c._config=a.config,
_Flux2.default.config(c._config),c);
}return _inherits(b,a),_createClass(b,[{key:'componentWillMount',value:function componentWillMount()

{

_Flux2.default.onInit(this.onInit);var a=


this.props.stores;


a.length&&
_Flux2.default.registerStore(this.props.stores);

}},{key:'componentWillUnmount',value:function componentWillUnmount()

{

_Flux2.default.offInit(this.onInit);
}},{key:'getChildContext',value:function getChildContext()

{
return{
config:this._config};

}},{key:'onInit',value:function onInit()

{

this.setState({init:!0});
}},{key:'onUpdateView',value:function onUpdateView(a,b)

{return(

_Flux2.default.dispatch(_ArkhamConstants2.default.UPDATE_VIEW),


this.props.config.getUserConfirmation?
this.props.config.getUserConfirmation(a,b):

b(!0));

}},{key:'render',value:function render()

{return(
this.state.init?

_react2.default.createElement(_reactRouterNative.NativeRouter,null,
_react2.default.createElement(_reactRouterNative.Switch,null,
this.props.children)):





null);
}}]),b}(_react.Component);Arkham.propTypes={children:_propTypes2.default.element,className:_propTypes2.default.string,config:_propTypes2.default.object,routes:_propTypes2.default.array,stores:_propTypes2.default.array},Arkham.defaultProps={config:{},routes:[],stores:[]},Arkham.childContextTypes={config:_propTypes2.default.object},exports.default=Arkham;