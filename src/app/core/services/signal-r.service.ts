import { Injectable } from '@angular/core';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';
import * as signalR from '@aspnet/signalr';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';


const url = environment.baseUrl;


@Injectable({
  providedIn: 'root'
})
export class  SignalRService {
  private connection!: signalR.HubConnection;
  connectionEstablished$ = new Subject<Boolean>();
  connectionEstablished = this.connectionEstablished$.asObservable(); 
  public loginToken: any
  constructor(private http: HttpClient) {
    this.loginToken = localStorage.getItem('access_token');

  }
  connect() {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(url, { accessTokenFactory: () => this.loginToken })
        .configureLogging(signalR.LogLevel.Information)
        .build();
      this.connection.start().then(() => {
        console.log('Hub connection started');
        this.connection.on("ReceiveMessage", (user, message) => {
            if(user||message){
              console.log(user)
              console.log(message)
              this.connectionEstablished$.next(user);
          }
          });
      }).catch(err => console.log(err));
  }

  disconnect() {
    if (this.connection) {
      this.connection.stop();
      console.log('Hub connection stop');
    }
  }

}
