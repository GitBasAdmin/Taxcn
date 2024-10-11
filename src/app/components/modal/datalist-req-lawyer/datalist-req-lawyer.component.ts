import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from 'src/app/auth.service';
@Component({
  selector: 'app-datalist-req-lawyer',
  templateUrl: './datalist-req-lawyer.component.html',
  styleUrls: ['./datalist-req-lawyer.component.css']
})
export class DatalistReqLawyerComponent implements AfterViewInit,OnInit {
  @Input() items : any = [];
  @Input() value1: string;//ชือ/สกุล
  @Input() value2: string;//ใบอนุญาต
  @Input() value3: string;//วันที่หมดอายุ
  @Input() value4: string;//ผลคำสั่ง
  @Input() value5: string;//วันที่สั่งพักใบอนุญาต
  @Input() value6: string;//ระยะเวลาพักใบอนุญาต
  @Input() value7: string;//วันที่ครบกำหนด
  @Input() value8: string;//ถอนใบอนุญาตตลอดชีพ
  @Output() onClickList = new EventEmitter<any>();

  formList: FormGroup;
  sessData:any;
  userData:any;
  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService
  ) {
    this.formList = this.formBuilder.group({
      word_id: [''],
      word_desc: ['']
    })
  }

  ngOnInit(): void {
    //alert(99)
    //console.log(this.items)
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.loadDataList();
  }

  ngAfterViewInit(): void {
    //console.log(this.items)
  }

  loadDataList(){

      this.SpinnerService.show();
      var student = JSON.stringify({
         "userToken" : this.userData.userToken
      });
        console.log(student)

      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupReqLawyer', student ).subscribe(
        datalist => {
          let getDataOptions : any = JSON.parse(JSON.stringify(datalist));

          console.log(getDataOptions)
          if(getDataOptions.length==1){
            this.items = getDataOptions;
            this.SpinnerService.hide();
          }else{
            this.items = [];
            this.SpinnerService.hide();
          }
        },
        (error) => {}
      );
      console.log('oooooo');
      console.log(this.items);
      console.log('xxxx');

  }

  searchDataList(){

      var student = JSON.stringify({
        "userToken" : this.userData.userToken,
        "search_id":this.formList.get("word_id")?.value,
        "search_desc":this.formList.get("word_desc")?.value,
        "condition":this.value7
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupReqLawyer', student ).subscribe(
        datalist => {
          this.items = datalist;
          console.log(datalist)
        },
        (error) => {}
      );

   }

  showDataList(){
    var student = JSON.stringify({
      "userToken" : this.userData.userToken
   });
      console.log(student)
      this.http.post('/'+this.userData.appName+'taxcApiUTIL/API/popupReqLawyer', student ).subscribe(
        datalist => {
          this.items = datalist;
          console.log(datalist)
        },
        (error) => {}
      );
  }

  onClickListData(index:any): void {
    //this.onClickList.emit(this.items[index][this.value2]+':'+this.items[index][this.value3])
    this.onClickList.emit(this.items[index])
  }



}
