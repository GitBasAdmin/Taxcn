import { Component, OnInit , ViewChild , ElementRef,AfterViewInit,OnDestroy,Injectable,Input   } from '@angular/core';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner"; 
import { NgSelectComponent } from '@ng-select/ng-select';
import { AuthService } from 'src/app/auth.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-fst1400-tab4',
  templateUrl: './fst1400-tab4.component.html',
  styleUrls: ['./fst1400-tab4.component.css']
})
export class Fst1400Tab4Component implements OnInit {
  sessData:any;
  userData:any;
  getAllegation:any;

  dtOptions2: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective; dtInstance:DataTables.Api; 

  constructor(
    private authService: AuthService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.dtOptions2 = {
      columnDefs: [{"targets": 'no-sort',"orderable": false}],
      order:[],
      lengthChange : false,
      info : false,
      paging : false,
      searching : false
    };

    this.sessData=localStorage.getItem(this.authService.sessJson);
    this.userData = JSON.parse(this.sessData);
    this.Allegation();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    // Destroy the table first
    dtInstance.destroy();
    // Call the dtTrigger to rerender again
    this.dtTrigger.next(null);
      });
  }

  ngAfterViewInit(): void {
    //this.dtTrigger.next(null);
    }
    
  ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

    Allegation(){
    //======================== pcase_type_stat ======================================
    var student = JSON.stringify({
      "table_name" : "pallegation",
      "field_id" : "alle_id",
      "field_name" : "alle_name",
      "condition" : " AND alle_id >='80.00' AND alle_id <='88.00' AND case_type=1 AND case_cate_group=1 AND user_select IS NULL",
      "userToken" : this.userData.userToken
    });
    console.log(student)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');
    let promise = new Promise((resolve, reject) => {
      this.http.post('/'+this.userData.appName+'ApiUTIL/API/getData', student , {headers:headers}).subscribe(
        (response) =>{
          let getDataOptions : any = JSON.parse(JSON.stringify(response));
          console.log(getDataOptions)
          this.getAllegation = getDataOptions;
          this.dtTrigger.next(null);
        },
        (error) => {}
      )
    });
    return promise;
  }

  

}
