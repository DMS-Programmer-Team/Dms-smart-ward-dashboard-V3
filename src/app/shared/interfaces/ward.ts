export interface Ward {
  wardcode: string
  wardname: string
  stationcode :any
  stationnumber:any
}

export interface WardResponse {
  status: number;
  msg: Ward[];
}
