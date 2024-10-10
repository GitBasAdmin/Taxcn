import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { AuthService } from 'src/app/auth.service';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
@Component({
  selector: 'app-modal-receipt',
  templateUrl: './modal-receipt.component.html',
  styleUrls: ['./modal-receipt.component.css']
})
export class ModalReceiptComponent implements AfterViewInit,OnInit {
  @Input() items : any = [];
  @Input() run_id: number;//run_id
  @Input() notice_running: number;//run_id
  @Input() send_item: number;//run_id
  @Input() sent_amt: any;//run_id
  @Input() send_data: any;
  @Output() onClickList = new EventEmitter<any>();
  
  sessData:any;
  userData:any;
  getPersType:any;
  result:any = [];
  itemsTmp:any;
  sentAmt:any;

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
    this.sentAmt = parseFloat(this.sent_amt);
    //console.log(this.run_id+':'+this.notice_running+':'+this.send_item+':'+this.sent_amt)
  }

  ngAfterViewInit(): void {
    //console.log(this.items)
  }

  showDataList(){
    if(this.run_id){
      this.sentAmt = parseFloat(this.sent_amt);
      if(!this.send_item)
        var send_item = 0;
      else
        var send_item = this.send_item;
      var student = JSON.stringify({
        "run_id" : this.run_id,
        "notice_running" : this.notice_running,
        "send_item" : send_item,
        "userToken" : this.userData.userToken
      });
        console.log(student)
      this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fsn1600/popupNoticeReceipt', student ).subscribe(
        datalist => {
          let getDataOptions : any = JSON.parse(JSON.stringify(datalist));
          console.log(getDataOptions)
          if(getDataOptions.data.length){
            this.items = getDataOptions.data;
            this.itemsTmp = JSON.parse(JSON.stringify(getDataOptions.data));
            for (var x = 0; x < this.items.length; x++) {
              if(this.items[x]['sel']){
                this.items[x].index = true;
              }else{
                this.items[x].index = false;
              }
            }
            //this.items.forEach((x : any ) => x.index = false);
          }else{
            this.items = this.itemsTmp = [];
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

  assign(index:any,check:any){
    
    //var itemsTmp = $.extend([],JSON.parse(this.itemsTmp));
    
      if(check==true){

          if(this.sentAmt>0){//ถ้าอัตราค่านำหมายยังมีค่า
            if(parseFloat(this.sentAmt)<=this.items[index].remain_amt){//ถ้าค่านำหมายน้อยกว่ายอดคงเหลือ
              this.items[index].reserv_amt = parseFloat(this.items[index].reserv_amt) + parseFloat(this.sentAmt);
              this.items[index].remain_amt = parseFloat(this.items[index].sum_fee) - parseFloat(this.items[index].reserv_amt);
              this.items[index].sent_amt = parseFloat(this.sentAmt);
              this.sentAmt = 0;
            }else{//ถ้าค่านำหมายมากกว่ายอดคงเหลือ
              if(this.items[index].remain_amt>0){//ถ้ายอดคงเหลือยังมีค่า
                this.sentAmt = parseFloat(this.sentAmt) - parseFloat(this.items[index].remain_amt);
                this.items[index].sent_amt = parseFloat(this.items[index].remain_amt);
                this.items[index].reserv_amt = parseFloat(this.items[index].reserv_amt) + parseFloat(this.items[index].remain_amt);
                this.items[index].remain_amt = 0;
              }
            }
          }

      }else{
        this.items[index].reserv_amt = this.itemsTmp[index].reserv_amt;
        this.items[index].remain_amt = this.itemsTmp[index].remain_amt;
        if(this.items[index].sent_amt){
          this.sentAmt = parseFloat(this.sentAmt) + parseFloat(this.items[index].sent_amt);
          this.items[index].sent_amt = null;
        }
      }
    console.log(this.items)
  }

  onClickListData(index:any): void {
    this.onClickList.emit(this.items[index])
  }

  saveData(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');

    var chk = 0,receipt = [];
    var bar = new Promise((resolve, reject) => {
      this.items.forEach((ele, index, array) => {
        if(ele.index == true){
          this.items[index]['sel'] = 1;
        }else{
          this.items[index]['sel'] = 0;
        }
        receipt.push(this.items[index]);
      });
    });
    if(bar){
      
        let headers = new HttpHeaders();
            headers = headers.set('Content-Type','application/json');
            
            var arrayData = [];
            arrayData['data'] = receipt;
            arrayData['send_data'] = [$.extend({},this.send_data)];
            arrayData['userToken'] = this.userData.userToken;
            var student = $.extend({},arrayData);
            console.log(student)
          
            this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fsn1600/saveNoticeReceipt', student , {headers:headers}).subscribe(
              (response) =>{
                let getDataOptions : any = JSON.parse(JSON.stringify(response));
                console.log(getDataOptions)
                if(getDataOptions.result==1){
                    confirmBox.setMessage(getDataOptions.error);
                    confirmBox.setButtonLabels('ตกลง');
                    confirmBox.setConfig({
                       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                    });
                    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                      if(resp.success==true){
                        this.onClickList.emit(this.notice_running);
                      }
                      subscription.unsubscribe();
                    });
                }else{
                  //-----------------------------//
                    confirmBox.setMessage(getDataOptions.error);
                    confirmBox.setButtonLabels('ตกลง');
                    confirmBox.setConfig({
                       layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                    });
                    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                      if(resp.success==true){
                        
                      }
                      subscription.unsubscribe();
                    });
                  //-----------------------------//
                }

              },
              (error) => {}
            )

    }
  }

  cancelData(){
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle('ข้อความแจ้งเตือน');
    var student = JSON.stringify({
      "notice_running" : this.notice_running,
      "send_item" : this.send_item,
      "userToken" : this.userData.userToken
    });
      console.log(student)
      let headers = new HttpHeaders();
            headers = headers.set('Content-Type','application/json');
      this.http.post('/'+this.userData.appName+'ApiNO/API/NOTICE/fsn1600/delNoticeReceipt', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          if(getDataOptions.result==1){
              confirmBox.setMessage(getDataOptions.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                 layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if(resp.success==true){
                  this.onClickList.emit(this.notice_running);
                }
                subscription.unsubscribe();
              });
          }else{
            //-----------------------------//
              confirmBox.setMessage(getDataOptions.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                 layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if(resp.success==true){
                  
                }
                subscription.unsubscribe();
              });
            //-----------------------------//
          }

        },
        (error) => {}
      )
  }

  

}
