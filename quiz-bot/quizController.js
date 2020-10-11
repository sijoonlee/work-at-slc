import PayloadFromMachine from './quizPayload.js';

class MachineController {
    constructor (machine, viewGenerator){
        this.current = 'initial';
        this.scoresCollector = {};
        this.disabledOptions = {};
        this.numRetries = 0;
        this.payloadFromMachine = null;
        this.machine = machine;
        this.viewGenerator = viewGenerator;
        this.viewGenerator.registerTrigger(this.requestMessage);
    }

    updateState = () => {
        //console.log(this.payloadFromMachine);
        this.current = this.payloadFromMachine.next;
        this.scoresCollector = this.payloadFromMachine.scoresCollector != null ? this.payloadFromMachine.scoresCollector : {} ;
        this.numRetries = this.payloadFromMachine.numRetries != null ? this.payloadFromMachine.numRetries : 0;
        this.disabledOptions = this.payloadFromMachine.disabledOptions != null ? this.payloadFromMachine.disabledOptions : {} ;
    }

    requestMessage = (answers=[]) => {
        console.log(this.current)
        if(this.current == 'initial') {
            this.payloadFromMachine = new PayloadFromMachine(this.machine.start(answers))
            this.updateState();
            this.generateView();
        } else if(this.current == "terminal"){
            // this.reset()
            // this.showScores();
        } else {
            this.payloadFromMachine = new PayloadFromMachine(
                this.machine.run(this.current, answers, this.scoresCollector, 
                this.disabledOptions, this.numRetries));
            this.updateState();
            this.generateView();
        }
    }

    showScores = () => {
        console.log(this.scoresCollector)
    }
    doNothing = () => {
        console.log("do nothing")
    }
    reset = () =>{
        this.current = 'initial';
        this.payloadFromMachine = null;
        this.scoresCollector = {};
        this.numRetries = 0;
        this.disabledOptions = {};
        this.generateView();
    }
     
    generateView = () => {
        console.log(this.payloadFromMachine)
        return this.viewGenerator.create(this.payloadFromMachine);
    }
}

export default MachineController;
