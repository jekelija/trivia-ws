import '../css/global';
import '../css/admin';
import { URL } from './constants';

const socket = new WebSocket(URL);

socket.onopen = (event)=> {
    socket.send(JSON.stringify({
        'event' : 'register',
        'data' : 'admin'
    })); 
};

let lastQuestionData:{groupIndex:number, questionIndex:number} = null;
let lastGameName:string = null;
let lastRound: number = 1;

socket.onmessage = event=> {
    const json = JSON.parse(event.data);
    if(json.event == 'question_asked') {
        document.getElementById('question-answer').innerHTML = json.data;
        document.getElementById('player-answer').classList.add('hidden');
        lastQuestionData = json.question;
        lastGameName = json.game;
    }
    else if(json.event == 'first_answer') {
        document.getElementById('player-answer').classList.remove('hidden');
        document.getElementById('player-answer-name').innerHTML = json.data;
    }
};

document.getElementById('player-answer-correct').addEventListener('click', e=> {
    (document.getElementById('player-answer-correct-sound') as HTMLAudioElement).play();
    socket.send(JSON.stringify({
        'event' : 'player_correct',
        'data' : document.getElementById('player-answer-name').innerHTML,
        'question' : lastQuestionData,
        'game' : lastGameName,
        'round' : lastRound
    })); 
});

document.getElementById('player-answer-incorrect').addEventListener('click', e=> {
    socket.send(JSON.stringify({
        'event' : 'player_incorrect',
        'data' : document.getElementById('player-answer-name').innerHTML
    }));
});

document.getElementById('play-no-sound').addEventListener('click', e=> {
    (document.getElementById('player-answer-incorrect-sound') as HTMLAudioElement).play();
});
document.getElementById('play-times-up').addEventListener('click', e=> {
    (document.getElementById('times-up-sound') as HTMLAudioElement).play();
});


document.getElementById('reset-buttons').addEventListener('click', e=> {
    socket.send(JSON.stringify({
        'event' : 'reset_buttons'
    }));
});

document.getElementById('test-question').addEventListener('click', e=> {
    socket.send(JSON.stringify({
        'event' : 'test_question'
    }));
});

document.getElementById('next-round').addEventListener('click', e=> {
    lastRound = parseInt((document.getElementById('round-input') as HTMLInputElement).value);
    socket.send(JSON.stringify({
        'event' : 'next_round',
        'data' : lastRound
    }));
});

document.getElementById('set-score').addEventListener('click', e=> {
    socket.send(JSON.stringify({
        'event' : 'set_score',
        'data' : (document.getElementById('set-score-name') as HTMLInputElement).value,
        'amount' : parseInt((document.getElementById('set-score-amount') as HTMLInputElement).value)
    }));
});