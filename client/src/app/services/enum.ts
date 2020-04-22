export enum RECT {
    ELEMENT = 'rect',
    LINK = 'http://www.w3.org/2000/svg',
    X = 'x',
    Y = 'y',
    HEIGHT = 'height',
    WIDTH = 'width',
    STROKE = 'stroke',
    STROKE_WIDTH = 'stroke-width',
    FILL = 'fill',
    FILL_OPACITY = 'fill-opacity'
}

export enum PATH {
    ELEMENT = 'path',
    LINK = 'http://www.w3.org/2000/svg',
    D = 'd',
    FILL = 'fill',
    STROKE = 'stroke',
    STROKE_WIDTH = 'stroke-width',
    STROKE_LINECAP = 'stroke-linecap',
    FILTER = 'filter'
}

export enum FEATHER {
    ELEMENT = 'g',
    LINK = 'http://www.w3.org/2000/svg',
    FILL = 'fill',
    STROKE = 'stroke',
    POLYGON = 'polygon',
    POINTS = 'points'
}

export enum SPRAY {
    ELEMENT = 'g',
    LINK = 'http://www.w3.org/2000/svg',
    DOT_R = 'r',
    BASE_R = 1.0,
    HYP = 2,
    X = 0,
    Y = 1,
    MAX_EPS = 1000,
    MIN_EPS = 10,
    BASE_STROKE_WIDTH = 30,
}

export enum POLYLINE {
    ELEMENT = 'polyline',
    LINK = 'http://www.w3.org/2000/svg',
    POINTS = 'points',
    STROKE = 'stroke',
    STROKE_LINEJOIN = 'stroke-linejoin',
    STROKE_WIDTH = 'stroke-width',
    FILL = 'fill',
}

export enum CIRCLE {
    ELEMENT = 'circle',
    LINK = 'http://www.w3.org/2000/svg',
    R = 'r',
    FILL = 'fill',
    CX = 'cx',
    CY = 'cy',
}

export enum SELECTION {
    RECT = 'rect',
    LINK = 'http://www.w3.org/2000/svg',
    FILL = 'fill',
    STROKE = 'stroke',
    STROKE_WIDTH = 'stroke-width',
    X = 'x',
    Y = 'y',
    HEIGHT = 'height',
    WIDTH = 'width',
    ARROWLEFT = 'ArrowLeft',
    ARROWRIGHT = 'ArrowRight',
    ARROWDOWN = 'ArrowDown',
    ARROWUP = 'ArrowUp',
    FIRSTTRANSLATIONHOLD = 'firstTranslationHold',
    ID = 'id'
}

export enum ELLIPSE {
    ELEMENT = 'ellipse',
    LINK = 'http://www.w3.org/2000/svg',
    CX = 'cx',
    CY = 'cy',
    RX = 'rx',
    RY = 'ry',
    STROKE = 'stroke',
    STROKE_WIDTH = 'stroke-width',
    FILL = 'fill',
    FILL_OPACITY = 'fill-opacity',
}

export enum POLYGON {
    ELEMENT = 'polygon',
    LINK = 'http://www.w3.org/2000/svg',
    POINTS = 'points',
    STROKE = 'stroke',
    STROKE_WIDTH = 'stroke-width',
    FILL = 'fill',
    FILL_OPACITY = 'fill-opacity',
    NBPOINTS = 'nbpoints',
}

export enum GRID {
    BASE_SCALE = 50,
    BASE_PATH = 'M 50 0 L 0 0 0 50',
    BASE_OPACITY = 1,
    MAX_SCALE = 500,
    MIN_SCALE = 10,
}

export enum TEXT {
    LINK = 'http://www.w3.org/2000/svg',
    ELEMENT = 'text',
    ELEMENT_NEXT = 'tspan',
    ELEMENT_CURSOR = 'image',
    TEXT_LENGTH = 'textLength',
    X = 'x',
    Y = 'y',
    DX = 'dx',
    DY = 'dy',
    FONT_FAMILY = 'font-family',
    FONT_STYLE = 'font-style',
    FONT_SIZE = 'font-size',
    FONT_WEIGHT = 'font-weight',
    FILL = 'fill',
    HREF = 'href',
    ALIGN = 'text-anchor',
}

export enum BUCKET {
    PATH = 'path',
    LINK = 'http://www.w3.org/2000/svg',
    D = 'd',
    G = 'g',
    FILL = 'fill',
    STROKE = 'stroke',
    STROKE_WIDTH = 'stroke-width',
    SWV = '2',
    STROKE_LINECAP = 'stroke-linecap',
    FILTER = 'filter',
    TOL_MULTIPLICATOR = 7.65,
    MAX_COLOR = 1000
}
