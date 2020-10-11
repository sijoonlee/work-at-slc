import PayloadFromMachine from './quizPayload.js';

class OneWayMessage {
    /**
     * @param {String} type
     *      the type of message [simple, important]
     * @param {String} text:String
     *      the text message to show
     */
    constructor(type, text){
        this.type = type;
        this.text = text;
        try {
            if(this.type == null || this.text == null)
                throw new Error("message's type/text can't be null");
            if(this.type.length == 0 || this.text.length == 0)
                throw new Error("message's name/type/text can't be blank");
            if(this.type != "simple" && this.type != "important" && this.type != "link")
                throw new Error("OneWayMessage support simple/important/link type - you provided: " + this.type);
        } catch(err) {
            console.error(err.message);
        }
    }
}



class Choices {
    /**
     * @param {Object} options
     *      possible choices
     * @param {Object} scores
     *      scores for each choice
     * @param {Object} hints
     *      hints for each choice
     * 
     * the length of each Object should be same
     * the key of each Object should be matched
     * Example
     * "options":{
     *      "1":"St Lawrence College",
     *      "2":"Soup Liquid Collector",
     *      "3":"Super Large Computer"
     *  }
     *  "scores":{
     *      "1": 10,
     *      "2": 0,
     *      "3": 0
     *  }
     *  "hints":{
     *      "1":"Good work!",
     *      "2":"Are you sure?",
     *      "3":null // if no hint for a choice, use null
     *  }
     */
    constructor(options, scores, hints){
        this.options = options;
        this.scores = scores;
        this.hints = hints;
        try {
            if (options == null || scores == null || hints == null){
                throw new Error("Options/Scores/Hints can't be null");
            }
                
            if ( Object.keys(this.options).length == 0 || 
                Object.keys(this.scores).length == 0 ||
                Object.keys(this.hints).length == 0){
                throw new Error("Options/Scores/Hints needs data");
            }
        
            if ( Object.keys(this.options).length != Object.keys(this.scores).length || 
                Object.keys(this.options).length != Object.keys(this.hints).length || 
                Object.keys(this.hints).length != Object.keys(this.scores).length){
                throw new Error("Options/Scores/Hints should have the same number of data");
            }
        } catch(err) {
            console.error(err.message);
        }
        
    }
}

class MulitpleChoiceQuestion {
    /**
     * @param {String} type
     *      the type of muliple choice [radio, checkbox]
     * @param {String} text
     *      the text message to show
     * @param {Object} options
     *      "options":{
     *          "1":"St Lawrence College",
     *          "2":"Soup Liquid Collector",
     *          "3":"Super Large Computer"
     *      }
     * @param {Object} scores
     *      "scores":{
     *          "1": 10,
     *          "2": 0,
     *          "3": 0
     *      }
     * @param {Object} hints
     *      "hints":{
     *          "1":"Good work!",
     *          "2":"Are you sure?",
     *          "3":null // if no hint for a choice, use null
     *      }
     */
    constructor(type, text, options, scores, hints){
        this.type = type;
        this.text = text;
        this.choices = ( options==null || scores==null || hints==null ) ? null : new Choices(options, scores, hints);
        try {
            if(this.type == null || this.text == null || this.choices == null)
                throw new Error("message's type/text can't be null");
            if(this.type.length == 0 || this.text.length == 0)
                throw new Error("message's name/type/text can't be blank");
            if(this.type != "radio" && this.type != "checkbox")
                throw new Error("Multiple choice supports radio/checkbox - you provided: " + this.type)
        } catch(err) {
            console.error(err.message);
        }
    }
}

