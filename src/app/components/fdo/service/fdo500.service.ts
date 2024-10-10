import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@app/auth.service';

@Injectable({
  providedIn: 'root'
})
export class Fdo500Service {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  getSearch = () => {
    const params: any = {
      userToken: this.getToken
    }
    return this.http.post('/'+this.userData.appName+'ApiDO/API/KEEPB/fdo0500/search', params)
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
