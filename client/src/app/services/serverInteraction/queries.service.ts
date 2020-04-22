import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { AlertDialogComponent } from 'src/app/components/dialog/alert-dialog/alert-dialog.component';
import { FORMAT } from 'src/app/components/dialog/export-drawing-dialog/enum';
import { Drawing } from './../../../../../common/communication/drawing';

@Injectable({
  providedIn: 'root'
})
export class QueriesService {

  private dialogRefAlert: MatDialogRef<AlertDialogComponent>;

  constructor(public http: HttpClient, public dialog: MatDialog) {}

  async sendDrawingData(currentName: string, currentTags: string[], currentDrawing: string): Promise<string> {
    return this.http.post('http://localhost:3000/database/drawing', {name: currentName,
                                                                              tags: currentTags,
                                                                              drawing: currentDrawing },
                                                                              { responseType: 'text' }).toPromise();
  }

  async deleteDrawing(currentId: string): Promise<string> {
    return this.http.delete('http://localhost:3000/database/remove/' + currentId, {responseType: 'text'}).toPromise();
  }

  getAllDrawings(): Observable<Drawing[]> {
    return this.http.get<Drawing[]>('http://localhost:3000/database/drawings');
  }

  sendmail(drawingName: string, drawingFormat: FORMAT, email: string, imgUri: string): void {
    this.http.post('http://localhost:3000/sendmail/fromServer',
    { name: drawingName,
      format: drawingFormat,
      to: email,
      imgURI: imgUri
    }, { responseType: 'text' })
    .subscribe(
      (res: string) => {
          console.log(res);
          const resObject = JSON.parse(res);
          const dialogConfig = new MatDialogConfig();
          dialogConfig.disableClose = true;
          dialogConfig.autoFocus = true;
          dialogConfig.width = '300px';
          this.dialogRefAlert = this.dialog.open(AlertDialogComponent, dialogConfig);
          this.dialogRefAlert.componentInstance.message = resObject.message;
      },
      (error: ErrorEvent) => {
        console.log(error);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '400px';
        this.dialogRefAlert = this.dialog.open(AlertDialogComponent, dialogConfig);
        this.dialogRefAlert.componentInstance.message = 'Dessin trop volumineux pour l\'envoi';
      }
    );
  }
}
