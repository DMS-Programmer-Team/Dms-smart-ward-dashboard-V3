export interface Dashboard {
  average_wait: string;
  order_date: any;
  order_time: any;
  hn: string;
  an: string;
  order_number: string;
  order_state: number;
  patient_name: string;
  state_color: string;
  state_description: string;
  state_description_ipd: string;
  ward:any
  order_type:any
  pre_checkin: string
  pre_checkin_date:any
  checkindate:any
  checkintime:any
  checkoutdate:any
  checkouttime:any
  pre_checkin_time:any
  order_count:any
  order_urgent:any
  prescription_number:any
  wardname:any
  total_time: string | null;
  selectedDate: string;
  icode: string;
  unitdose: string;
  lock_state : number;
  create_at: string;
    create_time_locker?: string | null;

}




export interface SummaryDashboard {
  state_0: number;
  state_1: number;
  state_2: number;
  state_3: number;
  state_4: number;
  state_5: number;
}
