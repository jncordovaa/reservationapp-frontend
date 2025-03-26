import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { FormsModule } from '@angular/forms';
import { Room } from '../../../model/room';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoomService } from '../../../services/room.service';
import { switchMap } from 'rxjs';
import { RoomTypeService } from '../../../services/room-type.service';
import { RoomType } from '../../../model/roomType';

@Component({
  selector: 'app-room-form',
  imports: [MaterialModule, FormsModule],
  templateUrl: './room-form.component.html',
  styleUrl: './room-form.component.css'
})
export class RoomFormComponent {

  room: Room;
  roomTypes: RoomType[];  
  errorBackend: string[] = [];
  
    constructor(
      @Inject(MAT_DIALOG_DATA) private data: Room,
      private _dialogRef: MatDialogRef<RoomFormComponent>,
      private roomService: RoomService,
      private roomTypeService: RoomTypeService
    ){}
  
    ngOnInit(): void {
      this.room = {... this.data}; //spread operator

      if (Object.keys(this.room).length === 0) {
        this.room.available = true
        console.log("El objeto está vacío");
    }
    

      console.log(this.room);
      this.roomTypeService.findAll().subscribe(data => this.roomTypes = data);
      console.log(this.roomTypes);
    }
  
    close(){
      this._dialogRef.close();
    }
  
    operate() {
      console.log('operate');
      
      let operation$;
    
      if (this.room != null && this.room.idRoom > 0) {
        // UPDATE
        console.log('update');
        operation$ = this.roomService.update(this.room.idRoom, this.room)
      } else {
        // INSERT
        console.log('insert');
        operation$ = this.roomService.save(this.room);
      }
    
      operation$
        .pipe(switchMap(() => this.roomService.findAll()))
        .subscribe({
          next: (data) => {
            this.roomService.setRoomChange(data);
            this.roomService.setMessageChange('Operation successful!');
            this.close(); // Se ejecuta solo si no hay error
          },
          error: (error) => {
            this.errorBackend = error?.error?.message || ['An unexpected error occurred!'];
            //this.errorBackend = error?.error?.errors ?? [error?.error?.message ?? 'An unexpected error occurred!'];
            this.roomService.setMessageChange('Ocurrió un error');
          }
        });
    }

     /*
    operate(){
      console.log('operate')
      if(this.room != null && this.room.idRoom > 0){
        //UPDATE        console.log('update')
        this.roomService.update(this.room.idRoom, this.room)
          .pipe(switchMap ( () => this.roomService.findAll()))
          .subscribe(data => {
            this.roomService.setRoomChange(data);
            this.roomService.setMessageChange('UPDATED!');
          });
      }else{
        //INSERT
        console.log('insert')
        this.roomService.save(this.room)
          .pipe(switchMap ( () => this.roomService.findAll()))
          .subscribe(data => {
            this.roomService.setRoomChange(data);
            this.roomService.setMessageChange('CREATED!');
          });
      }
  
      this.close();
    }
    */

}
