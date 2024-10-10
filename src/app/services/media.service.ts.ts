import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class MediaService {

  private shareMedia: Subject<any> = new Subject<any>();
  shareMedia$: Observable<any> = this.shareMedia.asObservable();

  constructor() { }

  setData(media:any) {
    this.shareMedia.next(media);
  }

}