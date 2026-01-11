import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SocketServices } from '../shared/services/socket-services';
import { Dashboard, SummaryDashboard } from '../shared/interfaces/dashboard';
import { DashboarServices } from '../shared/services/dashboar-services';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ward } from '../shared/interfaces/ward';
import { WardServices } from '../shared/services/ward-services';
import { Detail,  PackUnitDose } from '../shared/interfaces/detail';
import { FromDetailComponent } from '../modal/from-detail-component/from-detail-component';
import { SwalServices } from '../shared/services/swal-services';
import Swal from 'sweetalert2';
import { AuthServices } from '../shared/services/auth-services';
import { User } from '../shared/interfaces/user';
import { FromDetailUnitDose } from '../modal/from-detail-unit-dose/from-detail-unit-dose';
import { LockerNotification } from '../shared/interfaces/lockernotidication';


@Component({
  selector: 'app-inpatientcomponent',
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    FromDetailComponent,
    FromDetailUnitDose
  ],
  templateUrl: './inpatientcomponent.html',
  styleUrl: './inpatientcomponent.css',
})
export class Inpatientcomponent {

  @ViewChild('detailModal') detailComp!: FromDetailComponent;
  @ViewChild('unitDoseModal') unitDoseModal!: FromDetailUnitDose;



  selectedWard: string = '000';
  selectedOrder!: Dashboard;
  orderDetails: Detail[] = [];
  packUnitDose: PackUnitDose[] = [];
  selectedDrug: Detail | null = null;
  dashboardList: Dashboard[] = [];
  wards: Ward[] = [];
  user!: User | undefined
  selectedStateCard: number | null = null;
  showBadge: boolean = false;

  pages: number = 1;
  itemsPerPage: number = 10;

  filters = {
    ward: '000',
    hn: '',
    an: '',
    name: '',
    date: '',
    orderState: null as number | null
  };

  summary: SummaryDashboard = {
    state_0: 0,
    state_1: 0,
    state_2: 0,
    state_3: 0,
    state_4: 0,
    state_5: 0
  };


  private router = inject(Router);
  private socket = inject(SocketServices);
  private dashboardSrv = inject(DashboarServices);
  private wardSrv = inject(WardServices);
  private swalSrv = inject(SwalServices);
  private authSrv = inject(AuthServices)

  ngOnInit() {

    this.user = this.authSrv.getUser()

    this.filters.ward = localStorage.getItem('selectedWard') || '000';
    this.filters.date = new Date().toISOString().substring(0, 10);

    this.search();

    setInterval(() => {
      this.search();
    }, 2000);

    this.wardSrv.getWardList();
    this.wardSrv.onWardList().subscribe((res: any) => {
      this.wards = res.msg;
      this.wardSrv.setWardLists(this.wards);
    });

    this.socket.fromEvent<LockerNotification>('locker-new').subscribe((data) => {
      console.log('Locker new event:', data);

      //  แสดง badge เฉพาะ ward ที่ตรงกับ wardValue
      if (data.wardcode === this.selectedWard) {
        console.log('Selected ward:', this.selectedWard, 'Incoming ward:', data.wardcode);
        this.showBadge = true;
      }

      // ตัวอย่างกรณี hello client
      if (data?.msg?.toLowerCase() === 'hello client') {
        console.log('Client connected message received', data);
        // สามารถโชว์ Swal หรือ handle อื่นๆ ได้
      }
    });

    this.dashboardSrv.onDataOrderIPD().subscribe(res => {
      // console.log("onDataOrderIPD", res);
      if (res.status === 200) {
        const currentPage = this.pages;
        this.dashboardList = res.msg;

        const maxPage = Math.ceil(this.dashboardList.length / this.itemsPerPage);
        this.pages = currentPage <= maxPage ? currentPage : 1;
      } else {
        this.dashboardList = [];
        this.pages = 1;
      }
    });

    this.dashboardSrv.onSummary().subscribe(res => {
      if (res.status === 200 && res.msg) {
        const raw = res.msg;

        this.summary = {
          state_0: Number(raw.state_0_count),
          state_1: Number(raw.state_1_count),
          state_2: Number(raw.state_2_count),
          state_3: Number(raw.state_3_count),
          state_4: Number(raw.state_4_count),
          state_5: Number(raw.state_5_count),
        };

        // console.log('summary (mapped)', this.summary);
      }
    });




  }

