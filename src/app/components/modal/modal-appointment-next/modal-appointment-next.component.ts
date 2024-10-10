import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
@Component({
  selector: 'app-modal-appointment-next',
  templateUrl: './modal-appointment-next.component.html',
  styleUrls: ['./modal-appointment-next.component.css']
})
export class ModalAppointmentNextComponent implements AfterViewInit,OnInit {
  @Input() items : any = [];
  @Input() run_id: string;//run_id
  @Input() split_app: number;//1 คือแยกนัด
  @Input() next_app: number;//1 คือนัดถัดไป
  @Output() onClickList = new EventEmitter<any>();
  
  sessData:any;
  userData:any;
  getPersType:any;
  result:any = [];

  constructor(
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService
  ) { 

  }

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.showDataList();
  }

  ngAfterViewInit(): void {
    //console.log(this.items)
  }

  showDataList(){
    if(this.run_id){
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      if(!this.split_app){
        var student = JSON.stringify({
          "run_id" : this.run_id,
          "userToken" : this.userData.userToken
        });
      }else{
        var student = JSON.stringify({
          "run_id" : this.run_id,
          "split_app" : this.split_app,
          "next_app" : this.next_app,
          "userToken" : this.userData.userToken
        });
      }
      
        console.log(student)
      this.http.post('/'+this.userData.appName+'ApiAP/API/APPOINT/getAppointData', student , {headers:headers}).subscribe(
        datalist => {
          let getDataOptions : any = JSON.parse(JSON.stringify(datalist));
          console.log(getDataOptions)
          if(getDataOptions.data.length){
            this.items = getDataOptions.data;
          }else{
            this.items = [];
          }
        },
        (error) => {}
      );
    }
  }
}
