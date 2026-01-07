export interface ScanOrder {
  type: 'ORDER';
  order_number: number;
  hn: string;
}

export interface ScanItem {
  type: 'ITEM';
  order_number: number;
  icode: string;
  item_index: number;
}

export type ScanResult = ScanOrder | ScanItem | null;