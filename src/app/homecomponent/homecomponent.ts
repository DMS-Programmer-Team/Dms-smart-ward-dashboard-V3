import { Component, inject, OnInit } from '@angular/core';
import { Footercomponent } from '../footercomponent/footercomponent';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WardServices } from '../shared/services/ward-services';
import { SocketServices } from '../shared/services/socket-services';
import { Ward } from '../shared/interfaces/ward';
import { AuthServices } from '../shared/services/auth-services';
import { User } from '../shared/interfaces/user';
import { SwalServices } from '../shared/services/swal-services';
import Swal from 'sweetalert2';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-homecomponent',
  imports:
    [
      CommonModule,
      Footercomponent,
      FormsModule
    ],
  templateUrl: './homecomponent.html',
  styleUrl: './homecomponent.css',
})
export class Homecomponent implements OnInit {

  wards: Ward[] = [];
  selectedWard = '000'
  user!: User | undefined

  private router = inject(Router);
  private wardSrv = inject(WardServices);
  private socketSrv = inject(SocketServices);
  private authSrv = inject(AuthServices);
  private swalSrv = inject(SwalServices);

ngOnInit(): void {
  this.user = this.authSrv.getUser();

  if (this.user?.wardcode) {
    this.selectedWard = this.user.wardcode;
  }

  this.loadWardList();
}



  loadWardList(): void {
    this.wardSrv.getWardList();
    this.wardSrv.onWardList().subscribe((res: any) => {
      this.wards = res.msg;
      this.wardSrv.setWardLists(this.wards);
    });

  }

  async clicktoipd() {
    localStorage.setItem('selectedWard', this.selectedWard);
    this.swalSrv.loadingAlert({ title: 'Please wait', text: 'กำลังโหลด...' });
    setTimeout(() => {
      this.router.navigate(['/inpatient']);
    }, 1500);

  }

  clciktoipdhome() {
    localStorage.setItem('selectedWard', this.selectedWard);
    this.swalSrv.loadingAlert({ title: 'Please wait', text: 'กำลังโหลด...' });
    setTimeout(() => {
      this.router.navigate(['/discharge']);
    }, 1500);
  }

  async clicktologout() {
    const result = await this.swalSrv.confirmAlert({
      title: 'ออกจากระบบ?',
      text: 'คุณต้องการออกจากระบบหรือไม่?',
      icon: 'question',
      confirmText: 'ออกจากระบบ',
      cancelText: 'ยกเลิก',
    });

    if (!result) return;

    if (this.authSrv.getUser()) {
      this.authSrv.logout();
    } else {
      this.router.navigate(['/login']);
    }
  }

  async clickcheckqrcode() {
    if (!this.user) {
      this.swalSrv.errorAlert({ title: 'เกิดข้อผิดพลาด', text: 'กรุณา LOGIN' });
      return;
    }
    await Swal.fire({
      title: 'QR CODE ของคุณ',
      html: `
      <div class="flex flex-col items-center justify-center">
        <div class="p-4 bg-linear-to-br from-[#E0F7FA] to-[#B2EBF2] rounded-2xl shadow-inner border-4 border-[#2292AD]">
        <img src="https://api.qrserver.com/v1/create-qr-code/?data=${this.user!.rf_id}&size=180x180" 
             alt="QR Code" style="margin: 10px; border-radius: 10px; text-align: center;" />
      </div>
      <p class="text-center text-gray-600 mt-6 text-lg font-medium">
                    RF_ID : <span class="text-[#2292AD] font-bold">${this.user!.rf_id}</span>
                </p>
      </div>
    `,
      showConfirmButton: false,
      showCloseButton: true, // 🔹 ปุ่มกากบาทปิด
      background: '#fff',
      width: 800,
    });

    console.log("qrcode", this.user!.rf_id);

  }

}