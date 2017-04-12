<?php
	//connect db
	include 'connectDB.php';

	//init
	$i = 0;
	$user_id = $_GET['user_id'];
	$users = array();
	
	//execute
	$sql = 'SELECT * FROM user u LEFT JOIN score s ON u.user_id=s.receiver_id AND s.giver_id='.$user_id.' WHERE u.user_id<>'.$user_id.' ORDER BY u.user_id ASC';
	$result = mysqli_query($con, $sql);
	while ($row = mysqli_fetch_assoc($result)) {
		$users[$i] = $row;
		$users[$i]['score'] = intval($row['score']);
		$i++;
	}
	$con->close();
	
	//return
	print_r(json_encode($users));

	