import WebSocket from 'ws';
import { BasketballGame } from './games/basketball';

const server = new WebSocket.Server({ port: 8081 });

let admin: WebSocket = null;
const players: WebSocket[] = [];
let answer: WebSocket = null;

server.on('connection', function connection(conn) {
    conn.on('message', function incoming(message) {
        console.log('received: %s', message);
        const json = JSON.parse(message as string);
        if (json.event === 'register') {
            if (json.data === 'admin') {
                admin = conn;
                console.log('Admin joined');
            }
            else if (json.data === 'player') {
                players.push(conn);
                console.log('Player joined');
            }
            else if (json.data === 'answer') {
                answer = conn;
                console.log('Answer joined');
            }
        }
        else if (json.event === 'game_request') {
            if (json.data === 'basketball') {
                console.log('Sending basketball trivia game');
                conn.send(JSON.stringify({
                    event: 'game_response',
                    data: BasketballGame
                }));
            }
        }
    });
    conn.on('close', function closing(code: number, reason: string) {
        const i = players.indexOf(conn);
        if (i !== -1) {
            players.splice(i, 1);
            console.log('Player left');
        }
    });
});
