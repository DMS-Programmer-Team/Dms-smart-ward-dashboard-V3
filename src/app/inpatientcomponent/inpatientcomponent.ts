import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, interval } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { SocketServices } from '../shared/services/socket-services';
import { Dashboard, SummaryDashboard } from '../shared/interfaces/dashboard';
import { DashboarServices } from '../shared/services/dashboar-services';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ward } from '../shared/interfaces/ward';
import { WardServices } from '../shared/services/ward-services';
import { Detail, PackUnitDose } from '../shared/interfaces/detail';
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
export class Inpatientcomponent implements OnInit, OnDestroy {

  @ViewChild('detailModal') detailComp!: FromDetailComponent;
  @ViewChild('unitDoseModal') unitDoseModal!: FromDetailUnitDose;

  selectedWard: string = '000';
  selectedOrder!: Dashboard;
  orderDetails: Detail[] = [];
  packUnitDose: PackUnitDose[] = [];
  selectedDrug: Detail | null = null;
  dashboardList: Dashboard[] = [];
  wards: Ward[] = [];
  user!: User | undefined;
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
  private authSrv = inject(AuthServices);

  // ---- ตัวช่วยจัดการ lifecycle / debounce ----
  private destroy$ = new Subject<void>();
  private filterChange$ = new Subject<void>();

  ngOnInit() {

    this.user = this.authSrv.getUser();

    this.filters.ward = localStorage.getItem('selectedWard') || '000';
    this.filters.date = new Date().toISOString().substring(0, 10);

    // ยิงครั้งแรกทันที
    this.search();

    // debounce การพิมพ์ filter (hn / an / name) ไม่ให้ยิง search ทุกตัวอักษร
    this.filterChange$
      .pipe(debounceTime(400), takeUntil(this.destroy$))
      .subscribe(() => this.search());

    // polling แบบ cleanup ได้ (แทน setInterval เดิม)
    interval(2000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.search());

    this.wardSrv.getWardList();
    this.wardSrv.onWardList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.wards = res.msg;
        this.wardSrv.setWardLists(this.wards);
      });

    this.socket.fromEvent<LockerNotification>('locker-new')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        console.log('Locker new event:', data);

        if (data.wardcode === this.filters.ward) {
          console.log('Selected ward:', this.filters.ward, 'Incoming ward:', data.wardcode);
          this.showBadge = true;
        }

        if (data?.msg?.toLowerCase() === 'hello client') {
          console.log('Client connected message received', data);
        }
      });

    this.dashboardSrv.onDataOrderIPD()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
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

    this.dashboardSrv.onSummary()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
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
        }
      });

    // ---- ย้าย subscribe ของ detail มาไว้ที่เดียว ป้องกัน subscription ซ้อน ----
    this.dashboardSrv.ondetail()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res.status === 200) {
          this.orderDetails = [...res.msg];
          Swal.close();
          this.detailComp.open();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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

  // เรียกจาก (input) ของ hn/an/name ใน template แทนการยิง search() ตรง ๆ ทุก keyup
  onFilterInput() {
    this.filterChange$.next();
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
    return this.summary.state_0 + this.summary.state_1 + this.summary.state_2 + this.summary.state_4 + this.summary.state_5;
  }

  success() {
    return this.summary.state_3;
  }

  // เดิม subscribe ondetail() ซ้ำในนี้ -> ตัดออก เหลือแค่สั่ง emit เพราะ subscribe ทำครั้งเดียวใน ngOnInit แล้ว
  openDetail(item: Dashboard) {
    this.selectedOrder = item;
    this.orderDetails = [];

    this.swalSrv.loadingAlert2();
    this.dashboardSrv.getdetail(item.hn, item.order_number);
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

  // เดิม subscribe ondetail() ซ้ำในนี้ -> ตัดออกเช่นกัน เพราะ subscribe ทำครั้งเดียวใน ngOnInit แล้ว
  reloadDetail() {
    if (!this.selectedOrder) return;

    this.dashboardSrv.getdetail(
      this.selectedOrder.hn,
      this.selectedOrder.order_number
    );
  }

  clearBadge() {
    this.showBadge = false;
  }

  openUnitDoseModal() {
    if (!this.selectedOrder) return;

    this.detailComp.close();
    this.swalSrv.loadingAlert2();

    const hn = this.selectedOrder.hn;
    const order_number = this.selectedOrder.order_number;

    // ใช้ take(1) แบบเดิม (ครั้งเดียวแล้ว unsubscribe เอง) แต่ผูกกับ destroy$ ด้วยเพื่อความปลอดภัย
    const sub = this.socket.fromEvent<any>('order_pack_unitdose')
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        Swal.close();

        if (res.status === 200 && res.data?.length > 0) {
          this.unitDoseModal.packUnitDose = res.data.map((x: any) => ({
            pack_id: x.id,
            pack_number: x.pack_number,
            take_time: x.take_time,
            pack_image: x.pack_image
          }));

          this.unitDoseModal.selectedOrder = this.selectedOrder;
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

    const d = new Date(this.selectedOrder.order_date);
    const localDate = d.toLocaleDateString('en-CA'); // YYYY-MM-DD

    this.socket.emit('get_pack_unitdose', { hn, order_number, order_date: localDate });
    console.log("get_pack_unitdose", hn, order_number, localDate);
  }

  backToMain() {
    this.unitDoseModal.close();
    this.swalSrv.loadingAlert2();
    this.detailComp.open();
    Swal.close();
  }

  clicktohome() {
    this.swalSrv.loadingAlert({ title: 'Please wait', text: 'Searching for information' });
    this.router.navigate(['/home']).then(() => {
      window.location.reload();
    });
  }

  /////////////// PACK DRUG UNIT DOSE /////////////////////////
  handleSelectPack(event: { pack_number: number, hn: string }) {
    console.log('Selected pack:', event);
  }

  getOrderStateText(state: number): string {
    if (state < 3) {
      return 'รอรับเข้าระบบ';
    }

    if ([3, 4, 10, 11, 12].includes(state)) {
      return 'จัดยาเสร็จสิ้น';
    }

    if (state === 6) {
      return 'ตรวจสอบยาเสร็จสิ้น';
    }

    if (state === 8) {
      return 'นำส่งเสร็จสิ้น';
    }

    if (state === 13) {
      return 'เตรียมนำส่ง';
    }

    if ([14, 15, 16].includes(state)) {
      return 'กำลังนำส่ง';
    }

    return '-';
  }

  // เพิ่ม trackBy สำหรับ *ngFor เพื่อไม่ให้ Angular render ตารางใหม่ทั้งหมดทุกครั้งที่ dashboardList อัปเดต
  trackByOrder(index: number, item: Dashboard) {
    return item.hn + '_' + item.order_number;
  }
}