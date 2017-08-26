import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map'


@Injectable()
export class UserService {
  constructor(private httpClient: HttpClient) {}

  private base_url = 'http://localhost:4042/api/v1';
  private CLIENT_ID = 'a823jkas87y3kjakjhsd';
  private CLIENT_SECRET = 'dksu287aokjfaouiusdia7127a5skd';

  private user: Object;

  getToken(email, pass) {
    const headers = new HttpHeaders();
    const params = new HttpParams()
      .append('client_id', this.CLIENT_ID)
      .append('client_secret', this.CLIENT_SECRET)
      .append('username', email)
      .append('password', pass);

    return this.httpClient.post(`${this.base_url}/auth/token?grant_type=password`, null, { headers, params })
  }

  getUser(email = 'email@example.com', pass = 'password') {
    this.getToken(email, pass).subscribe( token => {

      const headers = new HttpHeaders({'Authorization': `Bearer ${token['access_token']}`});

      return this.httpClient.get(`${this.base_url}/profile`, { headers })
        .subscribe(user => this.user = user);
    });
  }

}
