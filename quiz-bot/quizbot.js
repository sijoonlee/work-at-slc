import MessageMachine from './quizMachine.js';
import machineScheme from './quizMachineScheme.js';
import MachineController from './quizController.js';
import ViewGenerator from './quizView.js';

const $quizbotRoot = document.getElementById("quiz_bot");
const botName = $quizbotRoot.getAttribute("data-bot-name");
const userName = $quizbotRoot.getAttribute("data-user-name");

const v = new ViewGenerator();
// const v = (p) => console.log(p.text, p.options , p.wrongToHints, p.disabledOptions , p.numRetries, p) 
v.installBot($quizbotRoot);
const m = new MessageMachine(machineScheme, botName, userName);
const c = new MachineController(m, v);
c.requestMessage();





