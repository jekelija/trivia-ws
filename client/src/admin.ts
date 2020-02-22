import '../css/global';
import '../css/admin';
import { URL } from './constants';

const socket = new WebSocket(URL);
socket.onopen = (event)=> {
    socket.send(JSON.stringify({
        'event' : 'register',
        'data' : 'admin'
    })); 
    socket.send(JSON.stringify({
        'event' : 'game_request',
        'data' : 'basketball'
    })); 
};
socket.onmessage = event=> {
    const json = JSON.parse(event.data);
    if(json.event == 'game_response') {
        const game = json.data;
        const parent = document.getElementById('grid');
        for(let group of game.groups) {
            const column = document.createElement('div');
            column.classList.add('column', 'flex', 'flex-column');

            const header = document.createElement('div');
            header.classList.add('square', 'header');
            header.innerHTML = group.title;
            column.appendChild(header);

            for(let q of group.questions) {
                const square = document.createElement('div');
                square.classList.add('square');

                const cost = document.createElement('div');
                cost.classList.add('cost');
                cost.innerHTML = q.value.toString();

                const question = document.createElement('div');
                question.classList.add('question', 'hidden');
                question.innerHTML = q.question;

                square.appendChild(cost);
                square.appendChild(question);
                column.appendChild(square);
            }

            parent.appendChild(column);
        }
    }
};

