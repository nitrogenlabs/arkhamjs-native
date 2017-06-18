'use strict';var _createClass=function(){function a(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,'value'in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}(),_react=require('react'),_react2=_interopRequireDefault(_react),_propTypes=require('prop-types'),_propTypes2=_interopRequireDefault(_propTypes),_immutable=require('immutable'),_immutable2=_interopRequireDefault(_immutable),_Flux=require('../Flux'),_Flux2=_interopRequireDefault(_Flux),_ArkhamConstants=require('../constants/ArkhamConstants'),_ArkhamConstants2=_interopRequireDefault(_ArkhamConstants);Object.defineProperty(exports,'__esModule',{value:!0});function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError('Cannot call a class as a function')}function _possibleConstructorReturn(a,b){if(!a)throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');return b&&('object'==typeof b||'function'==typeof b)?b:a}function _inherits(a,b){if('function'!=typeof b&&null!==b)throw new TypeError('Super expression must either be null or a function, not '+typeof b);a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),b&&(Object.setPrototypeOf?Object.setPrototypeOf(a,b):a.__proto__=b)}var













View=function(a){










function b(a){_classCallCheck(this,b);var c=_possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).call(this,a));return(



c.getNavigationParams=c.getNavigationParams.bind(c),
c.goto=c.goto.bind(c),
c.onGoto=c.onGoto.bind(c),
c.onGoBack=c.onGoBack.bind(c),
c.onGoReplace=c.onGoReplace.bind(c),c);
}return _inherits(b,a),_createClass(b,[{key:'componentWillMount',value:function componentWillMount()

{
_Flux2.default.on(_ArkhamConstants2.default.GOTO,this.onGoto),
_Flux2.default.on(_ArkhamConstants2.default.GO_BACK,this.onGoBack),
_Flux2.default.on(_ArkhamConstants2.default.GO_REPLACE,this.onGoReplace),
this.viewWillMount();
}},{key:'componentDidMount',value:function componentDidMount()

{
this.viewDidMount();
}},{key:'componentWillUnmount',value:function componentWillUnmount()

{
_Flux2.default.off(_ArkhamConstants2.default.GOTO,this.onGoto),
_Flux2.default.off(_ArkhamConstants2.default.GO_BACK,this.onGoBack),
_Flux2.default.off(_ArkhamConstants2.default.GO_REPLACE,this.onGoReplace),
this.viewWillUnmount();
}},{key:'viewWillMount',value:function viewWillMount()

{
}},{key:'viewDidMount',value:function viewDidMount()

{
}},{key:'viewWillUnmount',value:function viewWillUnmount()

{
}},{key:'getNavigationParams',value:function getNavigationParams(a)

{
_immutable2.default.Iterable.isIterable(a)||(
a=a.toJS());


var b=a.url||'/',
c=a.params;

return{params:c,url:b};
}},{key:'goto',value:function goto()

{var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:'/',b=arguments[1];
this.props.history.push(a,{params:b});
}},{key:'onGoto',value:function onGoto(a)

{var b=
this.getNavigationParams(a),c=b.params,d=b.url;
this.goto(d,c);
}},{key:'onGoBack',value:function onGoBack()

{
this.props.history.goBack();
}},{key:'onGoReplace',value:function onGoReplace(a)

{var b=
this.getNavigationParams(a),c=b.params,d=b.url;
this.props.history.replace(d,{params:c});
}},{key:'render',value:function render()

{
return null;
}}]),b}(_react2.default.Component);View.propTypes={history:_propTypes2.default.object.isRequired,location:_propTypes2.default.object.isRequired,match:_propTypes2.default.object.isRequired},View.contextTypes={config:_propTypes2.default.object},exports.default=View;