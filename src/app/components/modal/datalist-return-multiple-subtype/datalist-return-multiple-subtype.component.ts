import { indexOf } from 'lodash';
import { filter } from 'rxjs/operators';
import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-datalist-return-multiple-subtype',
  templateUrl: './datalist-return-multiple-subtype.component.html',
  styleUrls: ['./datalist-return-multiple-subtype.component.css']
})
export class DatalistReturnMultipleSubtypeComponent implements AfterViewInit,OnInit {
  @Input() items : any = [];
  @Input() value1: number;//ชื่อตาราง
  @Input() value2: number;//รหัส
  @Input() value3: number;//รายละเอียด
  @Input() value4: number;//ค่าว่าง
  @Input() value5: number;//สแตนดาร์ด
  @Input() value6: number;//รายละเอียดเพิ่มเติม
  @Input() value7: number;//เงื่อนไข
  @Input() subtypegroup : any = [];
  @Input() groupdesc : any;
  @Output() onClickList = new EventEmitter<any>();
  @ViewChild('word_id',{static: true}) word_id : ElementRef;
  @ViewChild('word_desc',{static: true}) word_desc : ElementRef;
  masterSelect:boolean = false;
  formList: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService
  ) {
    this.formList = this.formBuilder.group({
      word_id: [''],
      word_desc: ['']
    })
  }

  ngOnInit(): void {
    //alert(99)
    //console.log(this.items)
    if(this.items)
    this.items.forEach((x : any ) => x.index = false);
    console.log('items==>',this.items);
    console.log('subtypegroup==>',this.subtypegroup);
  }

  ngAfterViewInit(): void {
     setTimeout(() => {
      //  var someResult = this.items.some((item) => {
      //    return item.selected == '1';
      //  })
      // if(someResult == true){
       console.log(this.items);
       this.items.forEach((ele,index,array) => {
             if(ele.getcheck != null)
             ele.index = true;
           });
      // }else{
      //   this.items.forEach((x : any ) => x.index = true);
      //   this.masterSelect = true;
      // }
     }, 1000);
  // setTimeout(() => {
  //       if(this.items){
  //         if(this.depgroup){
  //            var depgroup = this.depgroup.split(',');
  //          this.items.forEach((ele,index,array) => {
  //             // console.log(ele.fieldIdValue)
  //           if(depgroup.includes(ele.fieldIdValue.toString()))
  //             ele.index = true;
  //         });
  //         }else{
  //           this.items.forEach((x : any ) => x.index = true);
  //         }
  //        }
  //         //console.log(this.items)
  // }, 500);
  }

  searchDataList(){

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');

      var student = JSON.stringify({
        "table_name": this.value1,
        "field_id": this.value2,
        "field_name": this.value3,
        "field_name2": this.value5,
        "search_id":this.word_id.nativeElement.value,
        "search_desc":this.word_desc.nativeElement.value,
        "condition":this.value7
      });

      console.log(student)
      this.http.post('/crimApiUTIL/API/popup', student , {headers:headers}).subscribe(
        datalist => {
          this.items = datalist;
        },
        (error) => {}
      );


  }

  showDataList(){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');

      var student = JSON.stringify({
        "table_name": this.value1,
        "field_id": this.value2,
        "field_name": this.value3,
        "search_id":'',
        "search_desc":'',
        "condition":this.value7
      });
      console.log(student)
      this.http.post('/crimApiUTIL/API/popup', student , {headers:headers}).subscribe(
        datalist => {
          this.items = datalist;
          console.log(datalist)
        },
        (error) => {}
      );


  }

  // useDataList(){
  //   var dataSelect = [],dataTmpId=[],dataTmpName=[],dataTmpName2=[];
  //   var bar = new Promise((resolve, reject) => {
  //     this.items.forEach((ele, index, array) => {
  //           if(ele.index == true){
  //             dataTmpId.push(ele.fieldIdValue);
  //             dataTmpName.push(ele.fieldNameValue);
  //             if(this.value6)
  //               dataTmpName2.push(ele.fieldNameValue2);
  //           }
  //       });
  //   });
  //   if(bar){
  //     dataSelect['fieldIdValue'] = dataTmpId.toString();
  //     dataSelect['fieldNameValue'] = dataTmpName.toString();
  //     if(this.value6)
  //       dataSelect['fieldNameValue2'] = dataTmpName2.toString();
  //     //console.log($.extend({},dataSelect))
  //     this.onClickList.emit($.extend({},dataSelect))
  //   }
  // }

  useDataList(){
    var dataSelect = [],dataTmpId=[],dataTmpName=[],dataTmpName2=[];
    var bar = new Promise((resolve, reject) => {
      this.items.forEach((ele, index, array) => {
            if(ele.index == true){
             ele.selected = 1;
          }else{
            ele.selected = null;
          }
        });
    });
    if(bar){
      console.log(this.items);
      this.onClickList.emit($.extend({},this.items))
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
