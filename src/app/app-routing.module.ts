import { NgModule} from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ResComponent } from "./components/res/res.component";
import { ResHomeComponent } from "./components/res/res-home.component";
import { OauthComponent } from "./components/user/oauth.component";
import { RefreshComponent } from "./components/user/refresh.component";
import { HomeComponent } from "./components/base/home.component";

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'user/refresh', component: RefreshComponent},
  { path: 'res', component: ResHomeComponent},
  { path: 'res/next/:next', component: ResHomeComponent},
  { path: 'res/:res_str_id', component: ResComponent},
  { path: 'res/:res_str_id/:tab', component: ResComponent},
  { path: 'oauth/qtb/callback', component: OauthComponent},
  { path: '**', component: HomeComponent},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
