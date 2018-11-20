import { BrowserModule } from '@angular/platform-browser';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
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
import { LoadingComponent } from "./components/base/loading.component";
import { InfoComponent } from "./components/base/info.component";
import { ResNavComponent } from "./components/res/res-nav.component";
import { LoginComponent } from "./components/user/login.component";
import { JumpingComponent } from "./components/base/jumping.component";
import { ProfileComponent } from "./components/user/profile.component";
import { ProfileBtnService } from "./services/profile-btn.service";
import { RedirectComponent } from "./components/base/redirect.component";
import { OauthComponent } from "./components/user/oauth.component";
import { RefreshComponent } from "./components/user/refresh.component";

export class MyHammerConfig extends HammerGestureConfig  {
  overrides = <any>{
    'swipe': {velocity: 0.4, threshold: 20} // override default settings
  };
}

@NgModule({
  declarations: [
    AppComponent,
    ResComponent,
    ResHomeComponent,
    ResNavComponent,
    ResOpComponent,
    LoadingComponent,
    JumpingComponent,
    InfoComponent,
    LoginComponent,
    ProfileComponent,
    RedirectComponent,
    OauthComponent,
    RefreshComponent,
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
    ProfileBtnService,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
