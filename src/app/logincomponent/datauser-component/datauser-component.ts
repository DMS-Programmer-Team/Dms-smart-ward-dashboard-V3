import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Footercomponent } from '../../footercomponent/footercomponent';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SwalServices } from '../../shared/services/swal-services';
import { WardServices } from '../../shared/services/ward-services';
import { register, RegisterServices } from '../../shared/services/register-services';

@Component({
  selector: 'app-datauser-component',
  imports:
    [
      Footercomponent,
      CommonModule,
      FormsModule,
    ],
  templateUrl: './datauser-component.html',
  styleUrl: './datauser-component.css',
})
export class DatauserComponent {
  wards: any[] = [];

  pname = '';
  fname = '';
  lname = '';
  wardcode = '';
  wardname = '';
  departmentpostion = '';
  loginname = '';
  password = '';

  private router = inject(Router)
  private swalSrv = inject(SwalServices)
  private listwardSrv = inject(WardServices)
  private registerSrv = inject(RegisterServices)



  ngOnInit() {
    this.listwardSrv.getWardList().subscribe((wards) => {
      this.wards = wards;
      console.log('Wards loaded:', this.wards);
    });

    const savedData = this.registerSrv.getData();
    if (savedData) {
      this.loginname = savedData.loginname ?? '';
      this.password = savedData.password ?? '';
    }

  }

  loadUserData() {
    const fnameClean = this.fname?.trim();
    const lnameClean = this.lname?.trim();

    if (fnameClean && lnameClean) {
      this.registerSrv.getusernamereg(fnameClean, lnameClean)
        .then(res => {
          if (res.status === 200 && res.data) {
            this.departmentpostion = res.data.departmentpostion || '';
            this.wardcode = res.data.wardcode || '';
            this.wardname = res.data.wardname || '';
          } else {
            console.log('ไม่พบข้อมูลผู้ใช้:', res.msg);
          }
        })
        .catch(err => console.error('Socket error:', err));
    }
  }


  submitRegister() {
    if (!this.pname || !this.fname || !this.lname || !this.departmentpostion || !this.wardcode) {
      this.swalSrv.warningAlert({ title: 'กรอกข้อมูลไม่ครบ', text: 'กรุณากรอกทุกช่อง' });
      return;
    }

    // หาชื่อ wardname จาก wardcode
    const selectedWard = this.wards.find(w => w.wardcode === this.wardcode);
    this.wardname = selectedWard ? selectedWard.wardname : '';

    const payload: register = {
      loginname: this.loginname,
      password: this.password,
      departmentpostion: this.departmentpostion,
      pname: this.pname,
      fname: this.fname,
      lname: this.lname,
      wardcode: this.wardcode,
      wardname: this.wardname
    };

    this.registerSrv.registerUser(payload).subscribe(res => {
      console.log(res);
      if (res.status === 200) {
        const rfId = res.user?.rf_id;
        localStorage.setItem('rfId', rfId);
        this.swalSrv.successAlert({ title: 'สมัครสำเร็จ', text: 'คุณสามารถเข้าสู่ระบบได้', timer: 2000 });
        this.router.navigate(['/genqrcode'])
        console.log('genqrcode:', rfId);
      } else {
        let errorMsg = '';
        if (typeof res.msg === 'string') {
          errorMsg = res.msg;
        } else if (res.msg && res.msg.message) {
          errorMsg = res.msg.message;
        } else {
          errorMsg = JSON.stringify(res.msg);
        }
        this.swalSrv.errorAlert({ title: 'เกิดข้อผิดพลาด', text: 'ไม่มีข้อมูลในระบบ โปรดติดต่อเจ้าหน้าที่ห้องยา IPD' });
      }
    });

  }

  clicktoregister() {
    this.swalSrv.loadingAlert({ title: 'Please wait', text: 'กำลังโหลด...' });
    this.router.navigate(['/register'])
  }

}
