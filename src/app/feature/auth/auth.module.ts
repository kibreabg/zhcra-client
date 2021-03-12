import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthGuard } from 'src/app/feature/auth/guard/auth.guard';
import { LoginService } from './services/login.service';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule, AuthRoutingModule, SharedModule
  ],
  providers: [LoginService, AuthGuard,
  ]
})
export class AuthModule { }