  loadDashboard() {
    this.socket.emit('get_dataorder_ipd', {
      ward: this.selectedWard
    });
  }

  search() {
    this.socket.emit('get_dataorder_ipd', {
      ward: this.filters.ward,
      hn: this.filters.hn,
      an: this.filters.an,
      name: this.filters.name,
      date: this.filters.date,
      orderState: this.filters.orderState
    });

    this.dashboardSrv.getSummary(this.filters);
  }


  resetFilter() {
    this.filters = {
      ward: '000',
      hn: '',
      an: '',
      name: '',
      date: new Date().toISOString().substring(0, 10),
      orderState: null
    };

    this.search();
  }

  filterByState(state: number | null) {
    this.selectedStateCard = state;
    this.filters.orderState = state;
    this.search();
  }

  allsum() {
    return this.summary.state_0 + this.summary.state_1 + this.summary.state_2 + this.summary.state_3 + this.summary.state_4 + this.summary.state_5;
  }

  waiting() {
    return this.summary.state_0 + this.summary.state_1 + this.summary.state_2 + this.summary.state_4 + this.summary.state_5
  }

  success() {
    return this.summary.state_3
  }

  async openDetail(item: Dashboard) {

    // console.log("openDetail item", item);
    this.selectedOrder = item;
    this.orderDetails = [];

    this.swalSrv.loadingAlert2();
    this.dashboardSrv.getdetail(item.hn, item.order_number);

    this.dashboardSrv.ondetail().subscribe(res => {
      // console.log("ondetail res", res);

      if (res.status === 200) {
        this.orderDetails = [...res.msg];
        Swal.close();
        this.detailComp.open();
        // console.log('detailComp', this.detailComp);
      }
    });
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

    // ถ้า login ปกติ → logout
    if (this.authSrv.getUser()) {
      this.authSrv.logout();
    } else {
      // ถ้าไม่ได้ login ปกติ → redirect กลับ login page
      this.router.navigate(['/login']);
    }
  }

  reloadDetail() {
    if (!this.selectedOrder) return;

    this.dashboardSrv.getdetail(
      this.selectedOrder.hn,
      this.selectedOrder.order_number
    );

    this.dashboardSrv.ondetail().subscribe(res => {
      if (res.status === 200) {
        this.orderDetails = [...res.msg];
      }
    });
  }

  clearBadge() {
    this.showBadge = false;
  }

  openUnitDoseModal() {
    if (!this.selectedOrder) return;

    // ปิด modal หลัก
    this.detailComp.close();

    // แสดง loading
    this.swalSrv.loadingAlert2();

    const hn = this.selectedOrder.hn;
    const order_number = this.selectedOrder.order_number;

const sub = this.socket.fromEvent<any>('order_pack_unitdose')
  .subscribe(res => {
    Swal.close(); // ปิด loading

    if (res.status === 200 && res.data?.length > 0) {

      // ส่งข้อมูลทั้งหมดให้ modal
      this.unitDoseModal.packUnitDose = res.data.map((x: any) => ({
        pack_id: x.id,
        pack_number: x.pack_number,
        take_time: x.take_time,
        pack_image: x.pack_image
      }));

      this.unitDoseModal.selectedOrder = this.selectedOrder;

      // เปิด modal
      this.unitDoseModal.open();

    } else {
      this.unitDoseModal.packUnitDose = [];
      this.swalSrv.infoAlert({
        title: 'ไม่พบยา UNIT DOSE',
        text: 'รายการนี้ไม่มีข้อมูล UNIT DOSE'
      });
    }

    sub.unsubscribe();
  });


    // ส่ง request ไป server
    this.socket.emit('get_pack_unitdose', { hn, order_number, order_date: this.selectedOrder.order_date });
  }


  backToMain() {
    this.unitDoseModal.close();   // ปิด unit dose
    this.swalSrv.loadingAlert2();
    this.detailComp.open();      // เปิด modal หลักกลับ
    Swal.close();
  }



  clicktohome() {
    this.swalSrv.loadingAlert({
      title: 'Please wait',
      text: 'Reloading page...'
    });
    setTimeout(() => {
      window.location.href = '/home';
    }, 1500);
  }


/////////////// PACK DRUG UNIT DOSE /////////////////////////
handleSelectPack(event: { pack_number: number, hn: string }) {
  console.log('Selected pack:', event);
   
}




  



}
