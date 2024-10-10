import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
//import { AuthGuardService } from '@app/auth-guard.service';
import { LoginComponent } from '@app/login/login/login.component';
import { MainComponent } from '@app/login/main/main.component';
import { MenuCenterComponent } from '@app/login/menu-center/menu-center.component';

const routes: Routes = [
  Shell.childRoutes([ 
    { path: 'menu_center/:dep_code', component: MenuCenterComponent },
  ]),
  { path: 'login', component: LoginComponent },
  { path: 'main', component: MainComponent },
  
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
