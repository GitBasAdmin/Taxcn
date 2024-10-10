import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
@Component({
  selector: 'app-popup-case-appointment',
  templateUrl: './popup-case-appointment.component.html',
  styleUrls: ['./popup-case-appointment.component.css']
})
export class PopupCaseAppointmentComponent implements AfterViewInit,OnInit {
  @Input() items : any = [];
  @Input() run_id: string;//run_id
  @Input() case_running: string;//case_running
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
  }

  showDataList(){
    if(this.run_id && this.case_running){
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      var student = JSON.stringify({
        "run_id" : this.run_id,
        "case_running" : this.case_running,
        "userToken" : this.userData.userToken
      });
      this.http.post('/'+this.userData.appName+'ApiJU/API/JUDGEMENT/fju0600/getMapCase', student , {headers:headers}).subscribe(
        datalist => {
          let getDataOptions : any = JSON.parse(JSON.stringify(datalist));
          console.log(getDataOptions)
          if(getDataOptions.data.length > 0){
            this.items = getDataOptions.data;
            this.items.forEach((x : any ) => this.items.includes(x.map_case_running) != null?x.index = true:x.index = false );

            var bar = new Promise((resolve, reject) => {
              getDataOptions.data.forEach((ele, index, array) => {
                    if(ele.map_case_running == null){
                      this.items[index].index = false;
                    }else{
                      this.items[index].index = true;
                    }
                });
            });
          }else{
            this.items = [];
          }
        },
        (error) => {}
      );
    }
  }

  isAllSelected(obj:any,master:any,child:any) {
    console.log(this.items);
    this[master] = obj.every(function(item:any) {
      return item[child] == true;
    })
  }

  onClickSaveData(){
    var dataSelect = [],dataTmpId=[],dataTmpName=[],dataTmpName2=[];
    var bar = new Promise((resolve, reject) => {
      this.items.forEach((ele, index, array) => {
            if(ele.index == true){
              dataSelect.push(ele);
            }
        });
    });
    if(bar){   
      // this.onClickList.emit($.extend({},dataSelect))  
      this.onClickList.emit(this.items)  
    }
  }
}
