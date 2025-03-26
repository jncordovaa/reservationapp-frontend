import { inject, Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { RoomType } from '../model/roomType';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments.development';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomTypeService extends GenericService<RoomType> {

  private roomTypeChange: Subject<RoomType[]> = new Subject<RoomType[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor() {
    super(
      inject(HttpClient),
       `${environment.HOST}/roomtypes`
    );
  }

  setRoomTypetChange(data: RoomType[]){
    this.roomTypeChange.next(data);
  }

  getRoomTypeChange(){
    return this.roomTypeChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
