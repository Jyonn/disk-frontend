import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { AppRoutingModule } from "./app-routing.module";

import { DiskService } from "./disk.service";
import { HttpClientModule} from "@angular/common/http";
import {UserService} from "./services/user.service";
import {BaseService} from "./services/base.service";
import {ClockService} from "./services/clock.service";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    DiskService,
    UserService,
    BaseService,
    ClockService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