class Policy{
    /**
     * @param {Object} policy
     * {
     *      "maxRetries" : 2,
     *      "retryWithReducedOptions" : true,
     *      "retryWithHint" : true,
     *      "correctAbove" : 10
     * }    
     * 
     * 
     * @member {integer} maxRetries
     *      the maximum number of retries, -1 for unlimited tries
     * @member {boolean} retryWithReducedOptions
     *      true if you want to omit already tried wrong answer
     * @member {boolean} retryWithHint
     *      true if you want to give hint when retry
     * @member {integer} correctAbove
     *      the minimum score to pass the question
     */
    constructor(policy){
        this.maxRetries = policy.maxRetries;
        this.retryWithReducedOptions = policy.retryWithReducedOptions;
        this.retryWithHint = policy.retryWithHint;
        this.correctAbove = policy.correctAbove;
        try {
            if(this.maxRetries == null || this.retryWithReducedOptions == null || 
                this.retryWithHint == null || this.correctAbove == null){
                    console.log(this.maxRetries, this.retryWithReducedOptions, this.retryWithHint, this.correctAbove)
                    throw new Error("Policy's fields can't be null");
                }
                
            if(this.maxRetries < -1)
                throw new Error("maxRetries can't be less than -1");
        } catch(err) {
            console.error(err.message);
        }
    }
}

class Done{
    /**
     * 
     * @param {Object} done
     *      {
     *          "next": "the name of next message",
     *          "correct": "the next message when quiz solved correctly"
     *          "incorrect": "the next message when quiz solved incorrectly"
     *      }
     * 
     * @member {String} next
     *      the name of next message, can be null. 'terminal' to finish
     * @member {String} correct
     *      the name of message if correct answer, required when next is null
     * @member {String} incorrect
     *      the name of message if incorrect answer, required when next is null
     */
    constructor(done){
        this.next = done.next != null ? done.next : null;
        this.correct = done.correct != null ? done.correct : null;
        this.incorrect= done.incorrect != null ? done.incorrect : null;
        try {
            if(this.next == null && (this.correct == null || this.incorrect == null))
                throw new Error("if next is null, correct/incorrect should be set");
            if(this.next && this.next.length > 0 && (this.correct != null || this.incorrect != null))
                throw new Error("if next is set, correct/incorrect should be null");
        } catch(err) {
            console.error(err.message);
        }
        
    }
}

class MessageTask{
    /**
     * @param {String} type
     *      type of message [one-way-message, multiple-choice]
     * @param {Object} on
     *      On object that contains type and text
     * @param {Done} done
     *      Done object
     * @param {Policy} policy
     *      Policy object
     *
     * @member {OneWayMessage||MulitpleChoiceQuestion} message 
     *      Object either [OneWayMessage, MulitpleChoiceQuestion]
     * @member {Done} done
     *      Done Object
     * @member {Policy} policy
     *      Policy Policy - this could be null
     */
    constructor(type, on, done, policy=null){
        this.message = null;
        if(type == "one-way-message"){
            this.message = new OneWayMessage(on.type, on.text);
        } else if(type == "multiple-choice"){
            this.message = new MulitpleChoiceQuestion(on.type, on.text, on.options, on.scores, on.hints);
        }
        this.done = new Done(done);
        if(policy!=null){
            this.policy = new Policy(policy);
        } else {
            this.policy = null;   
        }       
    }
}

class MessageMachine {
    /**
     * @param {Object} machine
     *      input Json object that contains all information
     * 
     * @member {String} initial
     *      the name of message that a user starts with
     * @member {Object<MessageTask>} states
     *      Collection of MessageTask objects
     */

    constructor(machine){

        this.payloadGen = PayloadFromMachine.payloadGen;

        try {
            if(machine.initial == null || machine.initial.length == 0){
                throw new Error("Error: inital");
            }
            if(machine.states == null || Object.keys(machine.states).length == 0){
                throw new Error("Error: state");
            }
        } catch(err) {
            console.error(err.message);
        }
        
        this.initial = machine.initial;
        this.states = {};
        Object.keys(machine.states).forEach( name => {
            try {
                if(machine.states[name].type != "one-way-message" && machine.states[name].type != "multiple-choice")
                    throw new Error("Unsupported type: " + machine.states[name].type);
                if(machine.states[name].on == null)
                    throw new Error("There is no 'on' inside " + name);
            } catch(err) {
                console.error(err.message);
            }
            
            this.states[name] = new MessageTask(machine.states[name].type, machine.states[name].on, machine.states[name].done, machine.states[name].policy );
        });   
    }


    objFilter = (obj, predicate) => {
        return Object.keys(obj)
        .filter( key => predicate(key) ) //predicate(obj[key]) to use value
        .reduce( (res, key) => { res[key] = obj[key]; return res; }, {} )
    };


