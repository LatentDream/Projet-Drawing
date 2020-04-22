export class TextParams {
    fontWeight: number;
    fontFamily: string;
    fontStyle: string;
    fontBold: string;
    align: string;
    rendering: boolean;
    startX: number;
    startY: number;
    // type must be any because object is used to store event targets and the target could be any type of object
    // tslint:disable-next-line: no-any
    currentMember: any;
    // tslint:disable-next-line: no-any
    sentence: any = [];
    left: boolean;
    newY: number;
    posCursorY: number;
    posCursorX: number;
    constructor() {
        const weightCon = 15;
        this.fontWeight = weightCon;
        this.rendering = false;
        this.newY = 0;
      }
}
