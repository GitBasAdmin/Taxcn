import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '@app/auth.service';
import { SearchModel,tabSearchModel,printWordModel,delWordModel,dataListModel } from '../models/fdo0200/search-model';
import { GetSearchMaterialModel } from '../models/get-search-material-model';
import { DeleteModel, DelMaterialModel } from '../models/del-material-model';

@Injectable({
  providedIn: 'root'
})
export class Fdo200Service {

  constructor(
    private _http: HttpClient,
    private authService: AuthService,
  ) { }

  getSearchBarcode(): Observable<Object> {
    const params: any = {
      userToken: this.getToken
    }
    return this._http.post('/'+this.getRoot+'ApiDO/API/KEEPB/fdo0200/searchBarcode', params)
  }

  getSearch(inputObj: SearchModel): Observable<Object> {
    const params: any = {
      ...inputObj,
      userToken: this.getToken
    }
    console.log(params)
    return this._http.post('/'+this.getRoot+'ApiDO/API/KEEPB/fdo0200/search', params)
  }
  getTabSearch(inputObj: tabSearchModel): Observable<Object> {
    const params: any = {
      ...inputObj,
      userToken: this.getToken
    }
    console.log(params)
    return this._http.post('/'+this.getRoot+'ApiUTIL/API/getData', params)
  }
  getDataList(inputObj: dataListModel): Observable<Object> {
    const params: any = {
      ...inputObj,
      userToken: this.getToken
    }
    console.log(params)
    return this._http.post('/'+this.getRoot+'ApiUTIL/API/popup', params)
  }
  getPrintWord(inputObj: printWordModel): Observable<Object> {
    const params: any = {
      ...inputObj,
      userToken: this.getToken
    }
    console.log(params)
    return this._http.post('/'+this.getRoot+'ApiKN/API/KEEPN/openReport', params)
  }

  getDelWord(inputObj: delWordModel): Observable<Object> {
    const params: any = {
      ...inputObj,
      userToken: this.getToken
    }
    console.log(params)
    return this._http.post('/'+this.getRoot+'ApiKN/API/KEEPN/deleteFile', params)
  }

  delete(inputObj: DeleteModel) {
    const params: any = {
      ...inputObj, userToken: this.getToken
    }
    //console.log(params)
    return this._http.post('/'+this.getRoot+'ApiDO/API/KEEPB/fdo0200/delete', params)
  }

  saveOpen = (inputObj: any) => {
    const params: any = {
      ...inputObj, userToken: this.getToken
    }
    return this._http.post('/'+this.getRoot+'ApiDO/API/KEEPB/fdo0200/saveOpen', params)
  }

  saveByMBarcode = (inputObj: any) => {
    const params: any = {
      ...inputObj, userToken: this.getToken
    }
    return this._http.post('/'+this.getRoot+'ApiDO/API/KEEPB/fdo0200/saveByMBarcode', params)
  }

  private get getToken(): string {
    const sessData: string = localStorage.getItem(this.authService.sessJson);
    let userData: any
    if(sessData) {
      userData = JSON.parse(sessData)
    }
    return userData?.userToken || ""
  }

  private get getRoot(): string {
    const sessData: string = localStorage.getItem(this.authService.sessJson);
    let rootData: any
    if(sessData) {
      rootData = JSON.parse(sessData)
    }
    return rootData?.appName || ""
  }
  
}
