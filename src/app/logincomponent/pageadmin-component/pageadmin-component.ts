import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Footercomponent } from '../../footercomponent/footercomponent';
import { Router } from '@angular/router';
import { SwalServices } from '../../shared/services/swal-services';

@Component({
  selector: 'app-pageadmin-component',
  imports: 
  [
    Footercomponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './pageadmin-component.html',
  styleUrl: './pageadmin-component.css',
})
export class PageadminComponent {

   private roter = inject(Router)
  private swalSrv = inject(SwalServices)

  clciktoadduser() {
    this.swalSrv.loadingAlert({ title: 'Please wait', text: 'กำลังโหลด...' });
    this.roter.navigate(['/adduser']);
  }

    clciktoaddwarduser() {
    this.swalSrv.loadingAlert({ title: 'Please wait', text: 'กำลังโหลด...' });
    this.roter.navigate(['/addwardsuser']);
  }

  clciktoedituser(){
    this.swalSrv.loadingAlert({ title: 'Please wait', text: 'กำลังโหลด...' });
    this.roter.navigate(['/edituser']);
  }

    clciktoresetaccount(){
    this.swalSrv.loadingAlert({ title: 'Please wait', text: 'กำลังโหลด...' });
    this.roter.navigate(['/resetaccount']);
  }
  logout() {
    console.log('logout ถูกเรียกแล้ว');
    this.swalSrv.loadingAlert({ title: 'Please wait', text: 'กำลังออกจากระบบ...' });
    this.roter.navigate(['/login']);
  }
  
}
