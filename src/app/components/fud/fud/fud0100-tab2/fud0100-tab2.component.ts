import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Input,Output,EventEmitter,AfterContentInit,ViewChildren, QueryList,ViewEncapsulation   } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { AuthService } from 'src/app/auth.service';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { ModalConfirmComponent } from '@app/components/modal/modal-confirm/modal-confirm.component';

declare var myExtObject: any;
@Component({
  selector: 'app-fud0100-tab2',
  templateUrl: './fud0100-tab2.component.html',
  styleUrls: ['./fud0100-tab2.component.css']
})
export class Fud0100Tab2Component implements OnInit {
  dtOptions2: DataTables.Settings = {};
  dtTrigger_2: Subject<any> = new Subject<any>();
  sendEditData:any = [];
  myExtObject: any;
  viewInit:any;
  dataHead:any;
  sessData:any;
  userData:any;
  result:any = [];
  AppealReqData:any = [];
  modalType:any;
  delIndex:any;
  public loadModalConfComponent: boolean = false;
  @Input() set getDataHead(getDataHead: any) {//รับจาก fju0100
    //console.log(getDataHead)
    this.dataHead = getDataHead;
  }
  @Input() set sendEdit(sendEdit: any) {
    //console.log(sendEdit)
    this.sendEditData = [];
    if(typeof sendEdit !='undefined')
      this.getSendEditData(sendEdit.data);
    
  }
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 
  @ViewChild( ModalConfirmComponent ) child: ModalConfirmComponent ;
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  @ViewChild('closebutton',{static: true}) closebutton : ElementRef;
  @ViewChild('openbutton',{static: true}) openbutton : ElementRef;
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.dtOptions2 = {
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false,
      destroy:true
    };
    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    //this.rerender();
    this.setDefPage();
  }

  setDefPage(){
    this.result.n_type1 = 2;
  }

  rerender(): void {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      //console.log(dtElement.dtInstance) 
      if(dtElement.dtInstance)
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
      });
    });
    this.dtTrigger_2.next(null);
  }

  ngAfterViewInit(): void {
   this.dtTrigger_2.next(null);
   this.viewInit = 1;
  }
    
  ngOnDestroy(): void {
      this.dtTrigger_2.unsubscribe();
    }

  getSendEditData(obj:any){
    console.log(obj)
    if(typeof obj =='undefined')
      this.sendEditData = [];
    else{
      if(obj.appeal_running!=0){
        this.sendEditData = [obj];
        this.loadData('');
      }
    }
    if(this.viewInit){
      this.dtTrigger_2.next(null);
      //console.log(this.sendEditData)
      //this.rerender();
      //alert(99)
      //console.log(this.dtElement.dtInstance["__zone_symbol__value"]["context"][0].DataTables_Table_2;

    }
      //this.rerender();
    
    console.log(this.sendEditData)
  }

  gotoFkbPage(){
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    var name = 'fkb0100';
    if(this.sendEditData.length)
      myExtObject.OpenWindowMaxName(winURL+'fkb0100?run_id='+this.dataHead.run_id+'&appeal_running='+this.sendEditData[0].appeal_running,name);
  }

  gotoFudPage(){
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    var name = 'fud0113';
    if(this.sendEditData.length)
      myExtObject.OpenWindowMaxName(winURL+'fud0113?run_id='+this.dataHead.run_id+'&appeal_running='+this.sendEditData[0].appeal_running,name);
  }

  loadData(val:any){
    const confirmBox = new ConfirmBoxInitializer();
      confirmBox.setTitle('ข้อความแจ้งเตือน');
    if(typeof this.dataHead !='undefined'){
      var student = JSON.stringify({
        "run_id" : this.dataHead.run_id?this.dataHead.run_id:0,
        "appeal_running" : this.sendEditData[0].appeal_running,
        "n_type" : val?val:this.result.n_type1,
        "userToken" : this.userData.userToken
      });
      console.log(student)
      this.http.post('/'+this.userData.appName+'ApiUD/API/APPEAL/fud0100/getAppealRequest', student ).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          if(getDataOptions.result==1){
              //-----------------------------//
                this.AppealReqData = getDataOptions.data;
                this.rerender();
              //-----------------------------//
          }else{
            //-----------------------------//
              confirmBox.setMessage(getDataOptions.error);
              confirmBox.setButtonLabels('ตกลง');
              confirmBox.setConfig({
                  layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
              });
              const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                if (resp.success==true){
                  this.AppealReqData = [];
                  this.rerender();
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

  delData(i:any){
    this.delIndex = i;
    this.clickOpenMyModalComponent(1);
  }

  clickOpenMyModalComponent(type:any){
    this.modalType = type;
    this.openbutton.nativeElement.click();
  }
  loadMyModalComponent(){
    $(".modal-backdrop").remove();
    if(this.modalType==1){
      $("#exampleModal3").find(".modal-content").css("width","650px");
        this.loadModalConfComponent = true;
        $("#exampleModal3").find(".modal-content").css("width","650px");
        $("#exampleModal3").find(".modal-body").css("height","auto");
        $("#exampleModal3").css({"background":"rgba(51,32,0,.4)"});
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
                            var dataDel = [],dataTmp=[];
                            dataDel['log_remark'] = chkForm.log_remark;
                            dataDel['userToken'] = this.userData.userToken;
                            dataTmp.push(this.AppealReqData[this.delIndex]);
                            dataDel['data'] = dataTmp;
                            var data = $.extend({}, dataDel);
                            console.log(data)
                            this.http.post('/'+this.userData.appName+'ApiUD/API/APPEAL/fud0100/delAppealRequest', data).subscribe(
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
                                        this.loadData(this.result.n_type1)
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
    this.loadModalConfComponent = false;
  }
  reloadTab(){
    this.loadData(this.result.n_type1)
  }

  fkb0100Page(i:any){
    let winURL = window.location.href.split("/#/")[0]+"/#/";
    //var name = 'win_'+Math.ceil(Math.random()*1000);
    var name = 'fkb0100';
    //console.log(winURL+'ffn1600?run_id='+this.dataHead.run_id)fkb0100.php?run_id=150662&req_running=24381
    myExtObject.OpenWindowMaxName(winURL+'fkb0100?run_id='+this.dataHead.run_id+'&req_running='+this.AppealReqData[i].req_running,name);
  }

}
