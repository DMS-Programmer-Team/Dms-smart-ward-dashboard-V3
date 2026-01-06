import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Footercomponent } from '../../footercomponent/footercomponent';
import { Router } from '@angular/router';
import { SwalServices } from '../../shared/services/swal-services';
import { RegisterServices } from '../../shared/services/register-services';

@Component({
  selector: 'app-register-component',
  imports: 
  [
      Footercomponent,
      CommonModule,
      FormsModule,
  ],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class RegisterComponent {

  username = '';
  password = '';
  confirmPassword = '';

  private router = inject(Router)
  private swalSrv = inject(SwalServices)
  private registerSrv = inject(RegisterServices)

  clicktologin() {
    this.swalSrv.loadingAlert({ title: 'Please wait', text: 'กำลังโหลด...' });
    this.router.navigate(['/login'])
  }

  // register.component.ts
  clicktoinformaintion() {
    // ตรวจสอบว่ากรอกครบหรือไม่
    if (!this.username || !this.password || !this.confirmPassword) {
      this.swalSrv.warningAlert({
        title: 'ข้อมูลไม่ครบ',
        text: 'กรุณากรอก username และ password ให้ครบทุกช่อง'
      });
      return;
    }

    // ตรวจสอบว่า password กับ confirmPassword ตรงกันหรือไม่
    if (this.password !== this.confirmPassword) {
      this.swalSrv.warningAlert({
        title: 'รหัสผ่านไม่ตรงกัน',
        text: 'กรุณากรอก Password และ Confirm Password ให้เหมือนกัน'
      });
      return;
    }

    // ถ้าผ่าน ตรวจสอบแล้วเก็บข้อมูลชั่วคราว
    this.registerSrv.setData({ loginname: this.username, password: this.password });

    this.swalSrv.loadingAlert({ title: 'Please wait', text: 'กำลังโหลด...' });
    this.router.navigate(['/datauser']); // ไปหน้า DatauserComponent
  }

}
