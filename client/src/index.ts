import '../css/global';
import { URL } from './constants';

const socket = new WebSocket(URL);
socket.onopen = (event)=> {
    socket.send(JSON.stringify({
        'event' : 'register',
        'data' : 'player'
    })); 
};