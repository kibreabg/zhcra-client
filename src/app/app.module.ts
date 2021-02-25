import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { QuickAccessToolsComponent } from './quick-access-tools/quick-access-tools.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guard/auth.guard';
import { LoginService } from './services/login.service';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { ZhcraComponent } from './zhcra/zhcra.component';
import { GuidelinesComponent } from './guidelines/guidelines.component';
import { GuidelineTypeComponent } from './guideline-type/guideline-type.component';
import { MemoComponent } from './memo/memo.component';
import { PrescriptionToolComponent } from './prescription-tool/prescription-tool.component';
import { MaterialModule } from './material/material.module';
import { DataTableComponent } from './data-table/data-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { EventEmitterService } from './services/event-emitter.service';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    QuickAccessToolsComponent,
    LoginComponent,
    ZhcraComponent,
    GuidelinesComponent,
    GuidelineTypeComponent,
    MemoComponent,
    PrescriptionToolComponent,
    DataTableComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BsDatepickerModule.forRoot(),
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  providers: [LoginService, AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    EventEmitterService],
  bootstrap: [AppComponent]
})
export class AppModule { }
