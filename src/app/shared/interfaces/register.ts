export interface register {
  loginname: string
  password: string
  departmentpostion: string
  pname: string
  fname: string
  lname: string 
  wardcode: string
  wardname: string
}

export interface addregister {
  reg_pname: string
  reg_fname: string
  reg_lname: string 
  reg_position: string
  reg_ward: string
  reg_wardname: string
}


export interface addwardlogin {
  login_name: string
  login_ward: string
}

export interface deleteuser {
  fname: string
  lname: string
}

export interface resetpassword {
  fname: string
  lname: string
  password: string
}
