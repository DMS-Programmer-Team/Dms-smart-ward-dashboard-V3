import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dashboard } from '../../shared/interfaces/dashboard';
import { Detail, DrugUnitDose, PackDrugUnitDose } from '../../shared/interfaces/detail';
import { PackUnitDose } from '../../shared/interfaces/detail';
import { AuthServices } from '../../shared/services/auth-services';
import { OrderServices } from '../../shared/services/order-services';
import { SwalServices } from '../../shared/services/swal-services';
import { User } from '../../shared/interfaces/user';
import { DashboarServices } from '../../shared/services/dashboar-services';

@Component({
  selector: 'app-from-detail-unit-dose',
  imports:
    [
      CommonModule,
      FormsModule
    ],
  templateUrl: './from-detail-unit-dose.html',
  styleUrl: './from-detail-unit-dose.css',
})
export class FromDetailUnitDose {

  @ViewChild('modalUnitDose') modal!: ElementRef<HTMLDialogElement>;
  @ViewChild('imageModal') imageModal!: ElementRef<HTMLDialogElement>;

  @Input() orderDetails: PackUnitDose[] = [];
  @Input() selectedOrder!: Dashboard;
  @Input() packUnitDose: PackDrugUnitDose[] = [];
  @Output() back = new EventEmitter<void>();
  @Output() selectPack = new EventEmitter<{ pack_number: number, hn: string }>();


  packDrugDetail: PackDrugUnitDose | null = null;
  selectedDrug?: DrugUnitDose;
  selectedImage: string = '';


  private authSrv = inject(AuthServices);
  private orderSrv = inject(OrderServices);
  private swalSrv = inject(SwalServices);
  private dashSrv = inject(DashboarServices)

  user!: User | undefined;




  open() {

    this.modal.nativeElement.showModal();
  }

  close() {

    this.packDrugDetail = null;
    this.modal.nativeElement.close();


  }


selectPackUnitDose(pack: PackDrugUnitDose) {
  this.packDrugDetail = pack;
  console.log('Selected pack:', pack);

  if (this.selectedOrder && pack.pack_id) {
    this.getpackdrugunitdose(pack.pack_id.toString(), this.selectedOrder.order_number);
    console.log('pack_id:', pack.pack_id, 'order_number:', this.selectedOrder.order_number);

    // subscribe รับข้อมูลจาก socket
    this.dashSrv.onpackldrugunitdose().subscribe(res => {
      if (res.status === 200 && res.data?.length > 0) {
        // ใส่ข้อมูลยาเข้า packDrugDetail
        this.packDrugDetail!.drugs = res.data;
        console.log('Pack drugs:', this.packDrugDetail!.drugs);
      } else {
        this.packDrugDetail!.drugs = [];
      }
    });
  }
}


  getpackdrugunitdose(pack_id: string, order_number: string) {
    try {
      this.dashSrv.getpackdrugunitdose(pack_id, order_number);
    } catch (error) {
      console.error('Emit get_order_detail_unitdose error:', error);
    }
  }

  goBack() {
    this.close();          // ปิด Unit Dose modal
    this.back.emit();      // แจ้ง parent ให้เปิด modal หลัก
  }

openImage(img?: string | null) {
  this.selectedImage = img || './drugs.gif';
  this.imageModal.nativeElement.showModal();
}

  closeImage() {
    this.imageModal.nativeElement.close();
  }

}
