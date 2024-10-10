import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/@shared/shared.module';
import { LoginRoutingModule } from '@app/login/login-routing.module';
import { LoginComponent } from '@app/login/login/login.component';
import { MainComponent } from '@app/login/main/main.component';
import { MenuCenterComponent } from './menu-center/menu-center.component';
import { ModalModule } from '@app/components/modal/modal.module'; // นำเข้า modal

@NgModule({
  declarations: [
    LoginComponent,
    MainComponent,
    MenuCenterComponent,

  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ModalModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class LoginModule { }