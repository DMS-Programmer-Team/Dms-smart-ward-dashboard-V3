import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dashboard } from '../../shared/interfaces/dashboard';
import { Detail } from '../../shared/interfaces/detail';

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


  @Input() orderDetails: Detail[] = [];
  @Input() selectedOrder!: Dashboard;

  selectedDrug: Detail | null = null;
  searchText: string = '';
  filteredOrderDetails: Detail[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['orderDetails'] && this.orderDetails?.length) {
      this.filteredOrderDetails = [...this.orderDetails];
      this.searchText = '';
      this.selectedDrug = null;
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

}
