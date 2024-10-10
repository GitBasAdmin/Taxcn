import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Input,Output,EventEmitter   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap'; 
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { AuthService } from 'src/app/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ModalConfirmComponent } from '@app/components/modal/modal-confirm/modal-confirm.component';

import {Observable,of, Subject  } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
@Component({
  selector: 'app-fud0100-main',
  templateUrl: './fud0100-main.component.html',
  styleUrls: ['./fud0100-main.component.css']
})
export class Fud0100MainComponent implements AfterViewInit, OnInit, OnDestroy {
  widthSet:any;
  dtOptions2: DataTables.Settings = {};
  sendHead:any;
  sendEdit:any;
  dataSearch:any =[];
  sessData:any;
  userData:any;
  appealRunning:any;
  tab:any;
  delIndex:any;
  modalType:any;
  dtTrigger: Subject<any> = new Subject<any>();
  public loadModalConfComponent_main: boolean = false;
  @Input() set getDataHead(getDataHead: any) {//รับจาก fud0100 เลขคดี
    console.log(getDataHead)
    if(typeof getDataHead !='undefined'){
      this.sendHead = getDataHead;
      if(this.sendHead.run_id)
        this.getAppealData(this.sendHead.run_id);
    }
  }
  @Input() set appeal_running(appeal_running: any) {//รับ appeal_running จาก fud0100 
    console.log(appeal_running)
    if(typeof appeal_running !='undefined'){
      this.appealRunning = appeal_running;
    }
  }

  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  @ViewChild('tabGroup',{static: true}) tabGroup : ElementRef;
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.dtOptions2 = {
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false,
      destroy : true
    };
    //console.log(this.sendHead.run_id)
    //if(this.sendHead.run_id)
      //this.getAppealData(this.sendHead.run_id);
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    // Destroy the table first
    dtInstance.destroy();
    // Call the dtTrigger to rerender again
    this.dtTrigger.next(null);
      });}
      
 ngAfterViewInit(): void {
    this.dtTrigger.next(null);
     }
    
  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

    assignWidth(obj:any){
      //console.log(obj.index)
      //console.log(obj)
      this.tab = {'tabIndex' : obj.index,'counter' : Math.ceil(Math.random()*10000)}
      console.log(obj.index)
      console.log(this.sendEdit)
      if(obj.index!=0 && (!this.sendEdit || this.sendEdit.data.appeal_running==0)){
        //alert(99)
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        confirmBox.setMessage('ไม่พบข้อมูลยื่นอุทธรณ์/ฎีกา กรุณาเลือกรายการอุทธรณ์/ฎีกาเพื่อแก้ไข');
        confirmBox.setButtonLabels('ตกลง');
        confirmBox.setConfig({
            layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
        });
        const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
          if (resp.success==true){}
          subscription.unsubscribe();
        });
      }
      if(obj.index==0)
        this.widthSet="100%";
      else if(obj.index==1)
        this.widthSet="3050px";
      else if(obj.index==2)
        this.widthSet="3050px";
        else if(obj.index==3)
        this.widthSet="3050px";
      else if(obj.index==4)
        this.widthSet="100%";
    }

    getAppealData(run_id:any){
      const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
        this.SpinnerService.show();
        var student = JSON.stringify({
          "run_id": run_id,
          "userToken" : this.userData.userToken
        });
        console.log(student)
          this.http.post('/'+this.userData.appName+'ApiUD/API/APPEAL/fud0100/getData', student ).subscribe(
          (response) =>{
            let getDataOptions : any = JSON.parse(JSON.stringify(response));
            console.log(getDataOptions)
            if(getDataOptions.result==1){
                //-----------------------------//
                if(getDataOptions.data.length){
                  this.dataSearch = getDataOptions.data;
                  //this.dataSearch.forEach((x : any ) => x.cFlag = x.cancel_flag);
                  //this.dtTrigger.next(null);
                  //if(this.appealRunning)
                    this.sendEditData(this.appealRunning,2);
                  this.SpinnerService.hide();
                  this.rerender();
                }else{
                  this.dataSearch = [];
                  //this.dtTrigger.next(null);
                  this.SpinnerService.hide();
                  this.rerender();
                }
                //-----------------------------//
            }else{
              this.dataSearch = [];
              this.SpinnerService.hide();
              this.rerender();
              //-----------------------------//
              /*
                confirmBox.setMessage(getDataOptions.error);
                confirmBox.setButtonLabels('ตกลง');
                confirmBox.setConfig({
                    layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                });
                const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                  if (resp.success==true){}
                  subscription.unsubscribe();
                });
                */
              //-----------------------------//
            }
  
          },
          (error) => {}
        )
    }

    delData(i:any){
      this.delIndex = i;
      this.clickOpenMyModalComponent(1);
    }
    /*
    delData(i:any){
      this.delIndex = i;
      this.clickOpenMyModalComponent(1);
    }*/
  
    clickOpenMyModalComponent(type:any){
      this.modalType = type;
      this.openbutton.nativeElement.click();
    }
    loadMyModalComponent(){
      $(".modal-backdrop").remove();
      if(this.modalType==1){
        $("#exampleModal_main").find(".modal-content").css("width","650px");
          this.loadModalConfComponent_main = true;
          $("#exampleModal_main").find(".modal-content").css("width","650px");
          $("#exampleModal_main").find(".modal-body").css("height","auto");
          $("#exampleModal_main").css({"background":"rgba(51,32,0,.4)"});
      }
      
      
    }
  
    submitModalForm(){
      var chkForm = JSON.parse(this.child.ChildTestCmp());
        const confirmBox = new ConfirmBoxInitializer();
        confirmBox.setTitle('ข้อความแจ้งเตือน');
    
        if(!chkForm.password){
          confirmBox.setMessage('กรุณาป้อนรหัสผ่าน');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){
              //this.SpinnerService.hide();
            }
            subscription.unsubscribe();
          });
          
        }else if(!chkForm.log_remark){
          confirmBox.setMessage('กรุณาป้อนเหตุผล');
          confirmBox.setButtonLabels('ตกลง');
          confirmBox.setConfig({
              layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
          });
          const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
            if (resp.success==true){
              //this.SpinnerService.hide();
            }
            subscription.unsubscribe();
          });
        }else{
          
          var student = JSON.stringify({
            "user_running" : this.userData.userRunning,
            "password" : chkForm.password,
            "log_remark" : chkForm.log_remark,
            "userToken" : this.userData.userToken
          });
          this.http.post('/'+this.userData.appName+'Api/API/checkPassword', student ).subscribe(
              posts => {
                let productsJson : any = JSON.parse(JSON.stringify(posts));
                console.log(productsJson)
                if(productsJson.result==1){
  
                    //console.log(this.delIndex)
                    const confirmBox2 = new ConfirmBoxInitializer();
                    confirmBox2.setTitle('ยืนยันการลบข้อมูล');
                    confirmBox2.setMessage('ต้องการลบข้อมูล ใช่หรือไม่');
                    confirmBox2.setButtonLabels('ตกลง', 'ยกเลิก');
                     
                      confirmBox2.setConfig({
                          layoutType: DialogLayoutDisplay.DANGER // SUCCESS | INFO | NONE | DANGER | WARNING
                      });
                      const subscription2 = confirmBox2.openConfirmBox$().subscribe(resp => {
                          if (resp.success==true){
                            
                            if(this.modalType==1){
                              /*
                              var dataDel = [],dataTmp=[];
                              dataDel['log_remark'] = chkForm.log_remark;
                              dataDel['userToken'] = this.userData.userToken;
                              dataTmp.push(this.appealData[this.delIndex]);
                              dataDel['data'] = dataTmp;
                              var data = $.extend({}, dataDel);
                              console.log(data)*/
                              var student = this.dataSearch[this.delIndex];
                              student['log_remark'] = chkForm.log_remark;
                              student["userToken"] = this.userData.userToken;
                              console.log(student)
                              this.http.post('/'+this.userData.appName+'ApiUD/API/APPEAL/fud0100/deleteData', student).subscribe(
                                (response) =>{
                                  let getDataOptions : any = JSON.parse(JSON.stringify(response));
                                  console.log(getDataOptions)
                                  const confirmBox3 = new ConfirmBoxInitializer();
                                  confirmBox3.setTitle('ข้อความแจ้งเตือน');
                                  if(getDataOptions.result==1){
                                      //-----------------------------//
                                      confirmBox3.setMessage('ลบข้อมูลเรียบร้อยแล้ว');
                                      confirmBox3.setButtonLabels('ตกลง');
                                      confirmBox3.setConfig({
                                          layoutType: DialogLayoutDisplay.SUCCESS // SUCCESS | INFO | NONE | DANGER | WARNING
                                      });
                                      const subscription3 = confirmBox3.openConfirmBox$().subscribe(resp => {
                                        if (resp.success==true){
                                          //this.setDefPage();
                                          this.getAppealData(this.sendHead.run_id)
                                        }
                                        subscription3.unsubscribe();
                                      });
                                      //-----------------------------//
                      
                                  }else{
                                    //-----------------------------//
                                      confirmBox3.setMessage(getDataOptions.error);
                                      confirmBox3.setButtonLabels('ตกลง');
                                      confirmBox3.setConfig({
                                          layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                                      });
                                      const subscription3 = confirmBox3.openConfirmBox$().subscribe(resp => {
                                        if (resp.success==true){
                                          this.SpinnerService.hide();
                                        }
                                        subscription3.unsubscribe();
                                      });
                                    //-----------------------------//
                                  }
                      
                                },
                                (error) => {}
                              )
                            }
                            
                            
                          }
                          subscription2.unsubscribe();
                      });   
                      
                  
                  this.closebutton.nativeElement.click();
                }else{
                  confirmBox.setMessage(productsJson.error);
                  confirmBox.setButtonLabels('ตกลง');
                  confirmBox.setConfig({
                      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                  });
                  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                    if (resp.success==true){}
                    subscription.unsubscribe();
                  });
                }
              },
              (error) => {}
            );
    
        }
    }
  
    closeModal(){
      this.loadModalConfComponent_main = false;
    }

    sendEditData(i:any,type:any){
      this.tabGroup['_indexToSelect'] = 0;
      var sendData:any;
      console.log(i)
      if(type==1){
        sendData = this.dataSearch[i];
      }else{
        if(typeof i ==='object')
          var fine = this.dataSearch.filter((x:any) => x.appeal_running === parseInt(i.appeal_running));
        else
          var fine = this.dataSearch.filter((x:any) => x.appeal_running === parseInt(i));
        if(fine.length){
          sendData = fine[0];
        }else{
          sendData = i;
        }
      }
      this.sendEdit = {'data':sendData,'counter' : Math.ceil(Math.random()*10000)}
    }

    receiveTab1Data(event:any){
      console.log(event)
      this.getAppealData(event.run_id)
      this.appealRunning = {'appeal_running' : event.appeal_running,'counter' : Math.ceil(Math.random()*10000)};
    }
}
