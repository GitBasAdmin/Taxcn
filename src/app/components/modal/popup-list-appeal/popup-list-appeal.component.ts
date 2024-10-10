import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
@Component({
  selector: 'app-popup-list-appeal',
  templateUrl: './popup-list-appeal.component.html',
  styleUrls: ['./popup-list-appeal.component.css']
})
export class PopupListAppealComponent implements AfterViewInit,OnInit {
  @Input() run_id : number;
  @Output() onClickList = new EventEmitter<any>();
  masterSelect:boolean = false;
  formList: FormGroup;
  sessData:any;
  userData:any;
  items:any;
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

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.showDataList();
  }

  ngAfterViewInit(): void {
    //console.log(this.items)
  }

  

  showDataList(){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');

      var student = JSON.stringify({
        "run_id": this.run_id,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUD/API/APPEAL/popupListAppealCase', student , {headers:headers}).subscribe(
        datalist => {
          this.items = datalist;
          console.log(datalist)
        },
        (error) => {}
      );
    
    
  }

  useDataList(){
    var dataSelect = [],dataTmpId=[],dataTmpName=[],dataTmpName2=[];
    var bar = new Promise((resolve, reject) => {
      this.items.forEach((ele, index, array) => {
            if(ele.index == true){
              dataTmpId.push(ele.fieldIdValue);
              dataTmpName.push(ele.fieldNameValue);
            }
        });
    });
    if(bar){
      dataSelect['fieldIdValue'] = dataTmpId.toString();
      dataSelect['fieldNameValue'] = dataTmpName.toString();
      //console.log($.extend({},dataSelect))
      this.onClickList.emit($.extend({},dataSelect))
      
    }
  }

  checkUncheckAll(obj:any,master:any,child:any) {
    for (var i = 0; i < obj.length; i++) {
      obj[i][child] = this[master];
    }
  }

  isAllSelected(obj:any,master:any,child:any) {
    this[master] = obj.every(function(item:any) {
      return item[child] == true;
    })
  }

  onClickListData(index:any): void {
    //this.onClickList.emit(this.items[index][this.value2]+':'+this.items[index][this.value3])
    console.log(this.items[index])
    this.onClickList.emit(this.items[index])
  }

}
