import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef,OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
@Component({
  selector: 'app-modal-return-alle',
  templateUrl: './modal-return-alle.component.html',
  styleUrls: ['./modal-return-alle.component.css']
})
export class ModalReturnAlleComponent implements AfterViewInit,OnInit ,OnDestroy{
  maxAlleId:any;
  sessData:any;
  userData:any;
  @Input() items : any = [];
  @Input() types : number;//ประเภท Modal
  @Input() value1: number;//ชื่อตาราง
  @Input() value2: number;//รหัส
  @Input() value3: number;//รายละเอียด
  @Input() value4: number;//ค่าว่าง
  @Input() value5: number;//สแตนดาร์ด
  @Input() value6: number;//รายละเอียดเพิ่มเติม
  @Input() value8: number;//fileNameValue2

  //@Input() maxValue: number;//ค่าที่เริ่ม run
  @Input() set maxValue(maxValue: number) {
    this.maxAlleId=maxValue;
  }
  @Output() onClickList = new EventEmitter<any>();

  formList: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private authService: AuthService,
    public activeModal:NgbActiveModal
  ) { 
    this.formList = this.formBuilder.group({
      word_id: [''],
      word_desc: ['']
    })
  }

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
  }
  ngOnDestroy():void{
    
  }
  ngAfterViewInit(): void {
    //console.log(this.items)
  }

  searchDataList(){

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    if(!this.value8){
      var student = JSON.stringify({
        "table_name": this.value1,
        "field_id": this.value2,
        "field_name": this.value3,
        "search_id":this.formList.get("word_id")?.value,
        "search_desc":this.formList.get("word_desc")?.value 
      });
    }else{
      var student = JSON.stringify({
        "table_name": this.value1,
        "field_id": this.value2,
        "field_name": this.value3,
        "field_name2": this.value8,
        "search_id":this.formList.get("word_id")?.value,
        "search_desc":this.formList.get("word_desc")?.value 
      });
    }
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student , {headers:headers}).subscribe(
        datalist => {
          this.items = datalist;
        },
        (error) => {}
      );
    
    
  }

  showDataList(){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    if(!this.value8){
      var student = JSON.stringify({
        "table_name": this.value1,
        "field_id": this.value2,
        "field_name": this.value3,
        "search_id":'',
        "search_desc":'' 
      });
    }else{
      var student = JSON.stringify({
        "table_name": this.value1,
        "field_id": this.value2,
        "field_name": this.value3,
        "field_name2": this.value8,
        "search_id":'',
        "search_desc":'' 
      });
    }
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/popup', student , {headers:headers}).subscribe(
        datalist => {
          this.items = datalist;
        },
        (error) => {}
      );

    
  }
  getDataList(): void{
    var data=[];

    $("table.bordered tbody tr input[type='checkbox']:checked").each(function(e){
      data.push({  
        alle_seq: $(this).closest("tr").find("input[type='text']").val(),  
        alle_running: $(this).closest("tr").find("input[id^='alle_running[']").val(),
        alle_id : $(this).closest("tr").find("input[id^='alle_id[']").val(),
        alle_name : $(this).closest("tr").find("input[id^='alle_name[']").val(),
      });  
    //if(data.length>0){
    //}
    }).promise().done(function () { 
      return;
    });
    if(data.length){
      this.onClickList.emit(data)
      this.activeModal.close(data)
    }
  }

  //แก้ไข 26/1/2566 chromes Event.path (Removed)
  //event.composedPath() เปลี่ยนเป็น event.composedPath()
  clickText(event:any){
    console.log()
    if(event.target.value){
      this.reSeq(event.target.value);
      $(event.composedPath()).closest("tr").find("input[type='text']").val('');
      $(event.composedPath()).closest("tr").find("input[type='checkbox']").prop("checked",false);
    }else{
      $(event.composedPath()).val(this.maxAlleId++);
      $(event.composedPath()).closest("tr").find("input[type='checkbox']").prop("checked",true);
    }
  }
  clickCheckbox(event:any){
    console.log(event)
    if($(event.composedPath()).prop("checked")==true){
      $(event.composedPath()).closest("tr").find("input[type='text']").val(this.maxAlleId++);
    }else{
      this.reSeq($(event.composedPath()).closest("tr").find("input[type='text']").val());
      $(event.composedPath()).closest("tr").find("input[type='text']").val('');
    }
  }
  clickTr(event:any){
    console.log(event)
    if(event.composedPath().localName =='td'){
      if($(event.composedPath()).closest("tr").find("input[type='checkbox']").prop("checked")==true){
        $(event.composedPath()).closest("tr").find("input[type='checkbox']").prop("checked",false);
        this.reSeq($(event.composedPath()).closest("tr").find("input[type='text']").val());
        $(event.composedPath()).closest("tr").find("input[type='text']").val('');
      }else{
        $(event.composedPath()).closest("tr").find("input[type='checkbox']").prop("checked",true);
        $(event.composedPath()).closest("tr").find("input[type='text']").val(this.maxAlleId++);
      }
    }
  }
  reSeq(val:any){
    //console.log(val+":"+$("table.bordered tbody tr").length)
    $("table.bordered tbody tr").each(function(e){
      var thisVal = Number($(this).find("input[type='text']").val());
      console.log('thisVal : ',thisVal,'val : ',val)
      var value = parseInt(val);
      if(thisVal > value){
      //แก้ไข 26/1/2566 chromes Event.path (Removed)
      // if(parseInt((document.getElementById('alle_seq['+e+']') as HTMLInputElement).value)>parseInt(val)){      
        $(this).find("input[type='text']").val(parseInt((document.getElementById('alle_seq['+e+']') as HTMLInputElement).value)-1)
      }
    })

    //document.getElementById('max').value=parseInt(document.getElementById('max').value)-1;
    this.maxAlleId = this.maxAlleId-1;
    
  }
  onClickListData(index:any): void {
    //this.onClickList.emit(this.items[index][this.value2]+':'+this.items[index][this.value3])
    this.onClickList.emit(this.items[index])
    this.activeModal.close(this.items[index])
  }

}
