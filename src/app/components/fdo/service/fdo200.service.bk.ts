import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '@app/auth.service';
import { SearchModel } from '../models/fdo0200/search-model';
import { GetSearchMaterialModel } from '../models/get-search-material-model';

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
    return this._http.post('/'+this.userData.appName+'ApiDO/API/KEEPB/fdo0200/searchBarcode', params)
  }

  getSearch(inputObj: SearchModel): Observable<Object> {
    const params: any = {
      ...inputObj,
      userToken: this.getToken
    }
    return this._http.post('/'+this.userData.appName+'ApiDO/API/KEEPB/fdo0200/search', params)
  }

  private get getToken(): string {
    const sessData: string = localStorage.getItem(this.authService.sessJson);
    let userData: any
    if(sessData) {
      userData = JSON.parse(sessData)
    }
    return userData?.userToken || ""
  }
}
