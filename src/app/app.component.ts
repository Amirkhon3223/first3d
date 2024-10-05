import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModelListComponent } from './model-list/model-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ModelListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my3dapp';
}
