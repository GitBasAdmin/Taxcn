import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
@Component({
  selector: 'app-popup-list-return-mapping',
  templateUrl: './popup-list-return-mapping.component.html',
  styleUrls: ['./popup-list-return-mapping.component.css']
})
export class  PopupListReturnMappingComponent implements AfterViewInit,OnInit {
  @Input() items : any = [];
  @Input() value1: string;//ชื่อตาราง
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
    this.showDataList();
  }

  ngAfterViewInit(): void {
    //console.log(this.items)
  }

  searchDataList(){

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    if(this.userData.depCode){
      var student = JSON.stringify({
        "search_id":this.formList.get("word_id")?.value,
        "search_desc":this.formList.get("word_desc")?.value,
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupListMapping', student , {headers:headers}).subscribe(
        datalist => {
          this.items = datalist;
          console.log(datalist)
        },
        (error) => {}
      );
    }
    
  }

  showDataList(){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    if(this.userData.depCode){
      var student = JSON.stringify({
        "dep_use": this.userData.depCode,
        "userToken":this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popupListMapping', student , {headers:headers}).subscribe(
        datalist => {
          this.items = datalist;
          console.log(datalist)
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
