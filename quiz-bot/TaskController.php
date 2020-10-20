<?php
class Task{
    public $taskId;
    public $question;
    /* TODO: support options, checkboxes
    "question" : {
        "type" : "short"
        "text" : "1 + 1 = ?"
    }
    "question" : {
        "type" : "radio"
        "text" : "1 + 1 = ?"
        "options" : {
            "1":"1",
            "2":"2",
            "3":"3"
        }
    }
    "question" : {
        "type" : "checkbox"
        "text" : "Darwin's The Process of Natural Selection"
        "options" : {
            "1":"Variation",
            "2":"Inheritance",
            "3":"High rate of population growth",
            "4":"Differential survival and reproduction"
        }
    }
    */
    public $userAnswer;
    public $correctAnswer;
    public $evaluation;
    public $prev;
    public $next;
}

class TaskController{
    private $taskArray;
    private $respPayload;

    public function __construct($taskArray){
        $this->taskArray = $taskArray;
        $this->respPayload = $this->initRespPayload();
    }

    public function addTask($task){
        $taskArray[$task->taskId] = $task;
    }

 
    /* 
     * @return - example
     *{
     *   "current" : "task1" // current task id
     *   "payload" : {       // whole tasks
     *       "task1" : {
     *           "taskId" : "task1",
     *           "question" : "this is some question", 
     *           "userAnswer" : null,
     *           "correctAnswer" : "some answer",
     *           "isCorrect" : null,
     *           "prev" : null,
     *           "next" : "task2" },
     *       "task2 : {
     *           "taskId" : "task1",
     *           "question" : "this is some question",
     *           "userAnswer" : null,
     *           "correctAnswer" : "some answer",
     *           "isCorrect" : null,
     *           "prev" : "task1",
     *           "next" : null }
     *   }
     *}
     */
    private function initRespPayload() {
        // assume the first element is the start of the question sequence
        $resp = array("current" => array_keys($this->taskArray)[0]); 
        
        $payload = array();
        foreach($this->taskArray as $taskId => $task){
            $unitPayload =  array(
                "taskId" => $task->taskId,
                "question" => $task->question,
                "userAnswer" => null,
                "correctAnswer" => $task->correctAnswer,
                "isCorrect" => null,
                "prev" => $task->prev,
                "next" => $task->next);
            $payload[$taskId] = $unitPayload;
        }

        $resp["payload"] = $payload;
        return $resp;
    }

    public function generateRespPayload($current, $payload){
        $resp = array();
        $resp["current"] = $current;
        $resp["payload"] = $payload;
        return $resp;
    }

    public function updatePayloadInReq($req){
        
        $taskId = $req["current"];
        $payloadFromReq = $req["payload"];

        $updatedPayload = null;
        if($payloadFromReq != null){
            $updatedPayload = $payloadFromReq;

            if ( !isset($req["userAnswer"]) || strlen(trim($req["userAnswer"])) == 0){
                $req["userAnswer"] = null;
            }
            $updatedPayload[$taskId]["userAnswer"] = $req["userAnswer"];

            if ($req["userAnswer"] == null)
                $updatedPayload[$taskId]["isCorrect"] = null;
            else 
                $updatedPayload[$taskId]["isCorrect"] = $this->evaluate($this->taskArray[$taskId], $req);
        }
        else {
            $updatedPayload = $this->respPayload["payload"];
        }
        
        return $updatedPayload;
    }

    private $requestPayload = array(
        "current" => null,
        "userAnswer" => null,
        "todo" => null,
        "payload" => null
    );


    public function sanitizeRequestPayload($req){
        $req_array = json_decode($req, true);
        // if($req_array["taskId"] ?? null == null)
        //     echo "ERROR in REQ: taskId is null";
        foreach($this->requestPayload as $key => $value){
            // collect only needed
            $this->requestPayload[$key] = isset($req_array[$key]) ? $req_array[$key]: null;
        }
        return $this->requestPayload;
    }

    public function evaluate($task, $req){
        $returnVal = false;
        if($task->evaluation == "=="){
            if(trim($req["userAnswer"]) == $task->correctAnswer) $returnVal = true;
        } else if ($task->evaluation == ">"){
            if(trim($req["userAnswer"]) > $task->correctAnswer) $returnVal = true;
        } else if ($task->evaluation == ">="){
            if(trim($req["userAnswer"]) >= $task->correctAnswer) $returnVal = true;
        } else if ($task->evaluation == "<"){
            if(trim($req["userAnswer"]) < $task->correctAnswer) $returnVal = true;
        } else if ($task->evaluation == "<="){
            if(trim($req["userAnswer"]) <= $task->correctAnswer) $returnVal = true;
        } else if ($task->evaluation == "!="){
            if(trim($req["userAnswer"]) <= $task->correctAnswer) $returnVal = true;
        } else { // TODO: add regex pattern
            echo "unsupported evaluation type";
        }
        return $returnVal;
            
    }


    public function processRequest($req){
        $req = $this->sanitizeRequestPayload($req);
        if(isset($req["current"]) && isset($this->taskArray[$req["current"]])){
            
            $currentTask = $this->taskArray[$req["current"]];
            
            $payload = $this->updatePayloadInReq($req);
            
            if($req["todo"] == "next"){
                if($currentTask->next != null){ // if next exists, send next
                    $nextId = $currentTask->next;
                    return json_encode($this->generateRespPayload($nextId, $payload));
                } else { // if not exist, 
                    return json_encode($this->generateRespPayload($currentTask->taskId, $payload));
                }
                            
            } else if($req["todo"] == "prev"){
                if($currentTask->prev != null){ // if next exits, send next
                    $prevId = $currentTask->prev;
                    return json_encode($this->generateRespPayload($prevId, $payload));
                } else { // if not exist, 
                    return json_encode($this->generateRespPayload($currentTask->taskId, $payload));
                }

            } else if($req["todo"] == "init"){
                return json_encode($this->generateRespPayload($currentTask->taskId, $payload));

            } else if($req["todo"] == "eval"){
                return json_encode($this->generateRespPayload($currentTask->taskId, $payload));

            } 
        }
    }
}

?>