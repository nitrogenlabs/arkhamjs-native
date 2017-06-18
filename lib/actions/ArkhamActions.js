'use strict';Object.defineProperty(exports,'__esModule',{value:!0});



var _Flux=require('../../src/Flux'),_Flux2=_interopRequireDefault(_Flux),_ArkhamConstants=require('../../src/constants/ArkhamConstants'),_ArkhamConstants2=_interopRequireDefault(_ArkhamConstants);function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}






var ArkhamActions={
goto:function goto(a,b){
return _Flux2.default.dispatch({type:_ArkhamConstants2.default.GOTO,url:a,params:b});
},

goBack:function goBack(){
return _Flux2.default.dispatch({type:_ArkhamConstants2.default.GO_BACK});
},

goReplace:function goReplace(a,b){
return _Flux2.default.dispatch({type:_ArkhamConstants2.default.GO_REPLACE,url:a,params:b});
}};exports.default=


ArkhamActions;