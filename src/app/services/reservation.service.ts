import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environments.development';
import { GenericService } from './generic.service';
import { Reservation } from '../model/reservation';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService extends GenericService<Reservation> {

  private reservationChange: Subject<Reservation[]> = new Subject<Reservation[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor() {
    super(
      inject(HttpClient),
      `${environment.HOST}/reservations`
    );

  }

  setReservationtChange(data: Reservation[]) {
    this.reservationChange.next(data);
  }

  getReservationChange() {
    return this.reservationChange.asObservable();
  }

  setMessageChange(data: string) {
    this.messageChange.next(data);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }

}
