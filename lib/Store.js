'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _immutable=require('immutable');function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var






Store=function(){






function Store(){_classCallCheck(this,Store);
this.state=(0,_immutable.Map)();
}_createClass(Store,[{key:'initialState',value:function initialState()





{
return(0,_immutable.Map)();
}},{key:'onAction',value:function onAction(









type,data,state){
switch(type){
default:
return state;}

}},{key:'setState',value:function setState(















state){
this.state=state;
}},{key:'name',get:function get(){return this.constructor.name.toLowerCase();}}]);return Store;}();exports.default=Store;