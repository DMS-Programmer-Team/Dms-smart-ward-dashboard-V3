import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';
import { SocketServices } from '../shared/services/socket-services';
import { Dashboard, SummaryDashboard } from '../shared/interfaces/dashboard';
import { DashboarServices } from '../shared/services/dashboar-services';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ward } from '../shared/interfaces/ward';
import { WardServices } from '../shared/services/ward-services';
import { ApproveSmartWard, CreateTimeLocker, Detail, OrderSmartward, PackUnitDose } from '../shared/interfaces/detail';
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
  createTimeLocker: CreateTimeLocker | null = null;
  inLockerTime: Date | null = null;
  outLockerTime: Date | null = null;
  inLockerFname: string = '';
  inLockerLname: string = '';
  outLockerFname: string = '';
  outLockerLname: string = '';
  approveSmartWard: ApproveSmartWard | null = null

  pages: number = 1;
  itemsPerPage: number = 10;

  notifications: (LockerNotification & { id: string })[] = [];
  smartWardNotifications: (OrderSmartward & { id: string })[] = [];

  filters = {
    ward: '000',
    hn: '',
    an: '',
    name: '',
    date: '',
    order_type: '',
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

  // ---- FIX 2: debounce search instead of firing on every keystroke ----
  private searchSubject = new Subject<void>();

  // ---- Track all subscriptions / intervals so we can clean them up ----
  private subs = new Subscription();
  private pollIntervalId: any;
  private smartWardIntervalId: any;

  ngOnInit() {

    this.user = this.authSrv.getUser();

    this.filters.ward = localStorage.getItem('selectedWard') || '000';
    this.filters.date = new Date().toISOString().substring(0, 10);

    // debounced search trigger (fixes typing flicker)
    this.subs.add(
      this.searchSubject.pipe(debounceTime(400)).subscribe(() => {
        this.doSearch();
      })
    );

    this.doSearch();

    // Poll dashboard every 2s. Kept, but now coexists safely with
    // debounced manual search because both funnel through doSearch().
    this.pollIntervalId = setInterval(() => {
      this.doSearch();
    }, 2000);

    this.wardSrv.getWardList();
    this.subs.add(
      this.wardSrv.onWardList().subscribe((res: any) => {
        this.wards = res.msg;
        this.wardSrv.setWardLists(this.wards);
      })
    );

    this.reqsmartward();

    this.subs.add(
      this.socket.fromEvent<LockerNotification>('locker-new').subscribe((data) => {
        if (data.wardcode === this.filters.ward) {
          const exists = this.notifications.some(
            x => JSON.stringify(x.order_number) === JSON.stringify(data.order_number)
          );
          if (!exists) {
            this.notifications.unshift({
              ...data,
              id: Date.now().toString()
            });
          }
        }
      })
    );

    this.subs.add(
      this.dashboardSrv.onDataOrderIPD().subscribe(res => {
        if (res.status === 200) {
          const currentPage = this.pages;
          this.dashboardList = res.msg;

          const maxPage = Math.ceil(this.dashboardList.length / this.itemsPerPage);
          this.pages = currentPage <= maxPage ? currentPage : 1;
        } else {
          this.dashboardList = [];
          this.pages = 1;
        }
      })
    );

    this.subs.add(
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
        }
      })
    );

this.subs.add(
  this.dashboardSrv.oncreateatlocker().subscribe(res => {
    console.log('oncreateatlocker', res);

    if (res.status === 200 && res.data?.length) {
      const inLocker = res.data.find((x: any) => x.lock_state === 1);
      const outLocker = res.data.find((x: any) => x.lock_state === 2 || x.lock_state === 3);

      this.inLockerTime = inLocker?.create_at ?? null;
      this.inLockerFname = inLocker?.fname ?? '';
      this.inLockerLname = inLocker?.lname ?? '';

      this.outLockerTime = outLocker?.create_at ?? null;
      this.outLockerFname = outLocker?.fname ?? '';
      this.outLockerLname = outLocker?.lname ?? '';
    } else {
      // ✅ สำคัญ: ไม่พบข้อมูล locker สำหรับ order นี้ → เคลียร์ค่าทั้งหมด
      this.inLockerTime = null;
      this.inLockerFname = '';
      this.inLockerLname = '';
      this.outLockerTime = null;
      this.outLockerFname = '';
      this.outLockerLname = '';
    }
  })
);

