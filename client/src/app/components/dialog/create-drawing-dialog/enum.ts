export enum CDZ {
    INNERWIDTH = 275,
    INNERHEIGHT = 10,
    MAXWIDTHHEIGHT = 2000,
    MINWIDTHHEIGHT = 20,
    MAXHEX = 256
}

export enum TESTCDZ {
    _20 = 20,
    _280 = 280,
    _30 = 30,
    _257 = 257,
    _minus1 = -1,
    _567and54 = 567.54,
    _22and3 = 22.3
}

export enum MESSAGE {
    WIDHT_HEIGT_ERRROR = 'La largeur et la hauteur de la zone de dessin doivent être entre 20px et 2000px',
    OVERWRITE_DRAWING = 'Êtes-vous sûr de vouloir créer un nouveau dessin? Le dessin en cours sera perdu.',
    MUST_BE_INT = 'les nombres doivent être entier',
    MUST_BE_HEXA = 'La valeur de rentrée devrait entre 0 et FF en hexa'
}
