import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Footercomponent } from '../../../footercomponent/footercomponent';
import { CommonModule } from '@angular/common';
import { SwalServices } from '../../../shared/services/swal-services';
import { Router } from '@angular/router';
import { WardServices } from '../../../shared/services/ward-services';
import { RegisterDataServices } from '../../../shared/services/register-data-services';
import { RegisterServices } from '../../../shared/services/register-services';
import { addwardlogin } from '../../../shared/interfaces/register';

@Component({
  selector: 'app-addwarduser-component',
  imports: 
  [
    FormsModule,
    CommonModule,
    Footercomponent
  ],
  templateUrl: './addwarduser-component.html',
  styleUrl: './addwarduser-component.css',
})
export class AddwarduserComponent {

  
  wards: any[] = [];
  fname = ''
  lname = ''
  wardcode = '';
  wardname = '';
  username = '';


  private swalSrv = inject(SwalServices)
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
    this.swalSrv.loadingAlert({ title: 'Please wait', text: 'กำลังโหลด...' });
    this.router.navigate(['/pageadmin']);
  }

  searchuser() {

    console.log(" searchuser() ถูกเรียกแล้ว");
    if (!this.fname || !this.lname) {
      this.swalSrv.errorAlert({ title: 'กรุณากรอกชื่อและนามสกุล' });
      return;
    }

    this.registerSrv.searchUser(this.fname, this.lname).subscribe({
      next: (res) => {
        if (res.data) {
          this.username = res.data.loginname;
          this.swalSrv.successAlert({ title: 'สำเร็จ', text: 'พบข้อมูลผู้ใช้', timer: 2000 });
        } else {
          this.username = '';
          this.swalSrv.errorAlert({ title: 'ไม่พบข้อมูลผู้ใช้' });
        }
        console.log('searchUser response:', res);
      },
      error: (err) => {
        console.error(err);
        this.swalSrv.errorAlert({ title: 'เกิดข้อผิดพลาดในระบบ' });
      }
    });
  }


  submitaddward() {
    console.log(" submitaddward() ถูกเรียกแล้ว");
    if (!this.username || !this.wardcode) {
      this.swalSrv.errorAlert({ title: 'กรุณากรอกวอร์ด' });
      return;
    }

    // หาชื่อ wardname จาก wardcode
    const selectedWard = this.wards.find(w => w.wardcode === this.wardcode);
    this.wardname = selectedWard ? selectedWard.wardname : '';

    const payload: addwardlogin = {
      login_name: this.username,
      login_ward: this.wardcode,

    };

    console.log('submitaddward:', payload);


    this.registerSrv.addwardlogin(payload).subscribe(res => {
      console.log(res);
      if (res.status === 200) {
        this.swalSrv.successAlert({ title: 'สมัครสำเร็จ', text: 'คุณสามารถเข้าสู่ระบบได้', timer: 2000 });
      } else if (res.status === 400) {
      // แสดงข้อความจาก backend เช่น "วอร์ด 042 มีผู้ใช้งานแล้ว"
      this.swalSrv.errorAlert({ title: 'เกิดข้อผิดพลาด', text: res.msg });
    } else {
      // กรณีอื่น ๆ
      let errorMsg = '';
      if (typeof res.msg === 'string') {
        errorMsg = res.msg;
      } else if (res.msg && res.msg.message) {
        errorMsg = res.msg.message;
      } else {
        errorMsg = JSON.stringify(res.msg);
      }
      this.swalSrv.errorAlert({ title: 'เกิดข้อผิดพลาด', text: errorMsg });
    }
    });
  }


}
