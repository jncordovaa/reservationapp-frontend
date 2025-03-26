import { Component, Inject, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material/material.module';
import { RoomService } from '../../../services/room.service';
import { ReservationService } from '../../../services/reservation.service';
import { Room } from '../../../model/room';
import { Reservation } from '../../../model/reservation';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { format } from 'date-fns';

@Component({
  selector: 'app-reservation-form',
  imports: [FormsModule, ReactiveFormsModule, MaterialModule, CommonModule],
  standalone: true,
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.css'
})
export class ReservationFormComponent {
  reservation: Reservation;
  rooms: Room[];
  roomSelected: Room = {
    roomNumber: '', price: 0,
    idRoom: 0,
    idRoomType: '',
    available: false,
    floor: 0,
    roomTypeShortDescription: ''
  };
  minDate: Date = new Date();
  checkOutDate: Date;
  checkInDate: Date;
  errorBackend: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Reservation,
    private _dialogRef: MatDialogRef<ReservationFormComponent>,
    private roomService: RoomService,
    private reservationService: ReservationService,
  ) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.reservation = { ... this.data };
    this.checkInDate = new Date(Date.parse(this.reservation.checkInDate));
    this.checkOutDate = new Date(Date.parse(this.reservation.checkOutDate));
    
    this.findRoomById(this.reservation.idRoom);
    this.onDateChange();
    /*
    this.roomService.findAll().subscribe(data => {
      this.rooms = data;
      console.log("Datos recibidos:", data);
    });*/

  }

  findRoomById(idRoom: number) {
    if (idRoom > 0 ) {
      this.roomService.findById(idRoom).subscribe(data => this.roomSelected = data);
    }
  }

  close() {
    this._dialogRef.close();
  }

  operate() {
    console.log('operate');
    
    let operation$;
    
    if (this.roomSelected != null && this.roomSelected.idRoom > 0) {
      this.reservation.idRoom = this.roomSelected.idRoom;
    }
   
    if (this.reservation != null && this.reservation.idReservation > 0) {
      // UPDATE
      console.log('update');
      operation$ = this.reservationService.update(this.reservation.idReservation, this.reservation)
    } else {
      // INSERT
      console.log('insert');
      operation$ = this.reservationService.save(this.reservation);
    }
  
    operation$
      .pipe(switchMap(() => this.reservationService.findAll()))
      .subscribe({
        next: (data) => {
          this.reservationService.setReservationtChange(data);
          this.reservationService.setMessageChange('Operation successful!');
          this.close(); // Se ejecuta solo si no hay error
        },
        error: (error) => {
          this.errorBackend = error?.error?.message || ['An unexpected error occurred!'];
          //this.errorBackend = error?.error?.errors ?? [error?.error?.message ?? 'An unexpected error occurred!'];
          this.reservationService.setMessageChange('Ocurrió un error');
        }
      });
  }
  /*
  operate() {
    this.reservation.idRoom = this.roomSelected.idRoom;
    //this.reservation.checkInDate = format(this.checkInDate, "yyyy-MM-dd'T'HH:mm:ss");
    //this.reservation.checkOutDate = format(this.checkOutDate, "yyyy-MM-dd'T'HH:mm:ss");

    console.log('operate')
    if (this.reservation != null && this.reservation.idReservation > 0) {
      //UPDATE
      console.log('update')
      this.reservationService.update(this.reservation.idReservation, this.reservation)
        .pipe(switchMap(() => this.roomService.findAll()))
        .subscribe(data => {
          this.roomService.setRoomChange(data);
          this.roomService.setMessageChange('UPDATED!');
        });
    } else {
      //INSERT
      console.log('insert')
      this.reservationService.save(this.reservation)
        .pipe(switchMap(() => this.reservationService.findAll()))
        .subscribe(data => {
          this.reservationService.setReservationtChange(data);
          this.reservationService.setMessageChange('CREATED!');
        });
    }

    this.close();
  }
  */

  selectRoom(m: Room){
    this.roomSelected = m;
    console.log(m);
  }

  getDate(e: any){
    console.log(e);
  }

  getCheckInDate(e: any){
    console.log(e);
    const formattedStart = format(new Date(e.value), "yyyy-MM-dd'T'HH:mm:ss");
    this.reservation.checkInDate = formattedStart;
    this.onDateChange();
  }

  getCheckOutDate(e: any){
    console.log(e);
    const formattedEnd = format(new Date(e.value), "yyyy-MM-dd'T'HH:mm:ss");
    this.reservation.checkOutDate = formattedEnd;
    this.onDateChange();
  }

  // Método para detectar cambios en el rango de fechas
  onDateChange() {
    
    if (this.reservation.checkInDate && this.reservation.checkOutDate) {
      console.log(`Rango seleccionado: ${this.reservation.checkInDate} - ${this.reservation.checkOutDate}`);
      // Aquí puedes hacer una petición HTTP para recuperar datos
      this.roomService.searchAvailable(this.reservation.checkInDate, this.reservation.checkOutDate).subscribe(data => {
        this.rooms = data;
        console.log("Datos recibidos:", data);
      });
    }
  }

}
