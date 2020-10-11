class PayloadFromMachine{            
    constructor(payload){
        try {
            this.msgName = payload.msgName;
            this.type = payload.type;
            this.subtype = payload.subtype;
            this.text= payload.text;
            this.next = payload.next;
            this.options = payload.options;
            this.disabledOptions = payload.disabledOptions;
            this.isCorrect = payload.isCorrect;
            this.wrongToHints = payload.wrongToHints;
            this.scoresCollector = payload.scoresCollector;
            this.numRetries = payload.numRetries;
        } catch (err) {
            console.error(err.message)
        }
        
    }

    static payloadGen = (msgName, type, subtype, text, next, scoresCollector, 
                        options=null, disabledOptions=null, isCorrect=null, wrongToHints=null, numRetries=null) => {
        try {
            if(msgName == null) throw new Error("PayloadGen: name can't be null");
            if(type == null) throw new Error("PayloadGen: type can't be null");
            if(subtype == null) throw new Error("PayloadGen: subtype can't be null");
            if(text == null) throw new Error("PayloadGen: text can't be null");
            if(next == null) throw new Error("PayloadGen: next can't be null");
        } catch(err) {
            console.error(err.message)
            console.error(msgName, type, subtype, text, next, scoresCollector, 
                options, disabledOptions, isCorrect, wrongToHints, numRetries)
        }
        
        const payload = {
            msgName, type, subtype, text, next, scoresCollector, 
            options, disabledOptions, isCorrect, wrongToHints, numRetries
        }
        return payload;
    }
}

export default PayloadFromMachine;