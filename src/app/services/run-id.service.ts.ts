import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class SharedRunIdService {

  private shareRunId: Subject<any> = new Subject<any>();
  shareRunId$: Observable<any> = this.shareRunId.asObservable();

  constructor() { }

  setData(run_id:number) {
    this.shareRunId.next(run_id);
  }

}