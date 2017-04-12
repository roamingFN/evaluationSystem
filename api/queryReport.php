<?php
	//connect db
	include 'connectDB.php';

	//init
	$i = 0;
	$user_id = $_GET['user_id'];
	$users = array();
	
	//execute
	$sql = 'SELECT * FROM score JOIN user ON user_id=giver_id WHERE receiver_id='.$user_id;
	$result = mysqli_query($con, $sql);
	while ($row = mysqli_fetch_assoc($result)) {
		$users[$i] = $row;
		$users[$i]['score'] = intval($row['score']);
		$i++;
	}
	$con->close();
	
	//return
	print_r(json_encode($users));

	