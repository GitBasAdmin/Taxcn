import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// import { AnyTxtRecord } from 'dns';
import * as $ from 'jquery';
import { event } from 'jquery';
@Component({
  selector: 'app-modal-material',
  templateUrl: './modal-material.component.html',
  styleUrls: ['./modal-material.component.css']
})
export class ModalMaterialComponent implements AfterViewInit,OnInit {
  @Input() run_id : any;
  @Input() types : number;//ประเภท Modal
  // types=1 prdo1600
  @Output() onClickList = new EventEmitter<any>();
  sessData:any;
  userData:any;
  modalType:any;
  items : any = [];
  getCaseCate:any;
  value6Array:any;
  masterSelect:boolean = false;
  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    public activeModal:NgbActiveModal
  ) { 
    
  }

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.showDataList();
  }

  ngAfterViewInit(): void {
    //console.log(this.items)
    console.log($('body').find(".tblMaterial").closest(".modal-content"))
    $('body').find(".tblMaterial").closest(".modal-content").css("width","800px");
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

  
  showDataList(){
    var student = JSON.stringify({
      "run_id" : this.run_id,
      "userToken" : this.userData.userToken
    });
    console.log(student)
    this.http.post('/'+this.userData.appName+'ApiDO/API/KEEPB/fdo0200/getMaterial', student).subscribe(
      (response) =>{
        let getDataOptions : any = JSON.parse(JSON.stringify(response));
        console.log(getDataOptions)
        this.items = getDataOptions;
        this.items.forEach((x : any ) => x.index = false);
      },
      (error) => {}
    )
  }

  useDataList(){
    var dataSelect = [],dataTmpId=[],dataTmpName=[],dataTmpName2=[];
    console.log(this.types);
    if(!this.types){
      var bar = new Promise((resolve, reject) => {
        this.items.forEach((ele, index, array) => {
              if(ele.index == true){
                dataTmpName.push('เอกสาร'+(ele.lit_type_desc ? ele.lit_type_desc : '')+' '+(ele.doc_no ? ele.doc_no : ''));
              }
          });
      });
      if(bar){
        dataSelect['fieldNameValue'] = dataTmpName.toString();
        this.activeModal.close($.extend({},dataSelect))
      }
    }else{
      dataTmpName['receipt_from']=[]; dataTmpName['lit_type_desc']=[];
      dataTmpName['doc_no']=[]; dataTmpName['page_no']=0;
      var bar = new Promise((resolve, reject) => {
        this.items.forEach((ele, index, array) => {
          if(ele.index == true){
            if(ele.receipt_from)
              dataTmpName['receipt_from'].push(ele.receipt_from);
            if(ele.lit_type_desc)
              dataTmpName['lit_type_desc'].push(ele.lit_type_desc);
            if(ele.doc_no)
              dataTmpName['doc_no'].push(ele.doc_no);
            if(ele.page_no)
              dataTmpName['page_no']+=parseInt(ele.page_no);
          }
        });
      });
      if(bar){
        dataSelect['receipt_from'] = dataTmpName['receipt_from'].toString();
        dataSelect['lit_type_desc'] = dataTmpName['lit_type_desc'].toString();
        dataSelect['doc_no'] = dataTmpName['doc_no'].toString();
        dataSelect['page_no'] = dataTmpName['page_no'].toString();
        console.log(dataSelect);
        this.activeModal.close($.extend({},dataSelect))
      }
    }
  }

  onClickListData(index:any): void {
    if(!this.types)
      this.activeModal.close({'fieldNameValue' : 'เอกสาร'+
      (this.items[index].lit_type_desc ? this.items[index].lit_type_desc : '')+' '+
      (this.items[index].doc_no ? this.items[index].doc_no : '')})
    else
      this.activeModal.close(this.items[index])
  }
}