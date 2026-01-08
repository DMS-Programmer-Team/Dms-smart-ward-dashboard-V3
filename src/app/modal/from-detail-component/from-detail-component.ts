import { Component, ElementRef, ViewChild, Input, SimpleChanges, inject, EventEmitter, Output } from '@angular/core';
import { Dashboard } from '../../shared/interfaces/dashboard';
import { Detail } from '../../shared/interfaces/detail';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthServices } from '../../shared/services/auth-services';
import { SwalServices } from '../../shared/services/swal-services';
import { OrderServices } from '../../shared/services/order-services';
import { User } from '../../shared/interfaces/user';
import { ScanResult } from '../../shared/interfaces/scaner';

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

  selectedDrug: Detail | null = null;
  searchText: string = '';
  filteredOrderDetails: Detail[] = [];
  checkAll: boolean = false;
  user!: User | undefined
  allowedOrderStates = [0, 6, 14, 16];
  checkedData: Detail[] = [];


  lastOrderScan: {
    order_number: number;
    hn: string;
  } | null = null;

  lastItemScan: {
    order_number: number;
    icode: string;
    item_index: number;
  } | null = null;



  private authSrv = inject(AuthServices);
  private orderSrv = inject(OrderServices);
  private swalSrv = inject(SwalServices)

  ngOnChanges(changes: SimpleChanges) {
    // console.log('orderDetails changed', changes['orderDetails']);

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

    setTimeout(() => {
      this.searchInput?.nativeElement.focus();
    }, 100);
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

  onTyping(event: KeyboardEvent) {
    if (event.key === 'Enter') return;
    this.searchdrug();
  }

  onScanEnter() {
    const value = this.searchText.trim();
    if (!value.includes('.')) {
      this.searchdrug();
      return;
    }
    this.handleScan(value);
    this.searchText = '';
    setTimeout(() => {
      this.searchInput?.nativeElement.focus();
    });
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
    if (item.order_state === 15) return false;
    return this.allowedOrderStates.includes(item.order_state_ot);
  }

  get hasCheckedItems(): boolean {
    return this.filteredOrderDetails.some(i => i.checked);
  }
  get hasReceivableItems(): boolean {
    return this.filteredOrderDetails.some(d => this.canReceiveDrug(d));
  }

  get canConfirmReceive(): boolean {
    if (this.hasCheckedItems ) return true;
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
        this.user.wardname,
        item.qty,
        item.order_state,
        item.hn
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

    this.rebuildLists();
    this.lastOrderScan = null;
    this.lastItemScan = null;
  }


  parseScan(raw: string): ScanResult {
    const parts = raw.split('.');

    if (parts.length === 2) {
      return {
        type: 'ORDER',
        order_number: Number(parts[0]),
        hn: parts[1]
      };
    }

    if (parts.length === 3 || parts.length === 4) {
      return {
        type: 'ITEM',
        order_number: Number(parts[0]),
        icode: parts[1],
        item_index: Number(parts[2])
      };
    }

    return null;
  }



  handleScan(raw: string) {
    const scan = this.parseScan(raw);
    if (!scan) return;

    switch (scan.type) {
      case 'ORDER':
        this.handleOrderScan(scan);
        break;

      case 'ITEM':
        this.handleItemScan(scan);
        break;
    }
  }

  handleOrderScan(scan: Extract<ScanResult, { type: 'ORDER' }>) {

    if (
      this.lastOrderScan &&
      this.lastOrderScan.order_number === scan.order_number &&
      this.lastOrderScan.hn === scan.hn
    ) {
      this.onConfirmOrderScan();
      this.lastOrderScan = null;
      return;
    }

    this.lastOrderScan = {
      order_number: scan.order_number,
      hn: scan.hn
    };

    // reset item context
    this.lastItemScan = null;

    this.onPreviewOrderScan(scan);
  }

  handleItemScan(scan: Extract<ScanResult, { type: 'ITEM' }>) {
    if (this.filteredOrderDetails.length === 0 && this.orderDetails.length) {
      this.rebuildLists();
    }


    if (!this.selectedOrder) {
      this.swalSrv.errorAlert({
        title: 'ยังไม่ได้เลือก Order',
        text: 'กรุณาสแกน Order ก่อน',
        timer: 1200
      });
      return;
    }

    //  scan ซ้ำ → confirm item
    if (
      this.lastItemScan &&
      this.lastItemScan.order_number === scan.order_number &&
      this.lastItemScan.icode === scan.icode &&
      this.lastItemScan.item_index === scan.item_index
    ) {
      this.onConfirmItemScan(scan);
      this.lastItemScan = null;
      return;
    }

    //  scan ใหม่ → preview
    this.lastItemScan = {
      order_number: scan.order_number,
      icode: scan.icode,
      item_index: scan.item_index
    };

    this.onPreviewItemScan(scan);
  }

  async onPreviewItemScan(scan: Extract<ScanResult, { type: 'ITEM' }>) {

    if (!this.filteredOrderDetails.length) {
      this.rebuildLists();
    }

    const found = this.orderDetails.find(d =>
      Number(d.order_number) === scan.order_number &&
      d.icode === scan.icode &&
      Number(d.item_index) === scan.item_index &&
      d.order_state_ot !== 8
    );


    if (!found) {
      await this.swalSrv.errorAlert({
        title: 'ไม่พบรายการ',
        text: 'รายการนี้รับไปแล้ว หรือไม่อยู่ใน order นี้',
        timer: 1200
      });
      this.lastItemScan = null;
      return;
    }

    found.checked = true;
    this.selectedDrug = found;
  }

  async onConfirmItemScan(scan: Extract<ScanResult, { type: 'ITEM' }>) {

    const found = this.orderDetails.find(d =>
      Number(d.order_number) === scan.order_number &&
      d.icode === scan.icode &&
      Number(d.item_index) === scan.item_index &&
      d.order_state_ot !== 8
    );


    if (!found) {
      await this.swalSrv.errorAlert({
        title: 'รายการนี้รับแล้ว',
        text: 'ไม่สามารถรับซ้ำได้',
        timer: 1200
      });
      return;
    }

    found.checked = true;
    this.selectedDrug = found;

    await this.confirmReceive();
  }

  async onPreviewOrderScan(scan: Extract<ScanResult, { type: 'ORDER' }>) {
    const res = await this.orderSrv.getOrderScanipd(
      scan.order_number,
      scan.hn
    );

    if (res?.status === 200) {
      this.selectedOrder = res.msg[0];
      this.orderDetails = res.msg;

      this.rebuildLists();

      this.open();

      this.checkAll = true;
      this.toggleCheckAll();
    }
  }


  async onConfirmOrderScan() {

    if (this.filteredOrderDetails.length === 0) {
      this.rebuildLists();
    }

    this.checkAll = true;
    this.toggleCheckAll();

    if (!this.canConfirmReceive) {
      console.warn('ยัง confirm ไม่ได้ (state ยังไม่พร้อม)');
      return;
    }

    await this.confirmReceive();
  }


  rebuildLists() {
    this.checkedData = this.orderDetails.filter(d => d.order_state_ot === 8);
    this.filteredOrderDetails = this.orderDetails.filter(d => d.order_state_ot !== 8);
  }







}
