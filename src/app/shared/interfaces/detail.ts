export interface Detail {
  checkindate: any;
  checkintime: any;
  checkoutdate: any;
  checkouttime: any;
  count: string;
  drug_image: any;
  genericname: string;
  hn: string;
  an: string;
  icode: string;
  item_index: number;
  order_number: number;
  order_state: number;
  patient_name: string;
  rf_id: string;
  state_description: string;
  state_description_ipd: string;
  strength: string;
  tradename: string;
  units: string;
  qty: number;
  average_wait: string;
  expiredate: any;
  order_state_ot: any;
  state_description_ot: any;
  order_state_time: any;
  wardname: any;
  img_recipient: any;
  sender_name: any
  selectedDate: string;
  drug_image_base64: any;
  order_type: any
  order_count: any
  selected?: boolean;
  checked?: boolean;
  unitdose?: string
  take_medicine?: string
  state_datetime: any
}

export interface PackUnitDose {
  pack_number: number
}

export interface PackDrugUnitDose {
  pack_id: number;
  pack_number: number;
  take_time: string;
  pack_image: string | null;
  drugs?: DrugUnitDose[];
}

export interface DrugUnitDose {
  drug_image: any
  icode: any
  item_index: any
  qty: Number
  sum_unit:number
  order_number: any
  genericname: string
  drug_help: string
  state_description: any
  state_description_ipd: any
  order_state: any
  order_state_ot: any
  pd_qty:any,
  qty_checked:any,
  is_registed: any,
  error:any,
  registed:any
  
}





