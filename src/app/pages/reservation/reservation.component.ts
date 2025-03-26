import { Component, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { Reservation } from '../../model/reservation';
import { MatTableDataSource } from '@angular/material/table';
import { ReservationService } from '../../services/reservation.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RouterOutlet } from '@angular/router';
import { ReservationFormComponent } from './reservation-form/reservation-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservation',
  imports: [MaterialModule, RouterOutlet, CommonModule],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent {

  dataSource: MatTableDataSource<Reservation>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  columnsDefinitions = [
    { def: 'idReservation', label: 'idReservation', hide: false },
    { def: 'customerName', label: 'customerName', hide: false },
    { def: 'checkInDate', label: 'checkInDate', hide: false },
    { def: 'checkOutDate', label: 'checkOutDate', hide: false },
    { def: 'roomNumber', label: 'roomNumber', hide: false },
    { def: 'roomPrice', label: 'roomPrice', hide: false },
    { def: 'roomTypeShortDescription', label: 'roomTypeShortDescription', hide: false },
  ];

  constructor (
    private reservationService: ReservationService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.reservationService.findAll().subscribe(data => this.createTable(data));
    this.reservationService.getReservationChange().subscribe(data => this.createTable(data));
    this.reservationService.getMessageChange().subscribe(data => this._snackBar.open(data, 'INFO', { duration: 3000, horizontalPosition: 'right', verticalPosition: 'bottom'}));
  }

  createTable(data: Reservation[]) {
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

  openDialog(reservation?: Reservation) {
      this._dialog.open(ReservationFormComponent, {
        width: '1050px',
        height: '80vh',
        data: reservation
      })
    }

}
