import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/auth.service';
import { NgxSpinnerService } from "ngx-spinner"; 
@Component({
  selector: 'app-datalist-conciliate',
  templateUrl: './datalist-conciliate.component.html',
  styleUrls: ['./datalist-conciliate.component.css']
})
export class DatalistConciliateComponent implements AfterViewInit,OnInit {
  @Input() items : any = [];
  @Input() value1: number;//ชื่อตาราง
  @Input() value2: number;//รหัส
  @Input() value3: number;//รายละเอียด
  @Input() value4: number;//ค่าว่าง
  @Input() value5: number;//สแตนดาร์ด
  @Input() value6: number;//รายละเอียดเพิ่มเติม
  @Input() value7: number;//เงื่อนไข
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
  }

  ngAfterViewInit(): void {
    console.log(this.items)
  }

  searchDataList(){

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');

      var student = JSON.stringify({
        "conciliate_id":this.formList.get("word_id")?.value,
        "conciliate_name":this.formList.get("word_desc")?.value,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupConciliate', student , {headers:headers}).subscribe(
        datalist => {
          this.items = datalist;
          console.log(datalist)
        },
        (error) => {}
      );
  }

  showDataList(){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');

      var student = JSON.stringify({
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupConciliate', student , {headers:headers}).subscribe(
        datalist => {
          console.log(datalist)
          this.items = datalist;
          console.log(datalist)
        },
        (error) => {}
      );
    
    
  }

  onClickListData(index:any): void {
    //this.onClickList.emit(this.items[index][this.value2]+':'+this.items[index][this.value3])
    this.items[index]['fieldIdValue'] = this.items[index]['conciliate_id'];
    delete this.items[index]['conciliate_id'];
    this.items[index]['fieldNameValue'] = this.items[index]['conciliate_name'];
    delete this.items[index]['conciliate_name'];
    this.onClickList.emit(this.items[index])
  }

}
