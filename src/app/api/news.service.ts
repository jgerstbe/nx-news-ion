import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as sortBy from 'lodash.sortby';
import { Observable } from 'rxjs';
import { Item } from './item';
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

    getVersion() {
        return this.http.get(`${this.baseUrl}version`, {
            headers: this.getHeaders()
        });
    }

    getStatus() {
        return this.http.get(`${this.baseUrl}status`, {
            headers: this.getHeaders()
        });
    }

    // items - item.type (Feed: 0, Folder: 1, Starred: 2, All: 3)

    getUnreadItems():Observable<Item[]> {
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

    markItemAsRead(itemId: number) {
        return this.http.put(`${this.baseUrl}items/${itemId}/read`, null, {
            headers: this.getHeaders()
        });
    }

    markItemAsUnread(itemId: number) {
        return this.http.put(`${this.baseUrl}items/${itemId}/unread`, null, {
            headers: this.getHeaders()
        });
    }

    markItemsAsRead(itemIds: number[]) {
        return this.http.put(`${this.baseUrl}items/read/multiple`, {
            items: itemIds
        }, {
            headers: this.getHeaders()
        });
    }

    markItemsAsUnread(itemIds: number[]) {
        return this.http.put(`${this.baseUrl}items/unread/multiple`, {
            items: itemIds
        }, {
            headers: this.getHeaders()
        });
    }

    markItemAsStarred(feedId: number, guidHash: string) {
        return this.http.put(`${this.baseUrl}items/${feedId}/${guidHash}/star`, null, {
            headers: this.getHeaders()
        });
    }

    markItemAsUnstarred(feedId: number, guidHash: string) {
        return this.http.put(`${this.baseUrl}items/${feedId}/${guidHash}/unstar`, null, {
            headers: this.getHeaders()
        });
    }

    markItemsAsStarred(items: [{feedId: number, guidHash: string}]) {
        return this.http.put(`${this.baseUrl}items/star/multiple`, {
            items: items
        }, {
            headers: this.getHeaders()
        });
    }

    markItemsAsUnstarred(items: [{feedId: number, guidHash: string}]) {
        return this.http.put(`${this.baseUrl}items/unstar/multiple`, {
            items: items
        }, {
            headers: this.getHeaders()
        });
    }

    markAllItemsAsRead(newestItemId: number) {
        return this.http.put(`${this.baseUrl}items/read`, {
            newestItemId: newestItemId
        }, {
            headers: this.getHeaders()
        });

    }

    getUpdatedItems(lastModified: number, type: number = 3) {
        return this.http.get(`${this.baseUrl}items/updated?lastModified=${lastModified}&type=${type}`,{
            headers: this.getHeaders()
        });
    }

    // folders
    getFolders() {
        return this.http.get(`${this.baseUrl}folders`,{
            headers: this.getHeaders()
        });
    }

    createFolder(name: string) {
        return this.http.post(`${this.baseUrl}folders`, {
            name: name
        }, {
            headers: this.getHeaders()
        });
    }

    deleteFolder(id: number) {
        return this.http.delete(`${this.baseUrl}folders/${id}`,{
            headers: this.getHeaders()
        });
    }

    renameFolder(id: number, name:string) {
        return this.http.put(`${this.baseUrl}folders/${id}`, {
            name: name
        }, {
            headers: this.getHeaders()
        });
    }

    markFolderAsRead(folderId: number, newesItemId: number) {
        // mark all items read lower than equal that id
        // this is mean to prevent marking items as read which the client/user does not yet know of
        return this.http.put(`${this.baseUrl}folders/${folderId}/read`, {
            newestItemId: newesItemId
        }, {
            headers: this.getHeaders()
        });
    }

    // feeds
    getFeeds() {
        return this.http.get(`${this.baseUrl}feeds`,{
            headers: this.getHeaders()
        });
    }

    createFeed(url: string, folderId: number = null) {
        return this.http.post(`${this.baseUrl}feeds`, {
            url: url,
            folderId: folderId
        }, {
            headers: this.getHeaders()
        });
    }

    deleteFeed(id: number) {
        return this.http.delete(`${this.baseUrl}feed/${id}`,{
            headers: this.getHeaders()
        });
    }

    moveFeedToFolder(feedId: number, folderId: number = null) {
        return this.http.put(`${this.baseUrl}feeds/${feedId}/move`, {
            folderId: folderId
        }, {
            headers: this.getHeaders()
        });
    }

    renameFeed(feedId: number, name: string) {
        return this.http.put(`${this.baseUrl}feeds/${feedId}`, {
            name: name
        }, {
            headers: this.getHeaders()
        });
    }
    
    markFeedAsRead(feedId: number, newesItemId: number) {
        // mark all items read lower than equal that id
        // this is mean to prevent marking items as read which the client/user does not yet know of
        return this.http.put(`${this.baseUrl}feeds/${feedId}/read`, {
            newestItemId: newesItemId
        }, {
            headers: this.getHeaders()
        });
    }

}
