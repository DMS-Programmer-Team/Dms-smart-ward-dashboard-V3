import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketServices } from './socket-services';

@Injectable({
  providedIn: 'root',
})
export class OrderServices {

  private socketSrv = inject(SocketServices);

  updateOrderStatePay(order_number: number, icode: string, item_index: number, loginname: string, qty: number, order_state: number, hn: string): Promise<any> {
    this.socketSrv.emit('req_update_order_state_pay', { order_number, icode, item_index, loginname, qty, order_state, hn });
    return this.socketSrv.fromOneTimeEvent<any>('update_order_state_pay');
  }

  updateOrderApproveDrug(loginname: string, order_number: number, icode: string, hn: string): Promise<any> {
    this.socketSrv.emit('req_update_approve_drug', { loginname, order_number, icode,  hn });
    return this.socketSrv.fromOneTimeEvent<any>('update_order_approve_drug');
  }


  getOrderScanipd(order_number: number, hn: string): Promise<any> {
    this.socketSrv.emit('req_drug_scan_order_ipd', { order_number, hn });
    console.log('getOrderScanipd called with', order_number, hn);
    return this.socketSrv.fromOneTimeEvent<any>('drug_scan_order_ipd');
  }


  getOrderScanitem(order_number: number, hn: string, item_index: number): Promise<any> {
    this.socketSrv.emit('req_drug_scan_order_item', { order_number, hn, item_index });
    console.log('getOrderScanitem called with', order_number, hn, item_index);
    return this.socketSrv.fromOneTimeEvent<any>('drug_scan_order_item');
  }



  onUpdateOrderStatePay(): Observable<any> {
    return this.socketSrv.fromEvent<any>('update_order_state_pay');
  }


  getorderstate(): Observable<any[]> {
    this.socketSrv.emit('get_order_state_ipd');
    return new Observable<any[]>((observer) => {
      this.socketSrv.onreg('order_state_ipd', (data: any) => {
        if (data && data.msg) {
          observer.next(data.msg);
        } else {
          observer.next([]);
        }
      });
    });
  }

}
