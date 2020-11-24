import { Component, OnInit } from '@angular/core';
import { NewsService } from '../api/news.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  url: string = '';
  username: string = '';
  password: string = '';

  constructor(
    private newsService: NewsService,
  ) {
    let auth:any = localStorage.getItem('nx-news-ion-auth');
    if (auth) {
      auth = JSON.parse(auth);
      this.url = auth.url;
      this.username = auth.username;
      this.password = auth.password;
    }
  }

  ngOnInit() {}

  saveCredentials(url: string, username: string, password: string) {
    if (!url.endsWith('index.php/apps/news/api/v1-2/')) {
      if (url.endsWith('/')) {
        url = url + 'index.php/apps/news/api/v1-2/';
      } else {
        url = url + '/index.php/apps/news/api/v1-2/';
      }
    }
    this.url = url;
    this.username = username;
    this.password = password;
    localStorage.setItem('nx-news-ion-auth', JSON.stringify({
      url: url,
      username: username,
      password: password,
    }));
    this.newsService.loadCredentials();
  }

}
