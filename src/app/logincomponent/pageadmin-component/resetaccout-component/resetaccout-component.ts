import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Footercomponent } from '../../../footercomponent/footercomponent';
import { SwalServices } from '../../../shared/services/swal-services';
import { Router } from '@angular/router';
import { WardServices } from '../../../shared/services/ward-services';
import { RegisterComponent } from '../../register-component/register-component';
import { RegisterServices } from '../../../shared/services/register-services';

@Component({
  selector: 'app-resetaccout-component',
  imports: 
  [
      FormsModule,
      CommonModule,
      Footercomponent
    ],
  templateUrl: './resetaccout-component.html',
  styleUrl: './resetaccout-component.css',
})
export class ResetaccoutComponent {

  wards: any[] = [];
  fname = ''
  lname = ''
  wardcode = '';
  wardname = '';
  username = '';
  refname = '';
  relname = '';
  pass = '';

  private swalSrv = inject(SwalServices);
  private router = inject(Router)
  private listwardSrv = inject(WardServices)
  private registerSrv = inject(RegisterServices)

    ngOnInit() {
    this.listwardSrv.getWardList().subscribe((wards) => {
      this.wards = wards;
      console.log('Wards loaded:', this.wards);
    });
  }

  clicktopageadmin() {
    console.log('ไปหน้า pageadmin');
    this.swalSrv.loadingAlert({ title: 'Please wait', text: 'กำลังโหลด...' });
    this.router.navigate(['/pageadmin']);
  }

submitresetaccount() {
  if (!this.fname || !this.lname) {
    this.swalSrv.warningAlert({
      title: 'กรอกข้อมูลไม่ครบ',
      text: 'กรุณากรอกชื่อ นามสกุล'
    });
    return;
  }

  this.swalSrv.loadingAlert({ title: 'กำลังลบข้อมูล...', text: 'โปรดรอสักครู่' });

  const payload = { fname: this.fname, lname: this.lname };
  console.log('Payload ที่ส่งไป backend:', payload);

  this.registerSrv.deleteaccount(payload).subscribe({
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
}
