import WebSocket from 'ws';

export interface Player {
    socket: WebSocket;
    name: string;
    score: number;
    canAnswer: boolean;
}
