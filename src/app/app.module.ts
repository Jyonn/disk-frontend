import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";

import { MarkdownModule } from "ngx-markdown";
import { ClipboardModule } from 'ngx-clipboard';

import { AppComponent } from './app.component';

import { AppRoutingModule } from "./app-routing.module";
import { ResComponent } from "./components/res/res.component";
import { ResHomeComponent } from "./components/res/res-home.component";
import { ResOpComponent } from "./components/res/res-op.component";

import { DiskService } from "./disk.service";
import { UserService } from "./services/user.service";
import { BaseService } from "./services/base.service";
import { ClockService } from "./services/clock.service";
import { ResourceService } from "./services/resource.service";
import { FootBtnService } from "./services/foot-btn.service";
import { ResLoadingComponent } from "./components/res/res-loading.component";

@NgModule({
  declarations: [
    AppComponent,
    ResComponent,
    ResHomeComponent,
    ResOpComponent,
    ResLoadingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MarkdownModule.forRoot(),
    ClipboardModule,
  ],
  providers: [
    DiskService,
    UserService,
    BaseService,
    ClockService,
    ResourceService,
    FootBtnService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
