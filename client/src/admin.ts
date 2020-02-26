import '../css/global';
import '../css/admin';
import { URL, GAME_TYPE } from './constants';
import {findAncestor} from './utils';
import { AdminGameController } from './adminGameController';

const socket = new WebSocket(URL);
const gameController = new AdminGameController();

socket.onopen = (event)=> {
    socket.send(JSON.stringify({
        'event' : 'register',
        'data' : 'admin'
    })); 
    socket.send(JSON.stringify({
        'event' : 'game_request',
        'data' : GAME_TYPE
    })); 
};
socket.onmessage = event=> {
    const json = JSON.parse(event.data);
    if(json.event == 'game_response') {
        const game = json.data;
        gameController.setGame(game);
    }
    else if(json.event == 'player_joined') {
        gameController.addPlayer(json.playerName);
    }
    else if(json.event == 'player_left') {
        gameController.removePlayer(json.playerName);
    }
    else if(json.event == 'first_answer') {
        gameController.playerAnswered(json.data);
    }
    else if(json.event == 'refresh_scores') {
        gameController.hideZoom();
        gameController.refreshScores(json.data);
    }
    else if(json.event == 'next_round') {
        gameController.setRound(json.data);
    }

    
};

document.getElementById('grid').addEventListener('click', e=> {
    const cost = findAncestor(e.target as HTMLElement, 'cost');
    if(cost) {
        const squareInfo = gameController.flipSquare(cost);
        socket.send(JSON.stringify({
            'event' : 'question_asked',
            'data' : squareInfo,
            'game' : GAME_TYPE,
            'round' : gameController.getRound()
        })); 
    }
});