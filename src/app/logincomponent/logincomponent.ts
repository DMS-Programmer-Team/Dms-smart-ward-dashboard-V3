import { Component, inject, OnInit } from '@angular/core';
import { Footercomponent } from '../footercomponent/footercomponent';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SwalServices } from '../shared/services/swal-services';
import { AuthServices } from '../shared/services/auth-services';
import { DashboarServices } from '../shared/services/dashboar-services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-logincomponent',
  imports: 
  [
    Footercomponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './logincomponent.html',
  styleUrl: './logincomponent.css',
})
export class Logincomponent implements OnInit {

  isAdminModalOpen = false;
  adminCode = '';
  loginname = '';
  password = '';
  isModalOpen = false;

  private router = inject(Router)
  private swalSrv = inject(SwalServices)
  private authSrv = inject(AuthServices)
  private dashboardSrv = inject(DashboarServices)

  ngOnInit(): void {
    if (!this.authSrv.userLogin ) {
      this.router.navigate(['/login']);
    }
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
  async clicktologin() {
    if ( !this.password) {
      this.swalSrv.warningAlert({ title: 'กรอกไม่ครบ', text: 'กรุณากรอก username และ password' });
      return;
    }

    this.swalSrv.loadingAlert({ title: 'Please wait', text: 'กำลังตรวจสอบ...' });

    try {
      const res = await this.authSrv.userLogin( this.password);
      Swal.close();

      if (res.status === 200) {
        this.authSrv.setUser(res.msg);
        this.swalSrv.successAlert({ title: 'เข้าสู่ระบบสำเร็จ', timer: 1500 });
        this.router.navigate(['/home']);
      } else {
        this.swalSrv.errorAlert({ title: 'ล้มเหลว', text: res.msg });
      }

    } catch (err) {
      Swal.close();
      this.swalSrv.errorAlert({ title: 'เกิดข้อผิดพลาด', text: 'ไม่สามารถเชื่อมต่อระบบได้' });
      console.error(err);
    }
  }


  clicktoRegister() {
    this.swalSrv.loadingAlert({ title: 'Please wait', text: 'กำลังโหลด...' });
    this.router.navigate(['/register'])
    console.log('clicktoRegister');
  }


  clicktohome() {
    this.swalSrv.loadingAlert({ title: 'Please wait', text: 'กำลังโหลด...' });
    this.router.navigate(['/home'])
    console.log('clicktohome');
  }






}
