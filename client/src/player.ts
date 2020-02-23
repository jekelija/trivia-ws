import '../css/global';
import '../css/player';
import { URL } from './constants';
import { PlayerGameController } from './playerGameController';

const socket = new WebSocket(URL);
const controller = new PlayerGameController(socket);

const onOpenPromise = new Promise((resolve, reject)=> {
    socket.onopen = (event)=> {
        resolve();
    };
});

socket.onmessage = event=> {
    const json = JSON.parse(event.data);
    if(json.event == 'allow_answers') {
        controller.allowButtonPress();
    }
    else if(json.event == 'disallow_answers') {
        controller.disallowButtonPress();
    }
    else if(json.event == 'first_answer') {
        controller.buttonAnswerAccepted();
    }
};

document.addEventListener('keyup', e=> {
    if(e.key.toLowerCase() == 'enter') {
        if(controller.registerPlayer((document.getElementById('nameInput') as HTMLInputElement).value)) {
            controller.createButton();
        }
    }
});

document.getElementById('nameInputSubmit').addEventListener('click', e=> {
    if(controller.registerPlayer((document.getElementById('nameInput') as HTMLInputElement).value)) {
        controller.createButton();
    }
});

