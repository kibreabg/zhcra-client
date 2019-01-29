import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { QuickAccessToolsComponent } from './quick-access-tools/quick-access-tools.component';
import { MedicineInformationComponent } from './medicine-information/medicine-information.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guard/auth.guard';
import { LoginService } from './services/login.service';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { ZhcraComponent } from './zhcra/zhcra.component';
import { GuidelinesComponent } from './guidelines/guidelines.component';
import { GuidelineTypeComponent } from './guideline-type/guideline-type.component';
import { MemoComponent } from './memo/memo.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    QuickAccessToolsComponent,
    MedicineInformationComponent,
    LoginComponent,
    ZhcraComponent,
    GuidelinesComponent,
    GuidelineTypeComponent,
    MemoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BsDatepickerModule.forRoot(),
  ],
  providers: [LoginService, AuthGuard,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
