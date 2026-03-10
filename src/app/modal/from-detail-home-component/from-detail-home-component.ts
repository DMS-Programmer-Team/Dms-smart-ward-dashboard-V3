import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, Input, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Detail } from '../../shared/interfaces/detail';
import { Dashboard } from '../../shared/interfaces/dashboard';

@Component({
  selector: 'app-from-detail-home-component',
  imports:
    [
      CommonModule,
      FormsModule
    ],
  templateUrl: './from-detail-home-component.html',
  styleUrl: './from-detail-home-component.css',
})
export class FromDetailHomeComponent {
  @ViewChild('modalOPD') modal!: ElementRef<HTMLDialogElement>;
  @ViewChild('imageModal') imageModal!: ElementRef<HTMLDialogElement>;


  @Input() orderDetails: Detail[] = [];
  @Input() selectedOrder!: Dashboard;

  selectedDrug: Detail | null = null;
  searchText: string = '';
  filteredOrderDetails: Detail[] = [];
  selectedImage: string = '';


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


    openImage(img?: string | null) {
    this.selectedImage = img || './drugs.gif';
    this.imageModal.nativeElement.showModal();
  }

  closeImage() {
    this.imageModal.nativeElement.close();
  }

}
