<?php
add_action( 'wp_enqueue_scripts', 'enqueue_parent_styles' );

function enqueue_parent_styles() {
   wp_enqueue_style( 'parent-style', get_template_directory_uri().'/style.css' );
}

require_once("TaskController.php");

session_start();


// TODO
// DB-connector or JSON reader to import persistant data into app
$t3 = new Task();
$t3->taskId = "task3";
$t3->question = "Q3. 1 + 3";
$t3->correctAnswer = "4";
$t3->evaluation = "==";
$t3->prev = "task2";
$t3->next = null;

$t2 = new Task();
$t2->taskId = "task2";
$t2->question = "Q2. 1 + 2";
$t2->correctAnswer = "3";
$t2->evaluation = "==";
$t2->prev = "task1";
$t2->next = "task3";


$t1 = new Task();
$t1->taskId = "task1";
$t1->question = "Q1. 1 + 1";
$t1->correctAnswer = "2";
$t1->evaluation = "==";
$t1->prev = null;
$t1->next = "task2";

$showNext = false;
$showPrev = false;


$message = "";
$taskArray = array( $t1->taskId => $t1, $t2->taskId => $t2, $t3->taskId => $t3);
$c = new TaskController($taskArray);


$task = null;
if (isset($_POST['start'])) {
    $_SESSION["task_history"] = array();
    $resp = $c->processRequest(json_encode(array("current" => "task1", "todo" => "init")));
    $resp = json_decode($resp, true);
    $newId = $resp["current"];
    $newTasks = $resp["payload"];
    $task = $newTasks[$newId];
    
    array_push($_SESSION["task_history"], $resp);
    if($task["prev"] != null) $showPrev = true;
    if($task["next"] != null) $showNext = true;
}
else if(isset($_POST['next'])) {
    if( $_SESSION["task_history"] == null )
        $message = "Please press start";
    else{
        $taskId = end($_SESSION["task_history"])["current"];
        $tasks = end($_SESSION["task_history"])["payload"];
        if($tasks[$taskId]["next"] != null){
            echo $_POST['userAnswer'];
            $req = json_encode(array("current" => $taskId, "userAnswer"=>$_POST['userAnswer'] , "todo" => "next", "payload" => $tasks));
            $resp = $c->processRequest($req);
            $resp = json_decode($resp, true);
            $newId = $resp["current"];
            $newTasks = $resp["payload"];
            $task = $newTasks[$newId];
            array_push($_SESSION["task_history"], $resp);
            if($task["prev"] != null) $showPrev = true;
            if($task["next"] != null) $showNext = true;
        } else {
            $task = $tasks[$taskId];
        }
    }
}
else if(isset($_POST['prev'])) {
    if( $_SESSION["task_history"] == null )
        $message = "Please press start";
    else{
        $taskId = end($_SESSION["task_history"])["current"];
        $tasks = end($_SESSION["task_history"])["payload"];
        if($tasks[$taskId]["prev"]!=null){
            $req = json_encode(array("current" => $taskId, "userAnswer"=>$_POST['userAnswer'] , "todo" => "prev", "payload" => $tasks));
            $resp = $c->processRequest($req);
            $resp = json_decode($resp, true);
            $newId = $resp["current"];
            $newTasks = $resp["payload"];
            $task = $newTasks[$newId];
            array_push($_SESSION["task_history"], $resp);
            if($task["prev"] != null) $showPrev = true;
            if($task["next"] != null) $showNext = true;
        } else {
            $task = $tasks[$taskId];
        }
    }
}
else if(isset($_POST['eval'])) {
    if( $_SESSION["task_history"] == null)
        $message = "Press start";
    else{
        $taskId = end($_SESSION["task_history"])["current"];
        $tasks = end($_SESSION["task_history"])["payload"];
        $req = json_encode(array("current" => $taskId, "userAnswer"=>$_POST['userAnswer'] ,"todo" => "eval", "payload"=>$tasks));
        $resp = $c->processRequest($req);
        $resp = json_decode($resp, true);
        $newId = $resp["current"];
        $newTasks = $resp["payload"];
        $task = $newTasks[$newId];
        array_push($_SESSION["task_history"], $resp);
    
        $message = "Result<br>";
        foreach($newTasks as $tid => $t){
            $message .= $t["taskId"];
            $message .= $t["isCorrect"] ? "Correct" : "Incorrect";
            $message .= "<br>";
        }
    }
}

echo '
<html>
 <head>
  <title>PHP Test</title>
';
$question = isset($task["question"]) ? $task["question"] : "Press start";
echo '<form action = ? method = post>';
echo '<div>' . $question . '</div>';
echo '<div>' . $message . '</div>';
echo '<input name="userAnswer" type="textbox" />';
echo '<input name="start" type="submit" value="start"/>';
if ($showPrev) echo '<input name="prev" type="submit" value="Prev"/>';
if ($showNext) echo '<input name="next" type="submit" value="Next"/>';
else echo '<input name="eval" type="submit" value="Done"/>';
echo '</form>';
echo '
 </head>
 <body>
 <p>Testing</p>
 </body>
</html>
';
?>