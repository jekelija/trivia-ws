import WebSocket from 'ws';
import { BasketballGame } from './games/basketball';
import { Game } from './model/game';
import { Player } from './model/player';

const server = new WebSocket.Server({ port: 8081 });

let admin: WebSocket = null;
const players: Player[] = [];
let answer: WebSocket = null;

let firstPlayer: Player = null;

function printPlayers(): void {
    console.log('Players: ' + players.map((x) => x.name).join(', '));
}

function getGame(gameType: string): Game {
    if (gameType === 'basketball') {
        return BasketballGame;
    }
    return null;
}

server.on('connection', function connection(conn) {
    conn.on('message', function incoming(message) {
        console.log('received: %s', message);
        const json = JSON.parse(message as string);
        if (json.event === 'register') {
            if (json.data === 'admin') {
                admin = conn;
                console.log('Admin joined');
                for (const p of players) {
                    admin.send(JSON.stringify({
                        event: 'player_joined',
                        playerName: p.name
                    }));
                }
            }
            else if (json.data === 'player') {
                console.log('Player ' + json.playerName + ' joined');
                players.push({
                    socket: conn,
                    score: 0,
                    name: json.playerName
                });
                if (admin) {
                    admin.send(JSON.stringify({
                        event: 'player_joined',
                        playerName: json.playerName
                    }));
                }
                printPlayers();
            }
            else if (json.data === 'answer') {
                answer = conn;
                console.log('Answer joined');
            }
        }
        else if (json.event === 'game_request') {
            const game = getGame(json.data);
            if (game) {
                conn.send(JSON.stringify({
                    event: 'game_response',
                    data: game
                }));
            }
        }
        else if (json.event === 'question_asked') {
            firstPlayer = null;
            const data = {
                event: 'allow_answers'
            };
            for (const p of players) {
                p.socket.send(JSON.stringify(data));
            }
        }
        else if (json.event === 'answer') {
            if (!firstPlayer) {
                const playerName = json.data;
                const player = players.find((x) => x.name === playerName);
                if (player) {
                    firstPlayer = player;
                    const data = {
                        event: 'disallow_answers'
                    };
                    for (const p of players) {
                        if (p !== firstPlayer) {
                            p.socket.send(JSON.stringify(data));
                        }
                        else {
                            p.socket.send(JSON.stringify({
                                event: 'first_answer'
                            }));
                        }
                    }
                    admin.send(JSON.stringify({
                        event: 'first_answer',
                        data: firstPlayer.name
                    }));
                }
            }
        }

    });
    conn.on('close', function closing(code: number, reason: string) {
        const i = players.findIndex((x) => x.socket === conn);
        if (i !== -1) {
            const p = players[i];
            players.splice(i, 1);
            console.log('Player ' + p.name + ' left');
            printPlayers();
            if (admin) {
                admin.send(JSON.stringify({
                    event: 'player_left',
                    playerName: p.name
                }));
            }
        }
    });
});
