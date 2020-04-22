export class SelectionParameters {
    selectedItems: Map<string, SVGElement>;
    selectionRect: SVGElement;
    selectionRectId: string;
    selectedItemsRect: SVGElement;
    selectedItemsRectId: string;
    selectionRectHeight: number;
    selectionRectWidth: number;
    xLeftDragDrop: number;
    yTopDragDrop: number;
    dragDrop: boolean;
    xClickPosition: number;
    yClickPosition: number;
    leftSelectedItemsBox: number;
    rightSelectedItemsBox: number;
    topSelectedItemsBox: number;
    bottomSelectedItemsBox: number;
    // type must be any because object is used to store event targets and the target could be any type of object
    // tslint:disable-next-line: no-any
    object: any;
    leftClick: boolean;
    rightClick: boolean;
    areItemsSelected: boolean;
    tempSelectedItems: Map<string, SVGElement>;
    mouseMoveAction: string;
    oldMouseMoveXPos: number;
    oldMouseMoveYPos: number;
    controlPointTop: SVGElement;
    controlPointBottom: SVGElement;
    controlPointLeft: SVGElement;
    controlPointRight: SVGElement;
    selectedItemsMainRect: SVGElement;
    selectedItemsBoxRotationAxis: Map<string, string>;
    selectedItemsRotationAxis: Map<string, string[]>;
    selectedItemsInitPosBeforeRotation: Map<string, number[]>;
    firstRotation: boolean;
}
