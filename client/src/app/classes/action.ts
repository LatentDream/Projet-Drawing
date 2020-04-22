// target type must be any because type of target can change
export class Action {
  type: string;
  // tslint:disable-next-line: no-any
  target: any; // target could be any type of object
  // tslint:disable-next-line: no-any
  constructor(type: string, target: any) {
    this.type = type;
    this.target = target;
  }
}

// tslint:disable-next-line: max-classes-per-file
export class ApplicatorData {
  element: HTMLElement;
  attName: string;
  oldValue: string;
  constructor(element: HTMLElement, attName: string, oldValue: string) {
    this.element = element;
    this.attName = attName;
    this.oldValue = oldValue;
  }
}

// tslint:disable-next-line: max-classes-per-file
export class ObserverParam {
  config: MutationObserverInit;
  // tslint:disable-next-line: no-any
  callback: any;
  observer: MutationObserver;

}
