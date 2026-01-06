import { inject, Injectable } from '@angular/core';
import { SocketServices } from './socket-services';
import { Observable } from 'rxjs';
import { addregister, addwardlogin, deleteuser, resetpassword } from '../interfaces/register';
export interface register {
  loginname: string;
  password: string;
  departmentpostion: string;
  pname: string;
  fname: string;
  lname: string;
  wardcode: string;
  wardname: string;
}
@Injectable({
  providedIn: 'root',
})

export class RegisterServices {

  private socketSrv = inject(SocketServices)

  registerUser(payload: register): Observable<any> {
    this.socketSrv.emit('ward_user_register', payload);
    console.log('register', payload);
    return new Observable((observer) => {
      this.socketSrv.onreg('ward_user_register_result', (res: any) => {
        observer.next(res);
      });
    });
  }

  addregisterUser(payload: addregister): Observable<any> {
    this.socketSrv.emit('add_register_user', payload);
    console.log('register', payload);
    return new Observable((observer) => {
      this.socketSrv.onreg('add_register_user_result', (res: any) => {
        observer.next(res);
      });
    });
  }

  searchUser(fname: string, lname: string): Observable<any> {
    return new Observable((observer) => {
      this.socketSrv.emit('search_user', { fname, lname });

      // ใช้ once แทน on เพื่อรับครั้งเดียว
      this.socketSrv.onreg('search_user_result', (res: any) => {
        observer.next(res);
        observer.complete();
      });
    });
  }

  addwardlogin(payload: addwardlogin): Observable<any> {
    this.socketSrv.emit('add_ward_user_login', payload);
    // console.log('register', payload);
    return new Observable((observer) => {
      this.socketSrv.onreg('add_ward_user_login_result', (res: any) => {
        observer.next(res);
      });
    });
  }

  deleteuser(payload: deleteuser): Observable<any> {
    this.socketSrv.emit('delete_register_user', payload);
    // console.log('register', payload);
    return new Observable((observer) => {
      this.socketSrv.onreg('delete_register_user_result', (res: any) => {
        observer.next(res);
      });
    });
  }

  deleteaccount(payload: deleteuser): Observable<any> {
    this.socketSrv.emit('delete_account', payload);
    // console.log('register', payload);
    return new Observable((observer) => {
      this.socketSrv.onreg('delete_account_result', (res: any) => {
        observer.next(res);
      });
    });
  }

  resetpassword(payload: resetpassword): Observable<any> {
    this.socketSrv.emit('reset_password', payload);
    // console.log('register', payload);
    return new Observable((observer) => {
      this.socketSrv.onreg('reset_password_result', (res: any) => {
        observer.next(res);
      });
    });
  }

  getusernamereg(fname: string, lname: string): Promise<any> {

    this.socketSrv.emit('get_user_name_reg', { fname, lname });

    return this.socketSrv.fromOneTimeEvent<any>('user_name_reg');
  }

      private data: Partial<register > = {};

  setData(partial: Partial<register >) {
    this.data = { ...this.data, ...partial };
  }

  getData(): Partial<register > {
    return this.data;
  }

  clear() {
    this.data = {};
  }

}
