import { Component, ViewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { RoomType } from '../../model/roomType';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RoomTypeService } from '../../services/room-type.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { RoomtypeFormComponent } from './roomtype-form/roomtype-form.component';

@Component({
  selector: 'app-roomtype',
  imports: [ RouterOutlet, MaterialModule],
  standalone: true,
  templateUrl: './roomtype.component.html',
  styleUrl: './roomtype.component.css'
})


export class RoomtypeComponent {
  dataSource: MatTableDataSource<RoomType>;

  columnsDefinitions = [
    { def: 'idRoomType', label: 'idRoomType', hide: true },
    { def: 'shortDescription', label: 'shortDescription', hide: false },
    { def: 'detailedDescription', label: 'detailedDescription', hide: false },
    { def: 'actions', label: 'actions', hide: false}
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private roomTypeService: RoomTypeService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ){}
  //private patientService = inject(PatientService);

  ngOnInit(): void {
    this.roomTypeService.findAll().subscribe(data => this.createTable(data));
    this.roomTypeService.getRoomTypeChange().subscribe(data => this.createTable(data));
    this.roomTypeService.getMessageChange().subscribe(data => this._snackBar.open(data, 'INFO', { duration: 3000, horizontalPosition: 'right', verticalPosition: 'bottom'}));
    
  }

  createTable(data: RoomType[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;    
    this.dataSource.sort = this.sort;  
  }

  getDisplayedColumns() {
    return this.columnsDefinitions.filter((cd) => !cd.hide).map((cd) => cd.def);
  }

  applyFilter(e: any){
    this.dataSource.filter = e.target.value.trim();
  }

  openDialog(roomType?: RoomType) {
    this._dialog.open(RoomtypeFormComponent, {
      width: '750px',
      data: roomType
    })
  }

  delete(id: number){
    this.roomTypeService.delete(id)
      .pipe(switchMap( () => this.roomTypeService.findAll() ))
      .subscribe(data => {
        this.roomTypeService.setRoomTypetChange(data);
        this.roomTypeService.setMessageChange('DELETED!');
      });
  }
}
