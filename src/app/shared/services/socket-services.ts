import { inject, Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketServices {

  constructor(private socket: Socket) { }


  connect(): void {
    if (!this.socket.ioSocket.connected) {
      this.socket.connect();
    }

    this.socket.on('connect', () => {
      console.log(' Socket connected:', this.socket.ioSocket.id);
    });

    this.socket.on('disconnect', () => {
      console.log(' Socket disconnected');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  emit(eventName: string, data?: any): void {
    this.socket.emit(eventName, data);
  }

  on<T>(eventName: string): Observable<T> {
    return this.socket.fromEvent<T>(eventName);
  }

  onreg<T = any>(eventName: string, callback: (data: T) => void): void {
    if (this.socket) {
      this.socket.on(eventName, callback);
    } else {
      console.warn('Socket not connected.');
    }
  }

  fromOneTimeEvent<T>(eventName: string): Promise<T> {
    if (!this.socket) {
      return Promise.reject('Socket not connected');
    }
    return new Promise<T>((resolve) => {
      const handler = (data: T) => {
        resolve(data);
        this.socket.off(eventName, handler);
      };
      this.socket.on(eventName, handler);
    });
  }

    fromEvent<T>(eventName: string): Observable<T> {
    return new Observable<T>((observer) => {
      if (this.socket) {
        this.socket.on(eventName, (data: T) => {
          observer.next(data);
        });
      } else {
        console.warn('Socket not connected.');
      }
    });
  }

  
}
