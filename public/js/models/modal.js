(function(){var __hasProp={}.hasOwnProperty,__extends=function(child,parent){function ctor(){this.constructor=child}for(var key in parent)__hasProp.call(parent,key)&&(child[key]=parent[key]);return ctor.prototype=parent.prototype,child.prototype=new ctor,child.__super__=parent.prototype,child};define(["underscore","backbone"],function(_,Backbone){"use strict";var ModalModel;return ModalModel=function(_super){function ModalModel(){return ModalModel.__super__.constructor.apply(this,arguments)}return __extends(ModalModel,_super),ModalModel.prototype.defaults={cancel:!0,action:!0,title:"",body:""},ModalModel}(Backbone.Model)})}).call(this);