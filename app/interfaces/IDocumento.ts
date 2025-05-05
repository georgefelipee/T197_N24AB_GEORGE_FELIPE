export interface IDocumento {
    nome: string;
    status?: StatusDocumento ;
    categoria: TipoDocumento.TipoDocumentoValue ;
    descriçao: string;
    userEmail?: string;
}

export enum StatusDocumento {
    AGUARDANDO = 'Aguardando',
    APROVADO = 'Aprovado',
    REPROVADO = 'Reprovado',
}

export namespace TipoDocumento {
    
    export enum TipoDocumentoEnum {
        CPF = 'CPF',
        RG = 'RG',
        CNH = 'CNH',
        COMPROVANTE_RESIDENCIA = 'Comprovante de Residência',
        COMPROVANTE_DE_RENDA = 'Comprovante de Renda',
        PROVAS_DO_CASO = 'Provas do Caso',
        OUTROS = 'Outros',
    }
    type TipoDocumentoKey = keyof typeof TipoDocumentoEnum;
    export type TipoDocumentoValue = typeof TipoDocumentoEnum[TipoDocumentoKey];

    export const tipoDocumentoValues: TipoDocumentoValue[] = Object.values(TipoDocumentoEnum) as TipoDocumentoValue[];
}