    runOneWayMsg = (msgName, task, type, scoresCollector) => {
        return this.payloadGen(msgName, type, task.message.type, task.message.text, task.done.next, scoresCollector);
    }

    /**
     * @param {MessageTask} task 
     * 
     * @param {Array<String>} answers 
     *      array of answer keys
     * @param {Integer} maxRetries 
     */
    runMultiChoice = (msgName, task, type, answers, scoresCollector, disabledOptions, numRetries) => {

        let needToReset = false;
        console.log("ans", answers)
        let next;
        let isCorrect;
        let score = answers
            .filter(key => Object.keys(task.message.choices.options).includes(key) && 
                            Object.keys(task.message.choices.scores).includes(key))
            .map(key => task.message.choices.scores[key])
            .reduce( (total,score) => {return total+score}, 0)
      
        scoresCollector[msgName] = score;

        let wrong = answers
            .filter(key => Object.keys(task.message.choices.options).includes(key) && 
                            task.message.choices.scores[key] <= 0 )

        let wrongToHints = null;
        if(task.policy.retryWithHint){
            wrongToHints = wrong.reduce( (acc, key) => {
                acc[key] = task.message.choices.hints[key];
                return acc;
            }, {} ); // {} for initial object of acc
        }

        if(task.policy.retryWithReducedOptions){
            disabledOptions = { ...disabledOptions, ...this.objFilter(task.message.choices.options, (x) => wrong.includes(x)) }
        }
        // if(needToReset) { needToReset = false; numRetries = 0; disabledOptions = {}; }
        
        if(score >= task.policy.correctAbove) { // pass, compelete question
            next = task.done.next ? task.done.next : task.done.correct;    
            needToReset = true;
            isCorrect = true;
        } else { //fail, retry?
            isCorrect = false;
            console.log("fail")
            console.log("reset?", needToReset)
            if(task.policy.maxRetries == -1){ // unlimited retry
                next = msgName;
                console.log("unlimited retry")
            } else if ( numRetries < task.policy.maxRetries ){ // numRetries is 0-based
                next = msgName;
                console.log("still have a chance")
            } else if ( numRetries == task.policy.maxRetries) { // fail to pass, compelete question 
                needToReset = true;
                next = task.done.next ? task.done.next : task.done.incorrect;
                console.log("chances done")
            } else { // should not happen this
                console.error("something went wrong");
                next = null; // will make an error
            }
        }
        numRetries += 1;

        console.log("numRetries",numRetries)
        console.log("next", next)

        if(needToReset) {
            let nextTask = this.states[next];

            if(nextTask.message instanceof OneWayMessage) {
                return this.runOneWayMsg(next, nextTask, "one-way-message", scoresCollector);
            } else if(task.message instanceof MulitpleChoiceQuestion) {
                return this.runMultiChoice(next, nextTask, "multiple-choice", [], scoresCollector, 0, {});
            }
        }

        return this.payloadGen(msgName, type, task.message.type, task.message.text, 
            next, scoresCollector, task.message.choices.options, disabledOptions, isCorrect, wrongToHints, numRetries);
    }


    /**
     * 
     * @param {String} name 
     * @param {String} type 
     * @param {String} subtype 
     * @param {String} message 
     * @param {Object} options
     *      "options":{
     *          "1":"St Lawrence College",
     *          "2":"Soup Liquid Collector",
     *          "3":"Super Large Computer"
     *      } 
     * @param {Boolean} isCorrect 
     * @param {Integer} score 
     * @param {Integer} totalScore 
     * @param {Object} wrongToHints 
     *      {"2" : "This is some hint" }
     * @param {Integer} numRetires 
     * @param {String} next 
     *      the name of the next message
     */


    run = (msgName, answers = [], scoresCollector = {}, numRetries = 0, disabledOptions = {}) => {
        let task = this.states[msgName];
        if(task.message instanceof OneWayMessage) {
            return this.runOneWayMsg(msgName, task, "one-way-message", scoresCollector);
        } else if(task.message instanceof MulitpleChoiceQuestion) {
            return this.runMultiChoice(msgName, task, "multiple-choice", answers, scoresCollector, numRetries, disabledOptions);
        }
        
    }
    start = (answers= []) => {
        return this.run(this.initial, answers)
    }

}

export default MessageMachine;