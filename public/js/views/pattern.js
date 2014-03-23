(function(){"use strict";var __hasProp={}.hasOwnProperty,__extends=function(child,parent){function ctor(){this.constructor=child}for(var key in parent)__hasProp.call(parent,key)&&(child[key]=parent[key]);return ctor.prototype=parent.prototype,child.prototype=new ctor,child.__super__=parent.prototype,child};define(["backbone","collections/pattern"],function(Backbone){var PatternView;return PatternView=function(_super){function PatternView(){return PatternView.__super__.constructor.apply(this,arguments)}return __extends(PatternView,_super),PatternView.prototype.el=".patterns",PatternView.prototype.initialize=function(options){return this.app=options.parent,this.scaffoldGrid()},PatternView.prototype.updatePlayHead=function(percent){return this.$playHead.animate({left:percent+"%"})},PatternView.prototype.scaffoldGrid=function(){var cols,html,i,rows,z;for(i=0,cols=[];13>i;){for(z=0,cols[i]=$('<div class="col col-1">'),rows=[];16>z;)html=0===i?'<div data-bind="Sound.'+(z+1)+'.name" class="slot slot-label">Sound '+(z+1)+"</div>":'<div class="slot">&nbsp;</div>',rows.push($(html)),z++;cols[i].append(rows),i++}return this.$el.append(cols),this.$playHead=this.$el.append($('<div id="playHead">'))},PatternView.prototype.render=function(){return this.$el.empty(),this.scaffoldGrid()},PatternView}(Backbone.View)})}).call(this);