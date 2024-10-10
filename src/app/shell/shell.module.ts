import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShellComponent } from './shell.component';
import { SharedModule } from '@app/@shared/shared.module';
import { MenuComponent } from '@app/shell/menu/menu.component';


@NgModule({
  declarations: [
    ShellComponent,
    MenuComponent,

  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ShellModule { }
