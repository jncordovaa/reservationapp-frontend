import { inject, Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Room } from '../model/room';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environments.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoomService extends GenericService<Room> {

  private roomChange: Subject<Room[]> = new Subject<Room[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor() { 
    super(
      inject(HttpClient),
      `${environment.HOST}/rooms`
    );

  }

  searchAvailable(checkInDate: string, checkOutDate: string){

    return this.http.get<Room[]>(`${this.url}/available?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`);

  }

  setRoomChange(data: Room[]){
    this.roomChange.next(data);
  }

  getRoomChange(){
    return this.roomChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }


}
