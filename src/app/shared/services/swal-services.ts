import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SwalServices {

    async confirmAlert(options?: {title?: string, text?: string, icon?: SweetAlertIcon, confirmText?: string, cancelText?: string}) {
     let confirm = false
     await Swal.fire({
      title: (options?.title ? options.title : 'Confirm?'),
      text: (options?.text ? options.text : 'Do you want to confirm this process?'),
      icon: (options?.icon ? options.icon : 'question'),
      showCancelButton: true,
      confirmButtonText: (options?.confirmText ? options.confirmText : 'Yes'),
      cancelButtonText: (options?.cancelText ? options.cancelText : 'No'),
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((result) => {
      if (result.isConfirmed) {
        confirm = true;
      }
    })

    return confirm
  }

  async infoAlert(options?: {title?: string, text?: string}) {
    return await Swal.fire({
      title: (options?.title ? options.title : 'Info'),
      text: (options?.text ? options.text : 'More about information'),
      icon: 'info',
      showConfirmButton: true,
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
    })
  }

  async warningAlert(options?: {title?: string, text?: string}) {
    return await Swal.fire({
      title: (options?.title ? options.title : 'Warning'),
      text: (options?.text ? options.text : 'Something went wrong. Please try again.'),
      icon: 'warning',
      showConfirmButton: true,
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
    })
  }

  async successAlert(options?: {title?: string, text?: string, confirmText?: string, timer:number}) {
    return await Swal.fire({
      title: (options?.title ? options.title : 'Success'),
      text: (options?.text ? options.text : 'This process is successfully!'),
      icon: 'success',
      showConfirmButton: false,
      timer: (options?.timer ? options.timer : 1500),
      allowEnterKey: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
    })
  }
  async successAlertToast(options?: {title?: string, text?: string, timer?: number}) {
    return await Swal.fire({
      toast:true,
      position:"top-end",
      title: (options?.title ? options.title : 'Success'),
      text: (options?.text ? options.text : 'This process is successfully!'),
      icon: 'success',
      showConfirmButton: false,
      timer: (options?.timer ? options.timer : 1500),
    })
  }


  async errorAlert(options?: {title?: string, text?: string, confirmText?: string, timer?: number}) {
    return await Swal.fire({
      title: (options?.title ? options.title : 'Error'),
      text: (options?.text ? options.text : 'Something went wrong. Please try again.'),
      icon: 'error',
      showConfirmButton: false,
      timer: (options?.timer ? options.timer : 1500),
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
    })
  }

  async loadingAlert(options?: {title?: string, text?: string, timer?: number}) {
    let timerInterval: any
    return await Swal.fire({
      title: (options?.title ? options.title : 'Loading'),
      text: (options?.text ? options.text : 'Please wait for loading...'),
      timer: (options?.timer ? options.timer : 1500),
      timerProgressBar: true,
      showConfirmButton: false,
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
    })
  }

  async InputAlert(options?: {title?: string, text?: string, timer?: number}) {

    return await Swal.fire({
      title: (options?.title ? options.title : 'Error'),
      text: (options?.text ? options.text : 'Something went wrong. Please try again.'),
      inputAttributes: {
        autocapitalize: "off"
      },
      input: 'text',
      showCancelButton: true,
      showConfirmButton: false,
      showCloseButton: true,
      confirmButtonText:  'เสร็จสิ้น',
      cancelButtonText: 'เสร็จสิ้น',
      allowOutsideClick: false,
    });
  }

  async InputAlert2(options?: {title?: string, text?: string, timer?: number}) {

    return await Swal.fire({
      title: (options?.title ? options.title : 'Error'),
      text: (options?.text ? options.text : 'Something went wrong. Please try again.'),
      inputAttributes: {
        autocapitalize: "off"
      },
      input: 'text',
      showCancelButton: true,
      showConfirmButton: true,
      showCloseButton: true,
      confirmButtonText:  'เสร็จสิ้น',
      cancelButtonText: 'ยกเลิก',
      allowOutsideClick: false,
    });
  }


  async inputtotal(): Promise<string | undefined> {
    const { value: total } = await Swal.fire({
      title: 'ระบุจำนวน',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      // position: 'top',
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'เสร็จสิ้น',
      showLoaderOnConfirm: false,
      // iconHtml: '<img src="../../assets/img/icon-bright.png" width="80px">',
    });

    return total;
  }

  async loadingAlert2(options?: {title?: string, text?: string}) {
  return Swal.fire({
    title: options?.title ?? 'Loading',
    text: options?.text ?? 'Please wait...',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => Swal.showLoading()
  });
}



  // if (result.isConfirmed) {
  //   return 
  // }
  
}
