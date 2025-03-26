import { Component, ViewChild } from '@angular/core';
import { RoomService } from '../../services/room.service';
import { MaterialModule } from '../../material/material.module';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Room } from '../../model/room';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { RoomtypeFormComponent } from '../roomtype/roomtype-form/roomtype-form.component';
import { RoomFormComponent } from './room-form/room-form.component';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [MaterialModule, RouterOutlet],
  templateUrl: './room.component.html',
  styleUrl: './room.component.css'
})
export class RoomComponent {
  dataSource: MatTableDataSource<Room>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  columnsDefinitions = [
    { def: 'idRoom', label: 'idRoom', hide: true },
    { def: 'roomNumber', label: 'roomNumber', hide: false },
    { def: 'roomTypeShortDescription', label: 'available', hide: false },
    { def: 'price', label: 'price', hide: false },
    { def: 'floor', label: 'floor', hide: false },
    { def: 'available', label: 'available', hide: false },
    { def: 'actions', label: 'actions', hide: false}
  ];

  constructor(
    private roomService: RoomService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.roomService.findAll().subscribe(data => this.createTable(data));
    this.roomService.getRoomChange().subscribe(data => this.createTable(data));
    this.roomService.getMessageChange().subscribe(data => this._snackBar.open(data, 'INFO', { duration: 3000, horizontalPosition: 'right', verticalPosition: 'bottom'}));
    
  }
  
   createTable(data: Room[]) {
    this.dataSource = new MatTableDataSource(data);
    console.log(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
   }

   getDisplayedColumns() {
    return this.columnsDefinitions.filter((cd) => !cd.hide).map((cd) => cd.def);
  }

  applyFilter(e: any){
    this.dataSource.filter = e.target.value.trim();
  }

  openDialog(room?: Room) {
    this._dialog.open(RoomFormComponent, {
      width: '1050px',
      height: '500px',
      data: room
    })
  }

  delete(id: number){
    this.roomService.delete(id)
      .pipe(switchMap( () => this.roomService.findAll() ))
      .subscribe(data => {
        this.roomService.setRoomChange(data);
        this.roomService.setMessageChange('DELETED!');
      });
  }
  

}
