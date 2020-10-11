const machineScheme = {    
    "initial": "hello",
    "states": {
        "hello": {
            "type":"one-way-message", // doesn't expect response from user
            "on" : {
                "type": "simple",
                "text": "Welcoome to Quizbot"
            },
            "done" :{
                "next": "question1"
            }
        },
        "question1": {
            "type":"multiple-choice", // expecting answer, after taking answer, will produce correct/incorrect
            "on" : {
                "text": "What does SLC stand for",
                "type": "radio",
                "options":{
                    "1":"St Lawrence College",
                    "2":"Soup Liquid Collector",
                    "3":"Super Large Computer"
                },
                "scores":{
                    "1": 10,
                    "2": 0,
                    "3": 0
                },
                "hints":{
                    "1":"Good work!",
                    "2":"Are you sure?",
                    "3":"No no no.."
                }
            },
            "policy":{
                "maxRetries": 2, // -1 : unlimited retries
                "retryWithReducedOptions": true,
                "retryWithHint": true,
                "correctAbove": 10
            },
            "done": {
                "next":null,
                "correct": "q1-correct",
                "incorrect": "q1-incorrect"
            }
        },
        "q1-correct" : {
            "type":"one-way-message", // expecting answer
            "on" : {
                "type": "simple",
                "text" : "Congratz!"
            },
            "done":{
                "type": "simple",
                "next" : "question2"
            }
        },
        "q1-incorrect" : {
            "type":"one-way-message",
            "on" : {
                "type": "simple",
                "text" : "Sorry"
            },
            "done":{
                "type": "simple",
                "next" : "question2"
            }
        },
        "question2": {
            "type":"multiple-choice",
            "on" : {
                "text": "1 + 1 = ?<br>(Choose All Answers)",
                "type": "checkbox",
                "options":{
                    "1":"1.99999...",
                    "2":"2",
                    "3":"3"
                },
                "scores":{
                    "1": 5,
                    "2": 5,
                    "3": -5
                },
                "hints":{
                    "1":"Good work!",
                    "2":"Good work!",
                    "3":"No no no.."
                }
            },
            "policy":{
                "correctAbove": 10,
                "maxRetries": 2,
                "retryWithHint": true,
                "retryWithReducedOptions": true
            },
            "done": {
                "next":null, // should be null to use correct/incorrect checkpoint
                "correct" : "q2-correct",
                "incorrect" : "q2-incorrect"
            }
        },
        "q2-correct" : {
            "type":"one-way-message", // expecting answer
            "on" : {
                "type": "simple",
                "text" : "Congratz!"
            },
            "done":{
                "type": "simple",
                "next" : "question3"
            }
        },
        "q2-incorrect" : {
            "type":"one-way-message",
            "on" : {
                "type": "simple",
                "text" : "Sorry"
            },
            "done":{
                "type": "simple",
                "next" : "question3"
            }
        },
        "question3": {
            "type":"multiple-choice", // expecting answer, after taking answer, will produce correct/incorrect
            "on" : {
                "text": "5 + 5 = ?",
                "type": "checkbox",
                "options":{
                    "1":"5",
                    "2":"10",
                    "3":"15",
                },
                "scores":{
                    "1": -5,
                    "2": 10,
                    "3": -5,
                },
                "hints":{
                    "1":"Good work!",
                    "2":"??",
                    "3":"really?"
                }
            },
            "policy":{
                "correctAbove": 10,
                "maxRetries": 2,
                "retryWithHint": true,
                "retryWithReducedOptions": true
            },
            "done": {
                "next":null,
                "correct":"q3-correct",
                "incorrect":"q3-incorrect"
            }
        },
        "q3-correct" : {
            "type":"one-way-message", // expecting answer
            "on" : {
                "type": "simple",
                "text" : "Congratz!"
            },
            "done":{
                "next" : "goodbye"
            }
        },
        "q3-incorrect" : {
            "type":"one-way-message",
            "on" : {
                "type": "simple",
                "text" : "Sorry"
            },
            "done":{
                "next" : "goodbye"
            }
        },
        "goodbye" : {
            "type":"one-way-message",
            "on" : {
                "type": "link",
                "text" : "[Let's proceed to the next step](http://abc.com)"
            },
            "done":{
                "next" : "terminal"
            }
        }
    }    
}

export default machineScheme;