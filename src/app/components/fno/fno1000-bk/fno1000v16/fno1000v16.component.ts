import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Renderer2   } from '@angular/core';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-fno1000v16',
  templateUrl: './fno1000v16.component.html',
  styleUrls: ['./fno1000v16.component.css']
})
export class Fno1000v16Component implements OnInit {
  sessData:any;
  userData:any;
  getPersType:any;
  getAppeal:any;
  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    //======================== ppers_type ======================================
    var student = JSON.stringify({
      "table_name" : "ppers_type",
      "field_id" : "pers_type",
      "field_name" : "pers_type_desc",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getPersType = getDataOptions;
      },
      (error) => {}
    )
    //======================== pappeal_send_to ======================================
    var student = JSON.stringify({
      "table_name" : "pappeal_send_to",
      "field_id" : "send_to_id",
      "field_name" : "send_to_name",
      "order_by" : " order_no ASC",
      "userToken" : this.userData.userToken
    });
    this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        this.getAppeal = getDataOptions;
      },
      (error) => {}
    )
  }

}
