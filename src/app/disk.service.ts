import { Injectable } from "@angular/core";

import 'rxjs/add/operator/toPromise';

import { User } from "./models/user";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class DiskService {
  private user: User;

  constructor(private http: HttpClient) {}

  getUserInfo(): void {
    // let token = window.localStorage.getItem('token');
    // if (token)
    this.http.get('http://localhost:8000/api/user').subscribe(function (response) {
      console.log(response);
    });
    // return this.http.get('localhost:8000/api/user/')
    //   .toPromise()
    //   .then(function (response) {
    //     console.log(response);
    //     return response;
    //   })
    //   .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }
}
