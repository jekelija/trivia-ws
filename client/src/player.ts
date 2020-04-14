import '../css/global';
import '../css/player';
import { URL } from './constants';
import { PlayerGameController } from './playerGameController';

const socket = new WebSocket(URL);
const controller = new PlayerGameController(socket);

window.addEventListener('beforeunload', (e)=> {
    // Cancel the event
    e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
    // Chrome requires returnValue to be set
    e.returnValue = "Don't leave yet";
    return "Don't leave yet";
});

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

async function registerPlayer():Promise<void> {
    await onOpenPromise;
    if(controller.registerPlayer((document.getElementById('nameInput') as HTMLInputElement).value)) {
        controller.createButton();
    }
}

document.addEventListener('keyup', e=> {
    if(e.key.toLowerCase() == 'enter') {
        registerPlayer();
    }
});

document.getElementById('nameInputSubmit').addEventListener('click', e=> {
    registerPlayer();
});

