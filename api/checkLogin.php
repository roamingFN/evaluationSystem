<?php
    //connect db
    include 'connectDB.php';

    //init
    session_start();
    $postData = file_get_contents("php://input");
    $data = json_decode($postData);
    $username = $data->username;
    $password = $data->password;
	$res['user_id'] = 0;

    //execute
	$sql = "SELECT * FROM user WHERE username='" . mysqli_real_escape_string($con,$username) . "' AND password='" . mysqli_real_escape_string($con,$password)."'";
    $objQuery = mysqli_query($con, $sql);
    while ($row = mysqli_fetch_assoc($objQuery)) {
        $res['user_id'] = $row['user_id'];
        $res['username'] = $row['username'];
        $_SESSION['user_id'] = $row['user_id'];
    }
    $con->close();
    
    //return
    print_r(json_encode($res));
	