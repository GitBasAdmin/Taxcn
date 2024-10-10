import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class DataService {
  private _dataResult = new BehaviorSubject<any>(null);

  constructor() {
    //this.methodToPopulateDatarResult({ todayis: "sunny" });
  }

  dataResult$(): Observable<any> {
    return this._dataResult.asObservable();
  }

  methodToPopulateDataResult(report: any): void {
    this._dataResult.next(report);
  }
}