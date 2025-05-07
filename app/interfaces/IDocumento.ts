export interface IDocumento {
    id?: string;
    nome: string;
    status?: StatusKey ;
    categoria: TipoDocumento.TipoDocumentoValue ;
    descricao: string;
    userEmail?: string;
}

type StatusKey = keyof typeof StatusDocumento;
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