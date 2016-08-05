'use strict';

var m = angular.module('app', []);

m.component('component', {
	templateUrl: './ng-template.html',
	controller: ComponentComponent
});
function ComponentComponent() {
	this.$onInit = function() {
		console.log('Hello World');
	};
}

m.component('component2', {
	controller: ComponentComponent,
	templateUrl: './ng-template-2.html'
});

m.directive('directive', function() {
	return {
		controller: ComponentComponent,
		templateUrl: './ng-template.html'
	};
});

m.directive('directive2', function() {
	return {
		controller: ComponentComponent,
		templateUrl: './ng-template-2.html'
	};
});