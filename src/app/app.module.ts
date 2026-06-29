import { BrowserModule } from '@angular/platform-browser';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from './app.component';

import { AppRoutingModule } from "./app-routing.module";
import { ResComponent } from "./components/res/res.component";
import { ResHomeComponent } from "./components/res/res-home.component";
import { ResOpComponent } from "./components/res/res-op.component";

import { UserService } from "./services/user.service";
import { BaseService } from "./services/base.service";
import { ClockService } from "./services/clock.service";
import { ResourceService } from "./services/resource.service";
import { FootBtnService } from "./services/foot-btn.service";
import { LoadingComponent } from "./components/base/loading.component";
import { InfoComponent } from "./components/base/info.component";
import { ResNavComponent } from "./components/res/res-nav.component";
import { JumpingComponent } from "./components/base/jumping.component";
import { OauthComponent } from "./components/user/oauth.component";
import { RefreshComponent } from "./components/user/refresh.component";
import { TipsService } from "./services/tips.service";
import { UpdateService } from "./services/update.service";
import { ResTreeComponent } from "./components/res/res-tree.component";
import { ResourceTreeService } from "./services/resource-tree.service";
import { HomeComponent } from "./components/base/home.component";
import { WechatShareService } from "./services/wechat-share.service";
import {VideoService} from "./services/video.service";
import { ClipboardCopyDirective } from "./components/shared/clipboard-copy.directive";
import { MarkdownComponent } from "./components/shared/markdown.component";

// export class MyHammerConfig extends HammerGestureConfig  {
//   overrides = <any>{
//     'swipe': {velocity: 0.4, threshold: 20} // override default settings
//   };
// }

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ResComponent,
    ResHomeComponent,
    ResNavComponent,
    ResOpComponent,
    LoadingComponent,
    JumpingComponent,
    InfoComponent,
    OauthComponent,
    RefreshComponent,
    ResTreeComponent,
    ClipboardCopyDirective,
    MarkdownComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    UserService,
    BaseService,
    ClockService,
    ResourceService,
    FootBtnService,
    TipsService,
    UpdateService,
    ResourceTreeService,
    WechatShareService,
    VideoService,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerGestureConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
