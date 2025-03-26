import { Routes } from '@angular/router';
import { RoomComponent } from './pages/room/room.component';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
    { path: '', redirectTo: 'pages/reservation', pathMatch: 'full'},
    {
        path: 'pages', 
        component: LayoutComponent,
        loadChildren: () => 
            import('./pages/pages.routes').then((x) => x.pagesRoutes),
    },
];
