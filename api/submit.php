<?php
    //connect db
    include 'connectDB.php';

    //init
    $postData = file_get_contents("php://input");
    $data = json_decode($postData);
    
    //execute
    foreach ($data as $key => $value) {
        //if comment is null, then set blank
        $comment = $value->comment;
        if (is_null($comment)) $comment='';

        $sql = 'INSERT INTO score (giver_id, receiver_id, score, comment) VALUES (?,?,?,?)
            ON DUPLICATE KEY 
            UPDATE score=?, comment=?';
        $stmt = $con->prepare($sql);
        $stmt->bind_param('iiisis', $value->giver_id, $value->receiver_id, $value->score, $comment,$value->score, $value->comment);     
        $stmt->execute();
        $res['res'] = 'success';
    }
    $con->close();
    
    //return
    print_r(json_encode($res));