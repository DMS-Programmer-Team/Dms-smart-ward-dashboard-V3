import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dashboard } from '../../shared/interfaces/dashboard';
import { Detail, PackDrugUnitDose } from '../../shared/interfaces/detail';
import { PackUnitDose } from '../../shared/interfaces/detail';

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

  @Input() orderDetails: PackUnitDose[] = [];
  @Input() selectedOrder!: Dashboard;
  @Output() back = new EventEmitter<void>(); 
  @Output() selectPack = new EventEmitter<{ pack_number: number, hn: string }>();

  packDrugDetail!: PackDrugUnitDose;

  open() {
    this.modal.nativeElement.showModal();
  }

  close() {

    this.modal.nativeElement.close();
  }

  //////////////// pack drug unitdose //////////////////
  onClickRow(item: PackUnitDose) {
      console.log('Click row item:', item, 'selectedOrder:', this.selectedOrder);

    if (this.selectedOrder) {
      this.selectPack.emit({ pack_number: item.pack_number, hn: this.selectedOrder.hn });
    }
  }

  setPackDrugDetail(data: PackDrugUnitDose) {
    this.packDrugDetail = data;
  }
 

  goBack() {
    this.close();          // ปิด Unit Dose modal
    this.back.emit();      // แจ้ง parent ให้เปิด modal หลัก
  }

}
