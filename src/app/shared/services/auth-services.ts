import { inject, Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { Router } from '@angular/router';
import { SocketServices } from './socket-services';
import { ResponseData } from '../interfaces/response-data';

@Injectable({
  providedIn: 'root',
})
export class AuthServices {

  user!: User | undefined

  private router = inject(Router);
  private socketSrv = inject(SocketServices);

    isWardSelected() {
    return true;
  }

  async userLogin(loginname: string, password: string): Promise<ResponseData> {
    await this.socketSrv.emit('ward_user_login', { loginname, password });
    return this.socketSrv.fromOneTimeEvent<ResponseData>('ward_user_login_result');
  }

  setUser(data: User | undefined = undefined) {
    this.user = data;

    if (data) {
      localStorage.setItem('ward_user', JSON.stringify(data));
      if (data.wardcode) localStorage.setItem('wardcode', data.wardcode);
    } else {
      localStorage.removeItem('ward_user');
      localStorage.removeItem('wardcode');
    }
  }

  getUser(): User | undefined {
    if (!this.user) {
      const userStr = localStorage.getItem('ward_user');
      if (userStr) this.user = JSON.parse(userStr);
    }
    return this.user;
  }


  logout() {
    this.setUser(undefined);
    localStorage.removeItem('ward_user');
    localStorage.removeItem('wardcode'); 
    this.setUser()
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}
