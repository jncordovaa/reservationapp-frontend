import { Routes } from "@angular/router"
import { RoomComponent } from "./room/room.component"
import { RoomtypeComponent } from "./roomtype/roomtype.component"
import { RoomtypeFormComponent } from "./roomtype/roomtype-form/roomtype-form.component"
import { ReservationComponent } from "./reservation/reservation.component"

export const pagesRoutes: Routes = [

    { path: 'room',
        component: RoomComponent
    },
    {
        path: 'roomtype',
        component: RoomtypeComponent,
        children: [
          { path: 'new', component: RoomtypeFormComponent },
          { path: 'edit/:id', component: RoomtypeFormComponent },
        ],
      },
    {
      path: 'reservation',
      component: ReservationComponent
    }

]