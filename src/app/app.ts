import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SocketServices } from './shared/services/socket-services';
import { environment } from '../environments/environment.development';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Dms-smart-dashboard-ward-V3');

  private socketSrv = inject(SocketServices);
  
  ngOnInit(): void {
    console.log('starting socket connection...', environment.socketAPI);
    this.socketSrv.connect();
  }
}
