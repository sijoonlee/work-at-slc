import PayloadFromMachine from './quizPayload.js';



const CLS_QUIZ_BOT_INNER_BOX                = "quiz_bot_inner_box";
const CLS_QUIZ_BOT_BOT_MESSAGE_OUTER_BOX        = "quiz_bot_bot_message_outer_box";
const CLS_QUIZ_BOT_BOT_MESSAGE_INNER_BOX        = "quiz_bot_bot_message_inner_box";
const CLS_QUIZ_BOT_BOT_MESSAGE                  = "quiz_bot_bot_message";
const CLS_QUIZ_BOT_USER_MESSAGE_OUTER_BOX   = "quiz_bot_user_message_outer_box";
const CLS_QUIZ_BOT_USER_MESSAGE_INNER_BOX   = "quiz_bot_user_message_inner_box";
const CLS_QUIZ_BOT_USER_MESSAGE             = "quiz_bot_user_message";
const CLS_QUIZ_BOT_HINT_OUTER_BOX           = "quiz_bot_hint_outer_box";
const CLS_QUIZ_BOT_HINT_INNER_BOX           = "quiz_bot_hint_inner_box";
const CLS_QUIZ_BOT_HINT                     = "quiz_bot_hint";
const CLS_QUIZ_BOT_BUTTON_OUTER_BOX    = "quiz_bot_button_outer_box";
const CLS_QUIZ_BOT_BUTTON_INNER_BOX    = "quiz_bot_button_inner_box";
const CLS_QUIZ_BOT_BUTTON              = "quiz_bot_button";
const CLS_QUIZ_BOT_BOT_NAME_OUTER_BOX = "quiz_bot_bot_name_outer_box";
const CLS_QUIZ_BOT_BOT_NAME_INNER_BOX = "quiz_bot_bot_name_inner_box";
const CLS_QUIZ_BOT_BOT_NAME = "quiz_bot_bot_name";
const CLS_QUIZ_BOT_USER_NAME_OUTER_BOX = "quiz_bot_user_name_outer_box";
const CLS_QUIZ_BOT_USER_NAME_INNER_BOX = "quiz_bot_user_name_inner_box";
const CLS_QUIZ_BOT_USER_NAME = "quiz_bot_user_name";


class ViewGenerator{

    constructor(){
        this.$root = null;
        this.payload = null;
        this.trigger = null;
    }

    registerTrigger = (trigger) => {
        this.trigger = trigger;

    }
    createElm = (className) => {
        const $dom = document.createElement("div");
        $dom.setAttribute("class", className);
        return $dom
    }


    bindButtonWithOptions = ($btn, name = null) => {
        if(name != null ){
            $btn.onclick = () => {
                const rbs = document.querySelectorAll(`input[name="${name}"]`);
                let selectedValue = [];
                for (const rb of rbs) {
                    if (rb.checked) {
                        selectedValue.push(rb.value);
                    }       
                }
                if(Array.isArray(selectedValue) && selectedValue.length > 0){
                    for (const rb of rbs) {
                        rb.disabled = true;
                    }
                    this.trigger(selectedValue);
                } else {
                    console.log("do nothing")
                }
            }
        }
        
    }
    
    bindButtonWithLink = ($btn, link) => {
        $btn.onclick = (e) => {
            e.preventDefault();
            window.location = link; 
        }
    }

    bindButton = ($btn) => {
        $btn.onclick = () => {
            this.trigger();
        }
    }

    createButton = (content) => {
        const $msg = document.createElement("button");
        $msg.setAttribute("class", CLS_QUIZ_BOT_BUTTON);
        $msg.innerHTML = content;
        const $inner = this.createElm(CLS_QUIZ_BOT_BUTTON_INNER_BOX);
        const $outer = this.createElm(CLS_QUIZ_BOT_BUTTON_OUTER_BOX);
        $inner.appendChild($msg);
        $outer.appendChild($inner);
        return $outer
    }

    deleteAllButtons = () => {
        const $btns = document.getElementsByClassName(CLS_QUIZ_BOT_BUTTON_OUTER_BOX);
        for(let $btn of $btns){
            $btn.remove();
        }
    }

    createUserNameBox = (userName) => {
        const $name = this.createElm(CLS_QUIZ_BOT_BOT_NAME);
        $name.innerHTML = userName;
        const $inner = this.createElm(CLS_QUIZ_BOT_BOT_NAME_INNER_BOX);
        //const $outer = this.createElm(CLS_QUIZ_BOT_BOT_NAME_OUTER_BOX);
        $inner.appendChild($name);
        //$outer.appendChild($inner);        
        return $inner;
    }

    createBotNameBox = (botName) => {
        const $name = this.createElm(CLS_QUIZ_BOT_BOT_NAME);
        $name.innerHTML = botName;
        const $inner = this.createElm(CLS_QUIZ_BOT_BOT_NAME_INNER_BOX);
        //const $outer = this.createElm(CLS_QUIZ_BOT_BOT_NAME_OUTER_BOX);
        $inner.appendChild($name);
        //$outer.appendChild($inner);
        return $inner;

    }

    createInnerBox = () => {
        return this.createElm(CLS_QUIZ_BOT_INNER_BOX);
    }

