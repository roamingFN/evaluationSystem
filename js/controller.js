// login Controller
app.controller('loginCtrl', function ($scope, $http, $location, dataService) {
	$scope.login = function () {
		$http.post('api/checkLogin.php', $scope.auth).then( function (res){
			if (res.data.user_id) {
				dataService.setData(res.data);
				$location.path('/main/' + res.data.user_id);
			}
			else {
				alert('Invalid username or password');
			}
		});
	}
});

// main Controller
app.controller('mainCtrl', function ($scope, $http, $routeParams, $location, dataService) {
	//get date time
	var dateTime = new Date();
	$scope.currentDateTime = dateTime.getDate() + ' ' + (getMonth(dateTime.getMonth())) + ' ' + dateTime.getFullYear();
	
	//get user info
	var user_id = $routeParams.user_id;
	$http.get('api/getUser.php', { params: { user_id: user_id }}).then( function (res){
		if (res.data.user_id) {
			dataService.setData(res.data);
			user_id = res.data.user_id;
			$scope.user_id = res.data.user_id;
			$scope.username = res.data.username;
		}
	});

	//get form
	queryForm();

	////var data = dataService.getData();
	//if there's no value from data service (in case of refresh or run directly), then get user obj
	// if (data.user_id=="") {
	// 	user_id = $routeParams.user_id;

	// 	$http.get('api/getUser.php', { params: { user_id: user_id }}).then( function (res){
	// 		if (res.data.user_id) {
	// 			dataService.setData(res.data);
	// 			user_id = res.data.user_id;
	// 			$scope.user_id = res.data.user_id;
	// 			$scope.username = res.data.username;
	// 		}
	// 	});
	// }
	// else {
	// 	user_id = data.user_id;
	// 	$scope.user_id = data.user_id;
	// 	$scope.username = data.username;
	// }

	function getMonth(month) {
		var monthNames = [
			"January", "February", "March",
			"April", "May", "June", "July",
			"August", "September", "October",
			"November", "December"
		];
		return monthNames[month];
	}

	function queryForm() {
		$http.get('api/queryForm.php', { params: { user_id: user_id }}).then( function (res) {
			$scope.users = res.data
			//console.log(res.data);
			
			// set giver_id/receiver_id/comment
			angular.forEach($scope.users, function(value, key) {
				$scope.users[key].giver_id = user_id;
				$scope.users[key].receiver_id = value.user_id;
			});
		});
	}

	$scope.validateInput = function (e) {
		if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) || 
             // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 49 || e.keyCode > 53)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
	}

	$scope.submit = function () {
		$http.post('api/submit.php', $scope.users).then( function (res){
			//console.log($scope.users);
			//console.log(res);
			alert('submit success');
			queryForm();
		});
	}

	$scope.toEdit = function() {
		$location.path('/main/' + user_id + '/edit');
	}
	
	$scope.toReport = function() {
		$location.path('/main/' + user_id + '/report');
	}
	
	$scope.logout = function () {
		var objLogout = {
			user_id: '',
			username: ''
		}
		dataService.setData(objLogout);
		location.href = '';
	}
	console.log(dataService.getData());

	$('#test').rating();
});

