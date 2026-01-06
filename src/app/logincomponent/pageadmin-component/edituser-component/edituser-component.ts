import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Footercomponent } from '../../../footercomponent/footercomponent';
import { SwalServices } from '../../../shared/services/swal-services';
import { Router } from '@angular/router';
import { WardServices } from '../../../shared/services/ward-services';
import { RegisterServices } from '../../../shared/services/register-services';

@Component({
  selector: 'app-edituser-component',
  imports: 
  [
          FormsModule,
      CommonModule,
      Footercomponent
  ],
  templateUrl: './edituser-component.html',
  styleUrl: './edituser-component.css',
})
export class EdituserComponent {

   wards: any[] = [];
  fname = ''
  lname = ''
  wardcode = '';
  wardname = '';
  username = '';
  refname = '';
  relname = '';
  pass = '';

  private swalSrv = inject(SwalServices)
  private router = inject(Router)
  private listwardSrv = inject(WardServices)
  private registerSrv = inject(RegisterServices)

  clicktopageadmin() {
    this.swalSrv.loadingAlert({ title: 'Please wait', text: 'กำลังโหลด...' });
    this.router.navigate(['/pageadmin']);
  }

submitdeleate() {
  if (!this.fname || !this.lname) {
    this.swalSrv.warningAlert({
      title: 'กรอกข้อมูลไม่ครบ',
      text: 'กรุณากรอกชื่อและนามสกุล'
    });
    return;
  }

  this.swalSrv.loadingAlert({ title: 'กำลังลบข้อมูล...', text: 'โปรดรอสักครู่' });

  const payload = { fname: this.fname, lname: this.lname };
  console.log('Payload ที่ส่งไป backend:', payload);

  this.registerSrv.deleteuser(payload).subscribe({
    next: (res) => {
      console.log('Response จาก backend:', res);

      const registerLen = res.data?.register?.length || 0;
      const userLen = res.data?.user?.length || 0;
      const loginLen = res.data?.login?.length || 0;

      console.log('จำนวนแถวที่ลบ - register:', registerLen, 'user:', userLen, 'login:', loginLen);

      if (res.status === 200 && (registerLen > 0 || userLen > 0 || loginLen > 0)) {
        this.swalSrv.successAlert({
          title: 'ลบเรียบร้อย',
          text: res.msg,
          timer: 2000
        });
        this.fname = '';
        this.lname = '';
      } else if (res.status === 404) {
        this.swalSrv.warningAlert({
          title: 'ไม่พบข้อมูล',
          text: res.msg || `ไม่พบผู้ใช้ชื่อ ${this.fname} ${this.lname}`
        });
      } else {
        this.swalSrv.errorAlert({
          title: 'เกิดข้อผิดพลาด',
          text: res.msg || 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ'
        });
      }
    },

    error: (err) => {
      console.error('Error จาก Observable:', err);
      this.swalSrv.errorAlert({
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถลบข้อมูลได้'
      });
    }
  });
}

submitedit() {
  console.log("submitedit() ถูกเรียกแล้ว");

  // 1) ตรวจสอบข้อมูลให้ครบ
  if (!this.refname || !this.relname || !this.pass) {
    this.swalSrv.warningAlert({
      title: 'กรอกข้อมูลไม่ครบ',
      text: 'กรุณากรอกชื่อ นามสกุล และรหัสผ่านใหม่'
    });
    return;
  }

  // 2) สร้าง payload ตาม interface resetpassword
  const payload = {
    fname: this.refname,
    lname: this.relname,
    password: this.pass
  };

  console.log("ส่ง payload reset:", payload);

  // 3) เรียก service
  this.swalSrv.loadingAlert({ title: 'กำลังแก้ไขรหัสผ่าน...', text: 'โปรดรอสักครู่' });

  this.registerSrv.resetpassword(payload).subscribe({
    next: (res) => {
      // console.log("reset password result:", res);

      if (res.status === 200) {
        this.swalSrv.successAlert({
          title: 'สำเร็จ',
          text: res.msg,
          timer: 2000
        });

        // ล้างค่า
        this.refname = '';
        this.relname = '';
        this.pass = '';
      } 
      else if (res.status === 404) {
        this.swalSrv.warningAlert({
          title: 'ไม่พบข้อมูลผู้ใช้',
          text: res.msg
        });
      } 
      else {
        this.swalSrv.errorAlert({
          title: 'เกิดข้อผิดพลาด',
          text: res.msg || 'ไม่สามารถรีเซ็ตรหัสผ่านได้'
        });
      }
    },

    error: (err) => {
      console.error("ERROR:", err);

      this.swalSrv.errorAlert({
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถเชื่อมต่อระบบได้'
      });
    }
  });
}


}
