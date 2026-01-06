import { Component, ElementRef, ViewChild, Input, SimpleChanges, inject, EventEmitter, Output } from '@angular/core';
import { Dashboard } from '../../shared/interfaces/dashboard';
import { Detail } from '../../shared/interfaces/detail';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthServices } from '../../shared/services/auth-services';
import { DashboarServices } from '../../shared/services/dashboar-services';
import { SwalServices } from '../../shared/services/swal-services';
import { OrderServices } from '../../shared/services/order-services';
import { User } from '../../shared/interfaces/user';

@Component({
  selector: 'app-from-detail-component',
  imports:
    [
      CommonModule,
      FormsModule
    ],
  templateUrl: './from-detail-component.html',
  styleUrl: './from-detail-component.css',
})
export class FromDetailComponent {

  @ViewChild('modal') modal!: ElementRef<HTMLDialogElement>;
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;


  @Input() orderDetails: Detail[] = [];
  @Input() selectedOrder!: Dashboard;
  @Output() received = new EventEmitter<void>();
  @Output() goUnitDose = new EventEmitter<void>();

  selectedDrug: Detail | null = null;
  searchText: string = '';
  filteredOrderDetails: Detail[] = [];
  checkAll: boolean = false;
  user!: User | undefined
  allowedOrderStates = [0, 6, 14, 15, 16];
  checkedData: Detail[] = [];

  private authSrv = inject(AuthServices);
  private orderSrv = inject(OrderServices);
  private swalSrv = inject(SwalServices)

  ngOnChanges(changes: SimpleChanges) {
    console.log('orderDetails changed', changes['orderDetails']);

    this.user = this.authSrv.getUser();

    if (changes['orderDetails'] && this.orderDetails?.length) {

      this.checkedData = this.orderDetails.filter(d => d.order_state_ot === 8);

      this.filteredOrderDetails = this.orderDetails.filter(d => d.order_state_ot !== 8);

      this.searchText = '';
      this.selectedDrug = null;
      this.checkAll = false;
    }
  }


  selectDrug(item: Detail) {
    this.selectedDrug = item;
  }

  open() {
    this.filteredOrderDetails = [...this.orderDetails];
    this.searchText = '';
    this.selectedDrug = null;

    this.modal.nativeElement.showModal();
  }


  close() {
    this.selectedDrug = null;
    this.searchText = '';
    this.filteredOrderDetails = [];
    this.modal.nativeElement.close();
  }

  searchdrug() {
    const text = this.searchText.toLowerCase().trim();
    this.filteredOrderDetails = this.orderDetails.filter(drug =>
      drug.genericname?.toLowerCase().includes(text)
    );
  }

  toggleCheckAll() {
    this.filteredOrderDetails.forEach(item => {
      item.checked = this.checkAll;
    });
    this.selectedDrug = this.checkAll ? this.filteredOrderDetails[0] ?? null : null;
  }

  onCheckItem(item: Detail) {
    if (item.checked) {
      this.selectedDrug = item;
    } else if (this.selectedDrug?.icode === item.icode) {
      this.selectedDrug = null;
    }
    this.checkAll = this.filteredOrderDetails.every(item => item.checked);
  }

  canReceiveDrug(item?: Detail | null): boolean {
    if (!this.user) return false;
    if (!item) return false;
    return this.allowedOrderStates.includes(item.order_state_ot);
  }

  get hasCheckedItems(): boolean {
    return this.filteredOrderDetails.some(i => i.checked);
  }

  get canConfirmReceive(): boolean {
    if (this.hasCheckedItems) return true;
    return this.canReceiveDrug(this.selectedDrug);
  }

  get isLogin(): boolean {
    return !!this.user;
  }

async confirmReceive() {
  if (!this.user) {
    this.swalSrv.errorAlert({
      title: 'ต้อง login ก่อน',
      text: 'กรุณาเข้าสู่ระบบก่อนรับยา'
    });
    return;
  }

  const items: Detail[] = this.hasCheckedItems
    ? this.filteredOrderDetails.filter(i => i.checked)
    : this.selectedDrug ? [this.selectedDrug] : [];

  if (items.length === 0) {
    alert('กรุณาเลือกยาอย่างน้อย 1 รายการ');
    return;
  }

  for (const item of items) {
    await this.orderSrv.updateOrderStatePay(
      Number(this.selectedOrder.order_number),
      item.icode,
      item.item_index,
      this.user.loginname ?? '',
      item.qty,
      item.order_state
    );

    item.order_state_ot = 8;
    item.checked = false;
    this.checkedData.push(item);
  }

  // อัปเดตรายการ
  this.filteredOrderDetails = this.filteredOrderDetails.filter(i => i.order_state_ot !== 8);
  this.selectedDrug = null;
  this.checkAll = false;

  this.received.emit();

  if (this.filteredOrderDetails.length > 0) {
    // 🔹 รับบางรายการ → เปิด modal ต่อเนื่อง
    // Modal ยังเปิดอยู่ → ปิดก่อน
    this.modal.nativeElement.close();

    // ให้ Swal แสดง
    await this.swalSrv.successAlert({
      title: 'รับยาเรียบร้อย',
      text: `เหลือ ${this.filteredOrderDetails.length} รายการให้รับต่อ`,
      timer: 1500
    });

    // เปิด modal อีกครั้งหลัง user กด confirm
    this.modal.nativeElement.showModal();
  } else {
    // 🔹 รับครบ → ปิด modal + แจ้ง Swal
    this.modal.nativeElement.close();
    await this.swalSrv.successAlert({
      title: 'รับยาเรียบร้อย',
      text: 'ทำการรับยาครบทุกตัวแล้ว',
      timer: 1500
    });
  }
}

goToUnitDose() {
  console.log('ไปยัง modal UNIT DOSE');
  this.goUnitDose.emit(); 
}
  
}
