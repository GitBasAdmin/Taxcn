import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
@Component({
  selector: 'app-modal-organization',
  templateUrl: './modal-organization.component.html',
  styleUrls: ['./modal-organization.component.css']
})
export class ModalOrganizationComponent implements AfterViewInit,OnInit {
  @Input() items : any = [];
  @Input() value1: string;//ชื่อตาราง
  @Input() value2: number;//รหัส
  @Input() value3: number;//รายละเอียด
  @Input() value4: number;//ค่าว่าง
  @Input() value5: number;//สแตนดาร์ด
  @Input() value6: number;//รายละเอียดเพิ่มเติม
  @Input() value7: number;//เงื่อนไข
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
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    //======================== plit_type ======================================
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
        this.result.word_id = 1;
        this.showDataList(1);
      },
      (error) => {}
    )
    
  }

  ngAfterViewInit(): void {
    //console.log(this.items)
  }

  showDataList(val:any){
    if(this.result.word_id){
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');
      if(val!=1)
        this.SpinnerService.show();
      var student = JSON.stringify({
        "pers_type" : this.result.word_id,
        "userToken" : this.userData.userToken
      });
        console.log(student)
      
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct0109/search', student , {headers:headers}).subscribe(
        datalist => {
          let getDataOptions : any = JSON.parse(JSON.stringify(datalist));
          console.log(getDataOptions)
          if(getDataOptions.data.length){
            this.items = getDataOptions.data;
            this.SpinnerService.hide();
          }else{
            this.items = [];
            this.SpinnerService.hide();
          }
        },
        (error) => {}
      );
    }
  }

  searchDataList(){
    if(this.result.word_id){
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type','application/json');

      this.SpinnerService.show();
      var student = JSON.stringify({
        "pers_type" : this.result.word_id,
        "pers_desc" : this.result.word_desc,
        "userToken" : this.userData.userToken
      });
        console.log(student)
      
      this.http.post('/'+this.userData.appName+'ApiCT/API/fct0109/search', student , {headers:headers}).subscribe(
        datalist => {
          let getDataOptions : any = JSON.parse(JSON.stringify(datalist));
          console.log(getDataOptions)
          if(getDataOptions.data.length){
            this.items = getDataOptions.data;
            this.SpinnerService.hide();
          }else{
            this.items = [];
            this.SpinnerService.hide();
          }
        },
        (error) => {}
      );
    }
  }

  onClickListData(index:any): void {
    //this.onClickList.emit(this.items[index][this.value2]+':'+this.items[index][this.value3])
    this.onClickList.emit(this.items[index])
  }

  

}
