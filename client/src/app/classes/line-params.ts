export class LineParams {
    strokeWidth: number;
    firstDone: boolean;
    rendering: boolean;
    constructor() {
        const widthStroke = 5;
        this.strokeWidth = widthStroke;
        this.firstDone = false;
        this.rendering = false;
      }
}
