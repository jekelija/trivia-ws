export class PlayerGameController {

    private button:HTMLDivElement = null;
    private playerName: string;

    constructor(private socket:WebSocket) {}

    registerPlayer(playerName:string): boolean {
        if(playerName) {
            this.playerName = playerName;
            this.socket.send(JSON.stringify({
                'event' : 'register',
                'data' : 'player',
                'playerName' : playerName
            })); 
            return true;
        }
        return false;
    }

    createButton(): void {
        document.getElementById('nameInputDiv').classList.add('hidden');
        this.button = document.createElement('div');
        this.button.classList.add('answer-button');
        this.button.addEventListener('click', e=> {
            if(this.button.classList.contains('allow-answer-button')) {
                this.socket.send(JSON.stringify({
                    'event' : 'answer',
                    'data' : this.playerName
                })); 
            }
            
        });
        document.getElementById('main').appendChild(this.button);
    }
    
    allowButtonPress(): void {
        this.button.classList.remove('answer-button-accepted');
        this.button.classList.add('allow-answer-button');
    }

    disallowButtonPress(): void {
        this.button.classList.remove('answer-button-accepted');
        this.button.classList.remove('allow-answer-button');
    }

    buttonAnswerAccepted(): void {
        this.button.classList.remove('allow-answer-button');
        this.button.classList.add('answer-button-accepted');
    }
}