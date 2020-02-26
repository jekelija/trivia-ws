export interface Question {
    value: number;
    question: string;
    picture?: string;
    answer: string;
}

export interface Group {
    title: string;
    questions: Question[];
}

export interface Game {
    round1: Group[];
    round2?: Group[];
    finalJeopardy?: {title: string, question: Question};
}