    createBotMessage = (msgName, type, subtype, content, botName, putbuttonHere) => {
        const $msg = this.createElm(CLS_QUIZ_BOT_BOT_MESSAGE);
        $msg.setAttribute("id", msgName);
        
        if(type == "one-way-message" && subtype == "link"){
            $msg.innerHTML = this.findMatchMessage(content);    
        } else {
            $msg.innerHTML = content;
        }
        
        const $inner = this.createElm(CLS_QUIZ_BOT_BOT_MESSAGE_INNER_BOX);
        const $outer = this.createElm(CLS_QUIZ_BOT_BOT_MESSAGE_OUTER_BOX);
        const $nameBox = this.createBotNameBox(botName);
        $inner.appendChild($msg);
        $inner.appendChild($nameBox);
        $outer.appendChild($inner);

        if(putbuttonHere){
            const $btn = this.createButton("Next");
            this.bindButton($btn);
            $outer.appendChild($btn);
        }
        this.$root.appendChild($outer);
    }
 
    createOptions = ($box, name, subtype, options, disabledOptions) => {
        let type;
        if(subtype == "radio") type = "radio";
        else if (subtype == "checkbox") type = "checkbox";
        else console.error("error in createOptions - unsupported type:", subtype);

        for(let key in options){
            let $option = document.createElement("input");
            let id = name + "@" + key;
            $option.setAttribute("type", type);
            $option.setAttribute("value", key);
            $option.setAttribute("id", id);
            $option.setAttribute("name", name);
            if( key in disabledOptions){
                $option.disabled = true;
            }
            $option.innerHTML = options[key];
            let $wrapper = document.createElement("div");
            $wrapper.appendChild($option)
            let $label = document.createElement("label")
            $label.setAttribute("for", id);
            $label.innerHTML = options[key];
            $wrapper.appendChild($label)
            $box.appendChild($wrapper);
        }
    }
    
    createUserMessage = (msgName, type, subtype, options, disabledOptions, numRetries, userName, putbuttonHere) => {
        let $msg = this.createElm(CLS_QUIZ_BOT_USER_MESSAGE);
        if(type == "multiple-choice") {
            this.createOptions($msg, msgName + numRetries, subtype, options, disabledOptions);
        }
        const $inner = this.createElm(CLS_QUIZ_BOT_USER_MESSAGE_INNER_BOX);
        const $outer = this.createElm(CLS_QUIZ_BOT_USER_MESSAGE_OUTER_BOX);
        const $nameBox = this.createUserNameBox(userName);
        $inner.appendChild($msg);
        $inner.appendChild($nameBox);
        $outer.appendChild($inner);
        if(putbuttonHere) {
            const $btn = this.createButton("Submit");
            this.bindButtonWithOptions($btn, msgName + numRetries);
            $outer.appendChild($btn);
        }
        this.$root.appendChild($outer);
    }


    //https://javascript.info/regexp-groups
    findMatchMessage = (text) => {
        const regex = /(?<msg>\[.+?\])(?<address>\(.+?\))/; // something like [Let's go to the next lesson](http://someaddress)
        const match = text.match(regex).groups;   
        return match.msg.substring(1,match.msg.length - 1)
    }
    findMatchAddress = (text) => {
        const regex = /(?<msg>\[.+?\])(?<address>\(.+?\))/; // something like [Let's go to the next lesson](http://someaddress)
        const match = text.match(regex).groups;
        return match.address.substring(1,match.address.length - 1)
    }
    createButtonOnlyUserMessage = (subtype, text) => {
        const $msg = document.createElement("button");
        $msg.setAttribute("class", CLS_QUIZ_BOT_BUTTON);
        if (subtype == "link") {
            $msg.innerHTML = "Next";
            this.bindButtonWithLink($msg, this.findMatchAddress(text));
        } else {
            $msg.innerHTML = "Next";
            this.bindButton($msg);
        }

        const $inner = this.createElm(CLS_QUIZ_BOT_BUTTON_INNER_BOX);
        const $outer = this.createElm(CLS_QUIZ_BOT_BUTTON_OUTER_BOX);
        const $wrapper = this.createElm(CLS_QUIZ_BOT_USER_MESSAGE_OUTER_BOX);
        $inner.appendChild($msg);
        $outer.appendChild($inner);
        $wrapper.appendChild($outer)
        this.$root.appendChild($wrapper);
    }

    createHint = (wrongToHints) => {
        console.log(wrongToHints)
        const $msg = this.createElm(CLS_QUIZ_BOT_HINT);
        let text = [];
        for(let key in wrongToHints){
            text.push(wrongToHints[key]);
        }
        console.log(text.join(' '));
        $msg.innerHTML = text.join(' ');
        const $inner = this.createElm(CLS_QUIZ_BOT_HINT_INNER_BOX);
        const $outer = this.createElm(CLS_QUIZ_BOT_HINT_OUTER_BOX);
        $inner.appendChild($msg);
        $outer.appendChild($inner);
        this.$root.appendChild($outer);
    }

    installBot = ($dom) => {
        $dom.appendChild(this.createInnerBox());
        this.$root = $dom.lastChild;
    }

    /**
     * 
     * @param {PayloadFromMachine} payload 
     */
    create = (payload) => {
        console.log(payload.botName)
        console.log(payload.userName)
        this.deleteAllButtons();
        if( payload.type == 'one-way-message' ){
            this.createBotMessage(payload.msgName, payload.type, payload.subtype, payload.text, payload.botName, false);
            this.createButtonOnlyUserMessage(payload.subtype, payload.text);
            // need to have 'click to next'
        } else if ( payload.type == 'multiple-choice' ) {
            if(payload.wrongToHints != null && Object.keys(payload.wrongToHints).length > 0 ){
                this.createHint(payload.wrongToHints);
            }
            this.createBotMessage(payload.msgName, payload.type, payload.subtype, payload.text, payload.botName, false);
            this.createUserMessage(payload.msgName, payload.type, payload.subtype, 
                payload.options, payload.disabledOptions, payload.numRetries, payload.userName, true, "Submit");
        }
    }
}

export default ViewGenerator;