app.directive('starRating', function() {
	// var starTemplate = '<div class="rating-container rating-xs rating-animate">'
	// + '<div class="clear-rating clear-rating-active" title="Clear"><i class="glyphicon glyphicon-minus-sign"></i></div>'
	// + '<div class="rating-stars"><span class="empty-stars"><span class="star">'
	// + '<i class="glyphicon glyphicon-star-empty"></i></span><span class="star">'
	// + '<i class="glyphicon glyphicon-star-empty"></i></span><span class="star">'
	// + '<i class="glyphicon glyphicon-star-empty"></i></span><span class="star">'
	// + '<i class="glyphicon glyphicon-star-empty"></i></span><span class="star">'
	// + '<i class="glyphicon glyphicon-star-empty"></i></span></span>'
	// + '<span class="filled-stars" style="width: 20%;"><span class="star">' 
	// + '<i class="glyphicon glyphicon-star"></i></span><span class="star">'
	// + '<i class="glyphicon glyphicon-star"></i></span><span class="star">' 
	// + '<i class="glyphicon glyphicon-star"></i></span><span class="star">' 
	// + '<i class="glyphicon glyphicon-star"></i></span><span class="star">'
	// + '<i class="glyphicon glyphicon-star"></i></span></span>'
	// + '<div>'
	// + '<div class="caption"><span class="label label-danger">Very Poor</span></div></div>';

	return {
		// Restrict it to be an attribute in this case
		restrict: 'E',
		//template: starTemplate,
		// responsible for registering DOM listeners as well as updating the DOM
		link: function(scope, element, attrs) {
			element.val(attrs.value);
		    $(element).rating({
		    	step: 1,
		    	size: 'xs',
		    	starCaptions: {1: 'Very Poor', 2: 'Poor', 3: 'Ok', 4: 'Good', 5: 'Excellent'}
		    });	    
		}
	};
});

// edit Controller
app.controller('editCtrl', function ($scope, $http, dataService, $location) {
	var data = dataService.getData();
	var objEdit = {
		user_id: data['user_id'],
		username: data['username']
	}
	$scope.objEdit = objEdit;

	$scope.toMain = function () {
		$location.path('/main/' + objEdit.user_id);
	}

	$scope.edit = function () {
		$http.post('api/changeUsername.php', $scope.objEdit).then( function (res){
			if (res['data']['res']=='success') {
				alert('edit success');
				$location.path('/main/' + objEdit.user_id);
			}
			else {
				alert('Error: Username is already existed.');
			}
		});
	}
});

// report Controller
app.controller('reportCtrl', function ($scope, $http, $routeParams, $location) {
	//init
	var user_id = $routeParams.user_id;
	var material;
	var result;

	google.charts.load('current', {packages: ['corechart', 'bar']});
	google.charts.setOnLoadCallback(drawMaterial);
	
	function drawMaterial() {
		//init
		var scores = [0, 0, 0, 0, 0, 0];

		//get data
		$http.get('api/queryReport.php', { params: { user_id: user_id }}).then( function (res) {
			result = res.data
			
			//count data
			for (var key in result) {
				if (!result.hasOwnProperty(key)) continue;
				var obj = result[key];
				if (obj['score']>5) continue;
				scores[obj['score']] = scores[obj['score']] + 1;
			}

			//console.log(result);
			
			var data = google.visualization.arrayToDataTable([
				['Score', 'People'],
				['1', scores[1]],
				['2', scores[2]],
				['3', scores[3]],
				['4', scores[4]],
				['5', scores[5]]
			]);

			var options = {
				chart: {
				  title: 'My Report'
				},
				hAxis: {
				  title: 'Total',
				  minValue: 0,
				},
				vAxis: {
				  title: 'City'
				},
				bars: 'verical'
			};

			material = new google.charts.Bar(document.getElementById('chart_div'));
			material.draw(data, options);

			//event
			google.visualization.events.addListener(material, 'select', showComment);

		}); // end http get data
	} // end function

	function showComment(e) {
		var selection = material.getSelection();
		if (typeof(selection[0])=='undefined') return;
		var row = selection[0].row;

		var str = '';
		//find comment
		for (var key in result) {
			if (!result.hasOwnProperty(key)) continue;
			var obj = result[key];

			if (obj['score']==row+1) {
				if (obj['comment']=='') continue;
				str = str + '<p>' + obj['username'] + ': ' + obj['comment']+ '</p>';
			}
		} // end for loop result
		
		//show comment
		if (str=='') {
			str = '<p>There are no Comments</p>';
		}

		$('#commentDiv').html(str);

	} // end function

	$scope.toMain = function () {
		$location.path('/main/' + user_id);
	}
});