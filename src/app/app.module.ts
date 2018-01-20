import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from "ngx-markdown";

import { AppComponent } from './app.component';

import { AppRoutingModule } from "./app-routing.module";

import { DiskService } from "./disk.service";
import { HttpClientModule} from "@angular/common/http";
import {UserService} from "./services/user.service";
import {BaseService} from "./services/base.service";
import {ClockService} from "./services/clock.service";
import {ResourceService} from "./services/resource.service";
import {ResComponent} from "./components/res/res.component";
import {ResHomeComponent} from "./components/res/res-home.component";

@NgModule({
  declarations: [
    AppComponent,
    ResComponent,
    ResHomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MarkdownModule.forRoot(),
  ],
  providers: [
    DiskService,
    UserService,
    BaseService,
    ClockService,
    ResourceService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
