// services/common.service.ts
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from "lodash"

@Injectable({
  providedIn: 'root'
})
export class FunntionService {
  constructor() { }

  searchBackNo(title:any, id:any, yy:any){
    /*
    const selObj = _.filter(object, function (o) {
        return (_.includes(id,o.id));
    });
    return selObj;
    */
    return 999;
  }

}