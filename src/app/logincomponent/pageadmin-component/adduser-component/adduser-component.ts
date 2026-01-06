import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Footercomponent } from '../../../footercomponent/footercomponent';
import { SwalServices } from '../../../shared/services/swal-services';
import { Router } from '@angular/router';
import { WardServices } from '../../../shared/services/ward-services';
import { RegisterServices } from '../../../shared/services/register-services';
import { addregister } from '../../../shared/interfaces/register';

@Component({
  selector: 'app-adduser-component',
  imports: 
  [
    FormsModule,
    CommonModule,
    Footercomponent
  ],
  templateUrl: './adduser-component.html',
  styleUrl: './adduser-component.css',
})
export class AdduserComponent {

   wards: any[] = [];
  pname = '';
  fname = '';
  lname = '';
  wardcode = '';
  wardname = '';
  departmentpostion = '';
  loginname = '';
  password = '';

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

  submitRegister() {
    if (!this.pname || !this.fname || !this.lname || !this.departmentpostion || !this.wardcode) {
      this.swalSrv.warningAlert({ title: 'กรอกข้อมูลไม่ครบ', text: 'กรุณากรอกทุกช่อง' });
      return;
    }

    // หาชื่อ wardname จาก wardcode
    const selectedWard = this.wards.find(w => w.wardcode === this.wardcode);
    this.wardname = selectedWard ? selectedWard.wardname : '';

const payload: addregister = {
  reg_pname: this.pname,
  reg_fname: this.fname,
  reg_lname: this.lname,
  reg_position: this.departmentpostion, // ⚠️ เปลี่ยนชื่อให้ตรงกับ backend
  reg_ward: this.wardcode,
  reg_wardname: this.wardname
};


    console.log('Submitting registration with payload:', payload);

    this.registerSrv.addregisterUser(payload).subscribe(res => {
      console.log(res);
      if (res.status === 200) {
        this.swalSrv.successAlert({ title: 'สมัครสำเร็จ', text: 'คุณสามารถเข้าสู่ระบบได้', timer: 2000 });
      } else {
        let errorMsg = '';
        if (typeof res.msg === 'string') {
          errorMsg = res.msg;
        } else if (res.msg && res.msg.message) {
          errorMsg = res.msg.message;
        } else {
          errorMsg = JSON.stringify(res.msg);
        }
        this.swalSrv.errorAlert({ title: 'เกิดข้อผิดพลาด', text: 'โปรดติดต่อผู้ดูแลโปรแกรม' });
      }
    });

  }

}
