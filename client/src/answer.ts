import '../css/global';
import '../css/answer';
import { URL } from './constants';

const socket = new WebSocket(URL);

socket.onopen = (event)=> {
    socket.send(JSON.stringify({
        'event' : 'register',
        'data' : 'answer'
    })); 
};

let lastQuestionData:{groupIndex:number, questionIndex:number} = null;
let lastGameName:string = null;
let currentRound = 0;

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
    else if(json.event == 'game_response') {
        currentRound = 1;
    }
};

document.getElementById('player-answer-correct').addEventListener('click', e=> {
    socket.send(JSON.stringify({
        'event' : 'player_correct',
        'data' : document.getElementById('player-answer-name').innerHTML,
        'question' : lastQuestionData,
        'game' : lastGameName,
        'round' : currentRound
    })); 
});

document.getElementById('player-answer-incorrect').addEventListener('click', e=> {
    socket.send(JSON.stringify({
        'event' : 'player_incorrect',
        'data' : document.getElementById('player-answer-name').innerHTML
    }));
});

document.getElementById('next-round').addEventListener('click', e=> {
    socket.send(JSON.stringify({
        'event' : 'next_round',
        'data' : currentRound+1
    }));
});