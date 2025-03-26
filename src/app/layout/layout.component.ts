import { Component } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [MaterialModule, RouterOutlet, RouterLink, RouterLinkActive],
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