this.subs.add(
  this.dashboardSrv.onapprovesmartward().subscribe(res => {
    // console.log('approvesmartward', res);

    if (res?.status === 200 && res.data?.length) {
      // console.log('Approve Smart Ward สำเร็จ');

      this.approveSmartWard = res.data[0];

      // console.log('approveSmartWard:', this.approveSmartWard);
    }
  })
);
  }

  ngOnDestroy() {
    // ---- FIX: clean up everything so nothing keeps firing / leaking ----
    if (this.pollIntervalId) clearInterval(this.pollIntervalId);
    if (this.smartWardIntervalId) clearInterval(this.smartWardIntervalId);
    this.subs.unsubscribe();
  }

  loadDashboard() {
    this.socket.emit('get_dataorder_ipd', {
      ward: this.selectedWard
    });
  }

  /**
   * Internal search that actually emits to the socket.
   * Called by both the 2s poll and the debounced user-triggered search,
   * so there is only ever one code path doing the emit.
   */
  private doSearch() {
    this.socket.emit('get_dataorder_ipd', {
      ward: this.filters.ward,
      hn: this.filters.hn,
      an: this.filters.an,
      name: this.filters.name,
      date: this.filters.date,
      order_type: this.filters.order_type,
      orderState: this.filters.orderState
    });

    this.dashboardSrv.getSummary(this.filters);
  }

  /**
   * Public "search" kept for compatibility with (change) handlers
   * that should fire immediately (dropdowns, date picker, reset).
   */
  search() {
    this.doSearch();
  }

  /**
   * Use this from (keyup) on text inputs (HN, AN, ชื่อ-สกุล) instead of
   * search() directly — it debounces so typing doesn't spam the socket
   * and doesn't race the interval poll.
   */
  triggerSearch() {
    this.searchSubject.next();
  }

  resetFilter() {
    this.filters = {
      ward: '000',
      hn: '',
      an: '',
      name: '',
      order_type: '',
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

  // ---- FIX 3: use take(1) so we don't stack up subscriptions every click ----
  async openDetail(item: Dashboard) {

    this.selectedOrder = item;
    this.orderDetails = [];

    this.swalSrv.loadingAlert2();
    this.dashboardSrv.getdetail(item.hn, item.order_number);
    this.dashboardSrv.getcreateatlocker(item.order_number);
    this.dashboardSrv.getapprovesmartward(item.order_number);

    this.dashboardSrv.ondetail().pipe(take(1)).subscribe(res => {
      if (res.status === 200) {
        this.orderDetails = [...res.msg];
        Swal.close();
        this.detailComp.open();
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

    if (this.authSrv.getUser()) {
      this.authSrv.logout();
    } else {
      this.router.navigate(['/login']);
    }
  }

  reloadDetail() {
    if (!this.selectedOrder) return;

    this.dashboardSrv.getdetail(
      this.selectedOrder.hn,
      this.selectedOrder.order_number
    );

    this.dashboardSrv.ondetail().pipe(take(1)).subscribe(res => {
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

    this.detailComp.close();
    this.swalSrv.loadingAlert2();

    const hn = this.selectedOrder.hn;
    const order_number = this.selectedOrder.order_number;

    const sub = this.socket.fromEvent<any>('order_pack_unitdose')
      .pipe(take(1))
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
      });

    // take(1) auto-unsubscribes after first emission, no manual unsubscribe needed
    void sub;

    const d = new Date(this.selectedOrder.order_date);
    const localDate = d.toLocaleDateString('en-CA'); // YYYY-MM-DD

    this.socket.emit('get_pack_unitdose', { hn, order_number, order_date: localDate });
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

  handleSelectPack(event: { pack_number: number, hn: string }) {
    console.log('Selected pack:', event);
  }

  async removeSmartWardNotification(id: string, order_number: number) {
    try {
      const res = await this.dashboardSrv.updateOrderSmartWard(order_number);
      if (res.status === 200) {
        this.smartWardNotifications =
          this.smartWardNotifications.filter(x => x.id !== id);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async removeNotification(id: string, order_number: number[]) {
    try {
      const res = await this.dashboardSrv.updateOrderSmartLocker(order_number);
      if (res.status === 200) {
        this.notifications = this.notifications.filter(x => x.id !== id);
      }
    } catch (error) {
      console.error(error);
    }
  }

  reqsmartward() {

    this.subs.add(
      this.dashboardSrv.orderSmartward().subscribe({
        next: (res) => {
          if (res.status !== 200) {
            return;
          }

          res.msg.forEach((item: any) => {
            const wardMatch =
              String(item.wardcode).trim() === String(this.filters.ward).trim();

            if (!wardMatch) {
              return;
            }

            const exists = this.smartWardNotifications.some(
              x => String(x.order_number) === String(item.order_number)
            );

            if (!exists) {
              const newItem = {
                ...item,
                id: Date.now().toString()
              };

              this.smartWardNotifications = [
                newItem,
                ...this.smartWardNotifications
              ];
            }
          });
        },
        error: (err) => {
          console.error('SMARTWARD ERROR', err);
        }
      })
    );

    this.socket.emit('get_order_smart_ward');

    this.smartWardIntervalId = setInterval(() => {
      this.socket.emit('get_order_smart_ward');
    }, 5000);
  }

  // ---- FIX 1: trackBy for the dashboard table so Angular doesn't ----
  // ---- tear down and rebuild every row on each poll/search refresh ----
  trackByOrder(index: number, item: Dashboard): any {
    return item.order_number ?? index;
  }

  // trackBy helpers for the two notification lists too
  trackByNotiId(index: number, item: { id: string }): string {
    return item.id;
  }
}