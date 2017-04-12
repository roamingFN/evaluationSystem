<?php
    //connect db
	include 'connectDB.php';

    //init
    $postData = file_get_contents("php://input");
    $data = json_decode($postData);
    $user_id = $data->user_id;
    $newUsername = $data->username;

    //execute
    $sql = 'UPDATE user SET username=? WHERE user_id=?';
    $stmt = $con->prepare($sql);
    $stmt->bind_param('si', $newUsername, $user_id);     
    $result = $stmt->execute();
    if (!$result) {
        $res['res'] = $result->error;
    } 
    else {
        $res['res'] = 'success';
    }
    $con->close();

    //return result
    print_r(json_encode($res));