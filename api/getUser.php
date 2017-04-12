<?php
    //connect db
    include 'connectDB.php';

    //init
    $user_id = $_GET['user_id'];
    $res['user_id'] = '';
    $res['username'] = '';
    
    //execute
	$sql = 'SELECT user_id,username FROM user WHERE user_id='.$user_id;
    $stmt = $con->prepare($sql);
    $stmt->bind_result($uid, $uname);
    $stmt->execute();
    while ($stmt->fetch()) {
        $res['user_id'] = $uid;
        $res['username'] = $uname;
    }
    $con->close();
    
    //return
    print_r(json_encode($res));