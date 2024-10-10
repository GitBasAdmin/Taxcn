import { Inject,Injectable } from '@angular/core';
 
// import ในส่วนที่จะใช้งานกับ Observable
import {Observable,of, Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { tap, map } from 'rxjs/operators';

@Injectable()
export class AuthService {
  destroy$ = new Subject();
  
  public isLoggedIn:boolean = false; // กำหนดสถานะล็อกอินเริ่มต้นเป็น false
  public redirectUrl: string; // กำหนดตัวแปรสำหรับเก็บ url ที่จะลิ้งค์ไป

  public sessJson: string ="sessData"; 
  public sessionStor: string ="sessionStor";
  public menuJson: any = "jsonData"; 
  public _baseUrl:any;
  constructor(
    @Inject(Window) private _window: Window
  ) { 
    this._baseUrl = `${this._window.location.href}`;
    //console.log(this._baseUrl)
  }

  // ฟังก์ชั่นจำลองการล็อกอิน คืนค่าเป็น Observable
  login(): Observable<boolean> {
    // เมื่อล็อกอิน
    //return of(true) // ให้คืนค่า true
    //.delay(3000) // หลังจาก delay 3 วินาที
    //.do(val => this.isLoggedIn = true);  // เมื่อถึงเวลาให้กำหนดค่าสถานะเป็น true
    /*
  const destroy$ = new Subject();
    return of(true).pipe(
      delay(3000),
      tap(val => this.isLoggedIn = true),
      takeUntil(this.destroy$)
    )
    */
    this.isLoggedIn = true;
    const destroy$ = new Subject();
    return of(true)
    .pipe(
      tap(val => this.isLoggedIn = true),
      delay(3000),
      takeUntil(this.destroy$)
    )
  }
  // ฟังก์ชั่นจำลองการล็อกเอาท์
  logout(): void {
    // ให้ค่าสถานะล็อกอินเป็น false
    this.isLoggedIn = false;
  }  

  testAlert(){
    alert(9999)
  }

  
 
}