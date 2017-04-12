var app = angular.module('evaluateSystem', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl : 'view/login.html'
    })
    .when('/login', {
        templateUrl : 'view/login.html'
    })
    .when('/main/:user_id', {
        templateUrl : 'view/main.html'
    })
    .when('/main/:user_id/edit', {
        templateUrl : 'view/edit.html'
    })
    .when('/main/:user_id/report', {
        templateUrl : 'view/report.html'
    })
    .otherwise({redirectTo:'/'});
});

// service to share data across controllers
app.service('dataService', function () {
	var data = {
		user_id: '',
		username: ''
	};
	
	return {
        getData: function () {
            return data;
        },
        setData: function (value) {
            data = value;
        }
    } 
});

app.run(['$rootScope', '$location', 'dataService' ,'$http', function ($rootScope, $location, dataService,$http) {
    $rootScope.$on('$routeChangeStart', function (event) {

        //check authorization
        var data = dataService.getData();
        //console.log(data);
        if (data.user_id=='') {
            console.log('go login');
            //$location.path('/login');
        }
        else {
            console.log('already login');
            //$location.path('/main/' + data.user_id);
        }
    });
}]);