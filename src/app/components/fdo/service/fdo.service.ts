import { GetRunCaseIdModel } from './../models/get-run-case-id-model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '@app/auth.service';
import { GetDataFromTitleModel } from '@app/components/fdo/models/data-from-title-model';
import { GetDataModel } from '@app/components/fdo/models/get-data-model';
import { GetDataFromRedTitleModel } from '../models/data-from-red-title-model';
import { GetSearchMaterialModel } from '../models/get-search-material-model';
import { SaveRemarkModel } from '../models/save-remark-model';
import { UpdateMaterialModel } from '../models/update-material-model';
import { InsertMaterialModel } from '../models/insert-material-model';
import { DelMaterialModel,DelCaseMaterialModel } from '../models/del-material-model';
import { SearchModel } from '../models/search-model';
import { GetRunItemModel } from '../models/get-run-item-model';


@Injectable({
  providedIn: 'root'
})
export class FdoService {

  constructor(
    private _http: HttpClient,
    private authService: AuthService,
  ) { }

  getData(inputObj: GetDataModel): Observable<Object> {
    const params: any = {...inputObj, userToken: this.getToken}
    return this._http.disableLoading().post('/'+this.getRoot+'ApiUTIL/API/getData', params)
  }

  getDataFromTitle(inputObj: GetDataFromTitleModel): Observable<Object> {
    const params: any = {...inputObj, userToken: this.getToken}
    return this._http.post('/'+this.getRoot+'ApiCA/API/CASE/dataFromTitle', params)
  }

  getDataFromRedTitle(inputObj: GetDataFromRedTitleModel): Observable<Object> {
    const params: any = {...inputObj, userToken: this.getToken}
    return this._http.post('/'+this.getRoot+'ApiCA/API/CASE/dataFromRedTitle', params)
  }


  getAuthen(inputObj: any): Observable<Object> {
    const params: any = { ...inputObj, userToken: this.getToken}
    return this._http.post('/'+this.getRoot+'Api/API/authen', params)
  }

  getSearchMaterial(inputObj: GetSearchMaterialModel): Observable<Object> {
    const params: any = {
      ...inputObj,
      userToken: this.getToken
    }
    //console.log(params)
    return this._http.post('/'+this.getRoot+'ApiDO/API/KEEPB/fdo0100/searchMaterial', params)
  }

  getRunCaseId = (inputObj: GetRunCaseIdModel): Observable<Object> => {
    const params: any = {
      ...inputObj,
      token: this.getToken
    }
    return this._http.disableLoading().post('/'+this.getRoot+'ApiDO/API/KEEPB/fdo0100/runCaseId', params)
  }

  getRunItem(inputObj: GetRunItemModel): Observable<Object> {
    const params: any = {
      ...inputObj,
      token: this.getToken
    }
    return this._http.disableLoading().post('/'+this.getRoot+'ApiDO/API/KEEPB/fdo0100/runItem', params)
  }

  saveRemark(inputObj: SaveRemarkModel): Observable<Object> {
    const params: any = {
      ...inputObj, userToken: this.getToken
    }
    //console.log(params)
    return this._http.post('/'+this.getRoot+'ApiDO/API/KEEPB/fdo0100/saveRemark', params)
  }

  updateMaterial(inputObj: UpdateMaterialModel): Observable<Object> {
    const params: any = {
      ...inputObj, userToken: this.getToken
    }
    //console.log(params)
    return this._http.post('/'+this.getRoot+'ApiDO/API/KEEPB/fdo0100/updateMaterial', params)
  }

  insertMaterial(inputObj: InsertMaterialModel): Observable<Object> {
    const params: any = {
      ...inputObj, userToken: this.getToken
    }
    //console.log(params)
    return this._http.post('/'+this.getRoot+'ApiDO/API/KEEPB/fdo0100/insertMaterial', params)
  }

  delMaterial(inputObj: DelMaterialModel) {
    const params: any = {
      ...inputObj, userToken: this.getToken
    }
    return this._http.post('/'+this.getRoot+'ApiDO/API/KEEPB/fdo0100/delMaterial', params)
  }

  delCaseMaterial(inputObj: DelCaseMaterialModel) {
    const params: any = {
      ...inputObj, userToken: this.getToken
    }
    //console.log(params)
    return this._http.post('/'+this.getRoot+'ApiDO/API/KEEPB/fdo0100/delCaseMaterial', params)
  }

  getHistory = (run_id: number) => {
    const params: any = {
      run_id: run_id, userToken: this.getToken
    }
    return this._http.post('/'+this.getRoot+'ApiDO/API/KEEPB/fdo0100/getHistory', params)
  }

  getMaterial = (inputObj: GetSearchMaterialModel) => {
    const params: any = {
      ...inputObj, userToken: this.getToken
    }
    //console.log(params)
    if(inputObj.material_running)
      return this._http.disableLoading().post('/'+this.getRoot+'ApiDO/API/KEEPB/fdo0100/getMaterial', params)
    else
      return this._http.post('/'+this.getRoot+'ApiDO/API/KEEPB/fdo0100/getMaterial', params)
  }

  getSearch = (inputObj: SearchModel) => {
    const params: any = {
      ...inputObj, userToken: this.getToken
    }
    //console.log(params)
    return this._http.post('/'+this.getRoot+'ApiDO/API/KEEPB/fdo9000/search', params)
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
