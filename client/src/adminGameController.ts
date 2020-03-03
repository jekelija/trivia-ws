import { Game, Group } from "./model/game";
import { findAncestor, emptyDiv } from "./utils";

export class AdminGameController {
    private game:Game;
    private currentRound = 1;
    private dailyDoubles:{col:number, row:number}[] = [];

    private removePlayerAnswered(): void {
        const parent = document.getElementById('player-scores');
        const currentPlayers = parent.getElementsByClassName('player-answered');
        while(currentPlayers.length > 0) {
            currentPlayers[0].classList.remove('player-answered');
        }
    }

    refreshScores(players: {name: string, score: number}[]): void {
        this.removePlayerAnswered();
        const parent = document.getElementById('player-scores');
        for(let p of players) {
            const el = parent.querySelector('[data-name="' + p.name + '"]');
            const scoreEl = el.getElementsByClassName('player-score-score')[0];
            scoreEl.innerHTML = p.score.toString();
        }
    }

    playerAnswered(name:string): void {
        const parent = document.getElementById('player-scores');
        this.removePlayerAnswered();
        const el = parent.querySelector('[data-name="' + name + '"]');
        el.classList.add('player-answered');
    }
    
    removePlayer(name:string): void {
        const parent = document.getElementById('player-scores');
        const el = parent.querySelector('[data-name="' + name + '"]');
        el.remove();
    }
    
    addPlayer(name: string): void {
        const parent = document.getElementById('player-scores');
        const div = document.createElement('div');
        div.dataset.name = name;
        div.classList.add('square', 'player-score', 'flex', 'flex-column');

        const nameEl = document.createElement('div');
        nameEl.classList.add('player-score-name');
        nameEl.innerHTML = name;
        const scoreEl = document.createElement('div');
        scoreEl.classList.add('player-score-score');
        scoreEl.innerHTML = '0';

        div.appendChild(nameEl);
        div.appendChild(scoreEl);
        parent.appendChild(div);
    }
    setGame(game:Game): void {
        this.game = game;

        this.dailyDoubles = [];
        this.dailyDoubles.push({
            col: Math.floor(Math.random() * game.round1.length),
            row: Math.floor(Math.random() * game.round1[0].questions.length)
        });

        this.buildBoard(game.round1);
    }

    private buildBoard(groups: Group[]): void {
        const parent = document.getElementById('grid');
        emptyDiv(parent);
        for(let i=0; i < groups.length; ++i) {
            const group = groups[i];
            const column = document.createElement('div');
            column.classList.add('column', 'flex', 'flex-column');
            column.dataset.index = i.toString();

            const header = document.createElement('div');
            header.classList.add('square', 'header');
            header.innerHTML = group.title;
            column.appendChild(header);

            for(let j=0; j < group.questions.length; ++j) {
                const q = group.questions[j];
                const square = document.createElement('div');
                square.classList.add('square');
                square.dataset.index = j.toString();

                const cost = document.createElement('div');
                cost.classList.add('cost');
                cost.innerHTML = q.value.toString();

                const question = document.createElement('div');
                question.classList.add('question', 'hidden');
                if(this.dailyDoubles.find(x=> {
                    return x.col == i && x.row == j;
                })) {
                    question.innerHTML = 'DAILY DOUBLE<br/>' + q.question;
                }
                else {
                    question.innerHTML = q.question;
                }

                square.appendChild(cost);
                square.appendChild(question);
                column.appendChild(square);
            }

            parent.appendChild(column);
        }
    }

    hideZoom():void {
        const zoomClone = document.getElementsByClassName('zoomQuestion');
        if(zoomClone && zoomClone.length > 0) {
            zoomClone[0].remove();
        }
    }

    getRound(): number {
        return this.currentRound;
    }

    setRound(round: number): void {
        this.currentRound = round;
        if(round == 1) {
            this.dailyDoubles = [];
            this.dailyDoubles.push({
                col: Math.floor(Math.random() * this.game.round1.length),
                row: Math.floor(Math.random() * this.game.round1[0].questions.length)
            });
            this.buildBoard(this.game.round1);
        }
        else if(round == 2) {
            this.dailyDoubles = [];
            const firstCol = Math.floor(Math.random() * this.game.round2.length);
            const firstRow = Math.floor(Math.random() * this.game.round2[0].questions.length);
            this.dailyDoubles.push({
                col: firstCol,
                row: firstRow
            });

            let secondCol:number, secondRow:number;
            //do it again, make sure its not the same one
            do {
                secondCol = Math.floor(Math.random() * this.game.round2.length);
                secondRow = Math.floor(Math.random() * this.game.round2[0].questions.length);
            } while(secondCol==firstCol && secondRow==firstRow);
            

            this.buildBoard(this.game.round2);
        }
        //TODO final jeopardy
    }

    flipSquare(costElement:HTMLElement): {groupIndex:number, questionIndex:number, isDailyDouble:boolean} {
        costElement.classList.add('hidden');
        costElement.nextElementSibling.classList.remove('hidden');
        const zoomClone = costElement.parentElement.cloneNode(true) as HTMLDivElement;
        zoomClone.addEventListener('click', e=> {
            this.hideZoom();
        });
        zoomClone.classList.add('zoomQuestion');
        zoomClone.style.left = costElement.parentElement.offsetLeft + 'px';
        zoomClone.style.top = costElement.parentElement.offsetTop + 'px';
        zoomClone.style.width = costElement.nextElementSibling.clientWidth + 'px';
        zoomClone.style.fontSize = '16px';
        document.getElementById('main').appendChild(zoomClone);
        setTimeout(()=> {
            zoomClone.style.left = '0px';
            zoomClone.style.top = '0px';
            zoomClone.style.width = '100%';
            zoomClone.style.fontSize = '80px';
            zoomClone.style.height = '100%';
        }, 100);
        const groupIndex = parseInt(findAncestor(costElement, 'column').dataset.index);
        const questionIndex = parseInt(costElement.parentElement.dataset.index);
        return {
            groupIndex, questionIndex,
            isDailyDouble : this.dailyDoubles.findIndex(x=> {
                return x.col == groupIndex && x.row == questionIndex;
            }) != -1
        };
    } 
}