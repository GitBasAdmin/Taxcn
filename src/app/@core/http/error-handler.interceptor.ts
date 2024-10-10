import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastNotificationInitializer, ToastPositionEnum,DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';


interface ErrorModel {
  code: string;
  parameters: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError((error) => this.errorHandler(error)));
  }

  private errorHandler(response: HttpErrorResponse): Observable<HttpEvent<any>> {
    if (response.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.log(response.error.message);
    } else {
      this.handleBackendError(response);
    }

    return of()
  }

  private handleBackendError(error: HttpErrorResponse) {
    console.log(error)
    switch(error.status){
      case 0:
        this.showMessage(`ไม่มีการตอบรับจาก url : ${error.url} กรุณาตรวจสอบการเชื่อมต่อ`)
        break;
      case 403:
        this.showMessage(`คุณไม่มีสิทธิ์เข้าถึง url : ${error.url}`)
        break;
      case 401:
        this.showMessage(`คุณไม่มีสิทธิ์เข้าถึงเนื้อหา : ${error.url}`)
        break;
      case 500:
        this.showMessage(`พบข้อผิดพลาดทางเทคนิคกรุณาติดต่อผู้ดูแลระบบ : ${error.url}`)
        break;
      case 502:
        this.showMessage(`พบข้อผิดพลาดการเชื่อมต่อล้มเหลวกรุณาติดต่อผู้ดูแลระบบ : ${error.url}`)
        break;
      case 400:
      case 404:
        this.showMessage(`พบข้อผิดพลาดในการสื่อสารข้อมูลกรุณาติดต่อผู้ดูแลระบบ : ${error.url}`)
        /*
      case 404:
        const backendError = error.error;
        if (backendError == null && error.status == 404) {
          this.showMessage(`ไม่พบ url : ${error.url}`)
        } else if (backendError.errors) {
          if (backendError.errors instanceof Array) {
            (backendError.errors as ErrorModel[]).forEach((item: ErrorModel) =>
              this.showMessage(`${item.code}, ${item.parameters}`)
            );
          } else if (backendError.errors.code) {
            this.showMessage(`${backendError.errors.code}, ${backendError.errors.parameters}`)
          } else {
            this.showMessage(JSON.stringify(backendError.errors))
          }
        } else this.showMessage(backendError)
        break;
        */
    }
  }

  /*
  private showMessage(msg:string) {
    const toast = new ToastNotificationInitializer();
    toast.setMessage(msg)
    toast.setConfig({
      ToastPosition: ToastPositionEnum.BOTTOM_RIGHT,
      AutoCloseDelay: 2300
    })
    toast.openToastNotification$().subscribe()
  }*/

  private showMessage(msg:string) {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('พบข้อผิดพลาด!');
    confirmBox.setMessage(msg);
    confirmBox.setButtonLabels('ตกลง');
    confirmBox.setConfig({
      layoutType: DialogLayoutDisplay.DANGER, // SUCCESS | INFO | NONE | DANGER | WARNING
    });
    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
      if (resp.success==true){}
      subscription.unsubscribe();
    });
  }
}
