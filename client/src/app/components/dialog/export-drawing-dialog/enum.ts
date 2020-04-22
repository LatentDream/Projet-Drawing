export enum FORMAT {
    SVG = 'svg',
    JPG = 'jpg',
    PNG = 'png'
}

export enum FILTER {
    NONE = 'blur(0px)'
}

export enum EXPORT {
    DOWNLOAD = 'download',
    EMAIL = 'email'
}

export enum MESSAGE {
    ASK_CONFIRMATION_TO_SEND = 'Êtes-vous certain de vouloir envoyer ce dessin ?',
    EMAIL_NOT_VALID = 'Entrer une addresse couriel valide',
    NAME_NOT_VALID = 'Le nom du dessin est invalide. Longueur minimum de 1 et maximale de 20. Nutilisez que les caractères a-Z, 1-9 ou _'
}

export enum VERIF {
    NAME = '^[\\w]{1,20}$',
    EMAIL = '^[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}$',
    TESTEAMILSHOULDPASS = 'TestIs@good.com',
    TESTEAMILSHOULDFAILL1 = 'bad@email',
    TESTEAMILSHOULDFAILL2 = '@email.ca',
    TESTEAMILSHOULDFAILL3 = 'ooof.email.ca',
    TESTNAMETOLONG = 'NAMETOOLONGFORTHECONTEXTOFUTILISATION!!!'
}

export class ExportInfo {
    drawingName: string;
    email: string;
    serializeSVG: string;
    format: FORMAT;
    exportMethode: EXPORT;
    filter: FILTER;
    base64data: string;
}
