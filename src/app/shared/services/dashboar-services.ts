import { inject, Injectable } from '@angular/core';
import { SocketServices } from './socket-services';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DashboarServices {

  private _isIPDLogin: boolean = false;


  private socketSrv = inject(SocketServices);

  // -------------- dashboard ------------------

  getDataOrderIPD(payload: {
    ward: string;
    hn?: string;
    an?: string;
    name?: string;
    date?: string;
  }): void {
    try {
      this.socketSrv.emit('get_dataorder_ipd', payload);
    } catch (error) {
      console.error('Emit get_dataorder_ipd error:', error);
    }
  }

  onDataOrderIPD(): Observable<any> {
    return this.socketSrv.on<any>('dataorder_ipd').pipe(
      catchError(error => {
        console.error('Socket dataorder_ipd error:', error);
        return throwError(() => error);
      })
    );
  }

  getSummary(filters: any) {
    try {
      this.socketSrv.emit('get_dataorder_ipd_summary', filters);
    } catch (error) {
      console.error('Emit get_dataorder_ipd_summary error:', error);
    }
  }
  onSummary(): Observable<any> {
    return this.socketSrv.on<any>('dataorder_ipd_summary').pipe(
      catchError(error => {
        console.error('Socket dataorder_ipd_summary error:', error);
        return throwError(() => error);
      })
    );
  }

  // -------------- dashboard OPD  ------------------
  getSummaryOPD(filters: any) {
    try {
      this.socketSrv.emit('get_dataorder_opd_summary', filters);
    } catch (error) {
      console.error('Emit get_dataorder_opd_summary error:', error);
    }

  }

  onSummaryOPD(): Observable<any> {
    return this.socketSrv.on<any>('dataorder_opd_summary').pipe(
      catchError(error => {
        console.error('Socket dataorder_opd_summary error:', error);
        return throwError(() => error);
      })
    );
  }

  getDataOrderOPD(payload: {
    ward: string;
    hn?: string;
    an?: string;
    name?: string;
    date?: string;
  }): void {
    try {
      this.socketSrv.emit('get_dataorder_opd', payload);
    } catch (error) {
      console.error('Emit get_dataorder_opd error:', error);
    }
  }

  onDataOrderOPD(): Observable<any> {
    return this.socketSrv.on<any>('dataorder_opd').pipe(
      catchError(error => {
        console.error('Socket dataorder_opd error:', error);
        return throwError(() => error);
      })
    );
  }

  // -------------- detail ------------------
  getdetail(hn: string, order_number: string): void {
    try {
      this.socketSrv.emit('get_order_detail', { hn, order_number });
    } catch (error) {
      console.error('Emit get_order_detail error:', error);
    }
  }

  ondetail(): Observable<any> {
    return this.socketSrv.on<any>('order_detail').pipe(
      catchError(error => {
        console.error('Socket order_detail error:', error);
        return throwError(() => error);
      })
    );
  }

    // -------------- detail unitdose ------------------
  getdetailunitdose(hn: string, order_number: string): void {
    try {
      this.socketSrv.emit('get_order_detail_unitdose', { hn, order_number });
    } catch (error) {
      console.error('Emit get_order_detail_unitdose error:', error);
    }
  }

  ondetailunitdose(): Observable<any> {
    return this.socketSrv.on<any>('order_detail_unitdose').pipe(
      catchError(error => {
        console.error('Socket order_detai_unitdose error:', error);
        return throwError(() => error);
      })
    );
  }


  getpackunitdose(hn: string, order_number: string, order_date: string): void {
    try {
      this.socketSrv.emit('get_pack_unitdose', { hn, order_number, order_date });
    } catch (error) {
      console.error('Emit get_order_detail_unitdose error:', error);
    }
  }

  onpacklunitdose(): Observable<any> {
    return this.socketSrv.on<any>('order_pack_unitdose').pipe(
      catchError(error => {
        console.error('Socket order_detai_unitdose error:', error);
        return throwError(() => error);
      })
    );
  }


    getpackdrugunitdose(pack_id:string, order_number:string): void {
    try {
      this.socketSrv.emit('get_pack_drug_unitdose', { pack_id, order_number});
    } catch (error) {
      console.error('Emit get_order_detail_unitdose error:', error);
    }
  }

  onpackldrugunitdose(): Observable<any> {
    return this.socketSrv.on<any>('order_pack_drug_unitdose').pipe(
      catchError(error => {
        console.error('Socket order_detai_unitdose error:', error);
        return throwError(() => error);
      })
    );
  }


  getdrugunitdose(pack_number:number, id:string): void {
    try {
      this.socketSrv.emit('get_drug_unitdose', { pack_number, id });
    } catch (error) {
      console.error('Emit get_drug_unitdose error:', error);
    }
  }

  ondrugunitdose(): Observable<any> {
    return this.socketSrv.on<any>('order_drug_unitdose').pipe(
      catchError(error => {
        console.error('Socket order_drug_unitdose error:', error);
        return throwError(() => error);
      })
    );
  }

  // -------------- create_at_time_locker ------------------

  getcreateatlocker(order_number: string): void {
    try {
      this.socketSrv.emit('get_create_time_locker', {  order_number });
    } catch (error) {
      console.error('Emit get_create_time_locker error:', error);
    }
  }

  oncreateatlocker(): Observable<any> {
    return this.socketSrv.on<any>('create_time_locker').pipe(
      catchError(error => {
        console.error('Socket create_time_locker error:', error);
        return throwError(() => error);
      })
    );
  }


  // -------------- set IPD login status ------------------

  setIPDLogin(flag: boolean) {
    this._isIPDLogin = flag;
  }

  // getter
  get isIPDLogin(): boolean {
    return this._isIPDLogin;
  }

}
