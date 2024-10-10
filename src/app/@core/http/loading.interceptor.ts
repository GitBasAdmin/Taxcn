import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { finalize } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class LoadingInterceptor implements HttpInterceptor {
  //private timeOutId: NodeJS.Timeout
  constructor(
    private busyService: BusyService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.busyService.busy();
    return next.handle(request).pipe(
      finalize(() => {
        this.busyService.idle();
      })
    );
  }

}

@Injectable(
  {
    providedIn: 'root',
  }
)
export class BusyService {
  private busyRequestCount = 0;
  constructor(private spinnerService: NgxSpinnerService) { }

  public busy() {
    this.busyRequestCount++;
    this.spinnerService.show();
    //console.log('spinShow')
  }

  public idle() {
    
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.spinnerService.hide();
    }
  }
}
