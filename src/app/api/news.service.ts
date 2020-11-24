import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import * as sortBy from 'lodash.sortby';
import { Observable } from 'rxjs';
import { Article } from './article';
import { Router } from '@angular/router';


@Injectable({
    providedIn: 'root'
})
export class NewsService {
    baseUrl: string;
    authCredentials: string;
    username: string;
    password: string;

    constructor(
        private http: HttpClient,
        private router: Router,
    ) {
        this.loadCredentials();
    }


    initialSync() {

    }

    loadCredentials() {
        let auth:any = localStorage.getItem('nx-news-ion-auth');
        if (auth) {
            auth = JSON.parse(auth);
            this.baseUrl = auth.url;
            this.authCredentials = btoa(auth.username+':'+auth.password);
            this.username = auth.username;
            this.password = auth.password;
        } else {
            this.router.navigate(['/settings']);
        }
    }

    getHeaders(): HttpHeaders {
        return new HttpHeaders().set('Authorization', `Basic ${this.authCredentials}`);
    }

    getUnreadArticles():Observable<Article[]> {
        return this.http.get(`${this.baseUrl}items?type=3&getRead=false&batchSize=-1`, {
            headers: this.getHeaders()
        }).pipe(
            map((data:any) => {
                // TODO get sort setting from preferences
                data.items = sortBy(data.items, 'pubDate')
                return data.items;
            })
        );
    }

    markAsRead(itemId: number) {
        return this.http.put(`${this.baseUrl}items/${itemId}/read`, null, {
            headers: this.getHeaders()
        });
    }

    markAsUnread(itemId: number) {
        return this.http.put(`${this.baseUrl}items/${itemId}/unread`, null, {
            headers: this.getHeaders()
        });
    }

}
