export class Queue {
    data: string[];
     constructor() {
       this.data = [];
       const nine = 9;
       this.data.length = nine;
      }

     add(record: string): void {
        this.data.unshift(record);
      }
     remove(): void {
        this.data.pop();
      }
    }
