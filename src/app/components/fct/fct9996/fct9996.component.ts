import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,ViewChildren, QueryList,Output,EventEmitter   } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray , NgForm } from "@angular/forms";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogLayoutDisplay,ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';

// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map ,catchError } from 'rxjs/operators';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/auth.service';
import * as $ from 'jquery';
import { PrintReportService } from 'src/app/services/print-report.service';

//import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
declare var myExtObject: any;

@Component({
  selector: 'app-fct9996,ngbd-popover-basic,ngbd-popover-tplcontent',
  templateUrl: './fct9996.component.html',
  styleUrls: ['./fct9996.component.css']
})

export class Fct9996Component implements AfterViewInit, OnInit, OnDestroy {
  myExtObject :any;
  sessData:any;
  userData:any;
  programName:any;
  csvData:any = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public loadComponent: boolean = false;

  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api;
  @ViewChildren('attachFile') attachFile: QueryList<ElementRef>;
  constructor(
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private SpinnerService: NgxSpinnerService,
    private printReportService: PrintReportService,
    private authService: AuthService
  ){  }

  ngOnInit(): void {
    this.dtOptions = {
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false,
      destroy : true,
      retrieve: true,
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.successHttp();
  }

  successHttp() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    var authen = JSON.stringify({
      "userToken" : this.userData.userToken,
      "url_name" : "fct9996"
    });
    let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'Api/API/authen', authen , {headers:headers})
        .toPromise()
        .then(
          res => { // Success
          let getDataAuthen : any = JSON.parse(JSON.stringify(res));
          console.log(getDataAuthen)
          this.programName = getDataAuthen.programName;
            resolve(res);
          },
          msg => { // Error
            reject(msg);
          }
        );
    });
    return promise;
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    dtInstance.destroy();
    this.dtTrigger.next(null);
      });}

 ngAfterViewInit(): void {
    myExtObject.callCalendar();
    this.dtTrigger.next(null);
     }

  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

    ClearAll(){
      window.location.reload();
    }


    

    onFileChange(e:any) {
      console.log(e)
      var lastName = '';var fileName = '';
      var bar2 = new Promise((resolve, reject) => {
        this.attachFile.forEach((r,index,array)  =>  {
          console.log(r)
          if(r){
            fileName = r.nativeElement.files[0].name;
            lastName = r.nativeElement.files[0].name.split('.').pop().toLowerCase();
          }
        })
      });

      if(bar2){
        if(e.target.files.length){
          //var fileName = e.target.files[0].name;
          //var lastName = fileName.split('.')[1].toLowerCase();
          if(lastName!='csv'){
            const confirmBox = new ConfirmBoxInitializer();
            confirmBox.setTitle('ข้อความแจ้งเตือน');
            confirmBox.setMessage('ไฟล์อัพโหลดต้องเป็นไฟล์ .csv เท่านั้น');
            confirmBox.setButtonLabels('ตกลง');
            confirmBox.setConfig({
                layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
            });
            const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
              if (resp.success==true){
                $(e.target).parent('div').find('label').html('');
                $(e.target).val('');
              }
              subscription.unsubscribe();
            });
          }else{
            $(e.target).parent('div').find('label').html(fileName);
            var formData = new FormData();
            this.attachFile.forEach((r,index,array)  =>  {
              if(r.nativeElement.files.length){
                formData.append('attach_file', r.nativeElement.files[0]);
              }else{
                formData.append('attach_file', null);
              }
            })
            for (var pair of formData.entries()) {
              console.log(pair[0]+ ', ' + pair[1]); 
            }
            formData.append('userToken', this.userData.userToken);
            this.SpinnerService.show();
            this.http.disableHeader().post('/'+this.userData.appName+'ApiCT/API/fct9996/searchData', formData ).subscribe(
              (response) =>{
                let productsJson : any = JSON.parse(JSON.stringify(response));
                console.log(productsJson)
                if(productsJson.result==1){
                  if(productsJson.data.length){
                    this.csvData = productsJson.data;
                    var bar = new Promise((resolve, reject) => {
                      this.csvData.forEach((r:any,index:any,array:any)  => {
                        if(r.litigant_desc){
                          r.lit_desc = [];
                          var subLit = r.litigant_desc.split(',');
                          for(var x=0;x<subLit.length;x++){
                            var s = subLit[x].split("#");
                            r.lit_desc.push({'lit_desc':s[0],'lit_case':s[1],'lit_run_id':s[2]});
                          }
                        }else{
                          r.lit_desc = [];
                        }
                      });
  
                    });
                    if(bar){
                      console.log(this.csvData);
                      this.dtTrigger.next(null);
                    }
                  }else{
                    this.csvData = [];
                    this.dtTrigger.next(null);
                  }
                  const confirmBox = new ConfirmBoxInitializer();
                    confirmBox.setTitle('ข้อความแจ้งเตือน');
                    confirmBox.setMessage(productsJson.error);
                    confirmBox.setButtonLabels('ตกลง');
                    confirmBox.setConfig({
                        layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                    });
                    const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                      if (resp.success==true){
                        this.SpinnerService.hide();}
                      subscription.unsubscribe();
                    });
  
                }else{
                  const confirmBox = new ConfirmBoxInitializer();
                  confirmBox.setTitle('ข้อความแจ้งเตือน');
                  confirmBox.setMessage(productsJson.error);
                  confirmBox.setButtonLabels('ตกลง');
                  confirmBox.setConfig({
                      layoutType: DialogLayoutDisplay.WARNING // SUCCESS | INFO | NONE | DANGER | WARNING
                  });
                  const subscription = confirmBox.openConfirmBox$().subscribe(resp => {
                    if (resp.success==true){
                      this.SpinnerService.hide();}
                    subscription.unsubscribe();
                  });
                }
              },
              (error) => {this.SpinnerService.hide();}
            )
            
          }
            
        }else{
          $(e.target).parent('div').find('label').html('');
          $(e.target).val('');
        }
      }
      
    }

    openPdfFile(){
      myExtObject.OpenWindowMax('/'+this.userData.appName+'ApiCT/API/fct9996/openPdf');
    }
    openLink(run_id:any){
      let winURL = window.location.href.split("/#/")[0]+"/#/";
      var name = 'fmg0200';
      //console.log(winURL+'fmg0200?run_id='+run_id)
      myExtObject.OpenWindowMaxName(winURL+'fmg0200?run_id='+run_id,name);
    }
    printReport(){
      var rptName = 'rct9996';
      var paramData ='{}';
       var paramData = JSON.stringify({
         "pprint_by" : '2'
       });
      this.printReportService.printReport(rptName,paramData);
    }
}






