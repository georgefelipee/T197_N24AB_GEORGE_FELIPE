export interface IDocumento {
    nome: string;
    status?: StatusDocumento ;
    categoria: string;
    descriçao: string;
    userEmail?: string;
}

export enum StatusDocumento {
    AGUARDANDO = 'Aguardando',
    APROVADO = 'Aprovado',
    REPROVADO = 'Reprovado',
}