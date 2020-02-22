export interface Questions {
    value: number;
    question: string;
    picture?: string;
    answer: string;
}

export interface Group {
    title: string;
    questions: Questions[];
}

export interface Game {
    groups: Group[];
}
