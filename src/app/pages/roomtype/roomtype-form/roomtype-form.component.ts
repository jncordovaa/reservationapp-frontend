import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { FormsModule } from '@angular/forms';
import { RoomType } from '../../../model/roomType';
import { RoomTypeService } from '../../../services/room-type.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, switchMap, throwError } from 'rxjs';

@Component({
  selector: 'app-roomtype-form',
  imports: [MaterialModule, FormsModule],
  standalone: true,
  templateUrl: './roomtype-form.component.html',
  styleUrl: './roomtype-form.component.css'
})

export class RoomtypeFormComponent {
  roomType: RoomType;
  errorBackend: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: RoomType,
    private _dialogRef: MatDialogRef<RoomtypeFormComponent>,
    private roomTypeService: RoomTypeService
  ) { }

  ngOnInit(): void {
    this.roomType = { ... this.data }; //spread operator
    console.log(this.roomType)
  }

  close() {
    this._dialogRef.close();
  }

  operate() {
    console.log('operate');
    
    let operation$;
  
    if (this.roomType != null && this.roomType.idRoomType > 0) {
      // UPDATE
      console.log('update');
      operation$ = this.roomTypeService.update(this.roomType.idRoomType, this.roomType);
    } else {
      // INSERT
      console.log('insert');
      operation$ = this.roomTypeService.save(this.roomType);
    }
  
    operation$
      .pipe(switchMap(() => this.roomTypeService.findAll()))
      .subscribe({
        next: (data) => {
          this.roomTypeService.setRoomTypetChange(data);
          this.roomTypeService.setMessageChange('Operation successful!');
          this.close(); // Se ejecuta solo si no hay error
        },
        error: (error) => {
          this.errorBackend = error?.error?.message || ['An unexpected error occurred!'];
          //this.errorBackend = error?.error?.errors ?? [error?.error?.message ?? 'An unexpected error occurred!'];
          this.roomTypeService.setMessageChange('Ocurrió un error');
        }
      });
  }

  /*

  operate() {
    console.log('operate')
    if (this.roomType != null && this.roomType.idRoomType > 0) {
      //UPDATE
      console.log('update')
      this.roomTypeService.update(this.roomType.idRoomType, this.roomType)
        .pipe(
          switchMap(() => this.roomTypeService.findAll()),
          catchError(error => {
            console.error('Error en actualización:', error);
            //this.showErrorMessage(error);
            return throwError(() => error);
          })
        )
        .subscribe(data => {
          this.roomTypeService.setRoomTypetChange(data);
          this.roomTypeService.setMessageChange('UPDATED!');
        });
    } else {
      //INSERT
      console.log('insert')
      this.roomTypeService.save(this.roomType)
        .pipe(
          switchMap(() => this.roomTypeService.findAll()),
          catchError(error => {
            this.errorBackend = error.error.message
            console.error('Error en insert:D:', error.error.message);
            //this.showErrorMessage(error);
            return throwError(() => error);
          })
        )
        .subscribe(data => {
          this.roomTypeService.setRoomTypetChange(data);
          this.roomTypeService.setMessageChange('CREATED!');
        });
       // this.close();
    }

   
  }*/

}
