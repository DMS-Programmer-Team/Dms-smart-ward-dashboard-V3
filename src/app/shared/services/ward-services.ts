import { inject, Injectable } from '@angular/core';
import { SocketServices } from './socket-services';
import { Observable } from 'rxjs';
import { Ward, WardResponse } from '../interfaces/ward';

@Injectable({
  providedIn: 'root',
})
export class WardServices {

  private socketSrv = inject(SocketServices);

  connect(): void {
    this.socketSrv.connect();
  }

  getWardList(): Observable<any[]> {
    this.socketSrv.emit('get_ward_list');
    return new Observable<any[]>((observer) => {
      this.socketSrv.onreg('ward_list', (data: any) => {
        if (data && data.msg) {
          observer.next(data.msg);
        } else {
          observer.next([]); 
        }
      });
    });
  }

  onWardList(): Observable<WardResponse> {
    return this.socketSrv.on<WardResponse>('ward_list');
  }

    setWardLists(wards: Ward[] | null = []) {
    window.localStorage.setItem('wards', JSON.stringify(wards))
  }

}
