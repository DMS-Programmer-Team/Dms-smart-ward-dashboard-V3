import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Dashboard, SummaryDashboard } from '../shared/interfaces/dashboard';
import { Detail } from '../shared/interfaces/detail';
import { Ward } from '../shared/interfaces/ward';
import { SocketServices } from '../shared/services/socket-services';
import { DashboarServices } from '../shared/services/dashboar-services';
import { WardServices } from '../shared/services/ward-services';
import { SwalServices } from '../shared/services/swal-services';
import { NgxPaginationModule } from 'ngx-pagination';
import { FromDetailHomeComponent } from '../modal/from-detail-home-component/from-detail-home-component';
import Swal from 'sweetalert2';
import { AuthServices } from '../shared/services/auth-services';
import { User } from '../shared/interfaces/user';

@Component({
  selector: 'app-dischargecomponent',
  imports:
    [
      FormsModule,
      CommonModule,
      NgxPaginationModule,
      FromDetailHomeComponent
    ],
  templateUrl: './dischargecomponent.html',
  styleUrl: './dischargecomponent.css',
})
export class Dischargecomponent {

  @ViewChild('detailModalOPD')
  detailComp!: FromDetailHomeComponent;

  selectedWard: string = '000';
  selectedOrder!: Dashboard;
  orderDetails: Detail[] = [];
  selectedDrug: Detail | null = null;
  dashboardList: Dashboard[] = [];
  wards: Ward[] = [];
  user!: User | undefined

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
  private swalServ = inject(SwalServices);
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

    this.dashboardSrv.onDataOrderOPD().subscribe(res => {
      console.log("onDataOrderOPD", res);
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

    this.dashboardSrv.onSummaryOPD().subscribe(res => {
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

        console.log('summaryOPD (mapped)', this.summary);
      }
    });

    this.dashboardSrv.ondetail().subscribe(res => {
      console.log("ondetail res", res);

      if (res.status === 200) {
        this.orderDetails = res.msg;
        Swal.close();
        this.detailComp.open();
      }
    });

  }

  loadDashboard() {
    this.socket.emit('get_dataorder_opd', {
      ward: this.selectedWard
    });
  }

  search() {
    this.socket.emit('get_dataorder_opd', {
      ward: this.filters.ward,
      hn: this.filters.hn,
      an: this.filters.an,
      name: this.filters.name,
      date: this.filters.date,
      orderState: this.filters.orderState
    });

    this.dashboardSrv.getSummaryOPD(this.filters);
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
    this.filters.orderState = state;
    this.search();
  }

  allsum() {
    return this.summary.state_0 + this.summary.state_1 + this.summary.state_2 + this.summary.state_3 + this.summary.state_4;
  }

  waiting() {
    return this.summary.state_0 + this.summary.state_1 + this.summary.state_2 + this.summary.state_4
  }

  success() {
    return this.summary.state_3
  }

  async openDetail(item: Dashboard) {

    console.log("openDetail item", item);
    this.selectedOrder = item;
    this.orderDetails = [];

    this.swalServ.loadingAlert2();
    this.dashboardSrv.getdetail(item.hn, item.order_number);


  }

  async clicktologout() {
    const result = await this.swalServ.confirmAlert({
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


clicktohome() {
  this.swalServ.loadingAlert({ 
    title: 'Please wait', 
    text: 'Reloading page...' 
  });
  setTimeout(() => {
    window.location.href = '/home'; 
  }, 1500); 
}
}
