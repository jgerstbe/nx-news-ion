import { Component, Input, SimpleChanges } from '@angular/core';
import { Item } from '../api/item';
import { NewsService } from '../api/news.service';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
})
export class ArticleListComponent {
  @Input('items') items: Item[] = [];
  hasItems: boolean = false;

  constructor(
    private newsService: NewsService,
  ) { }

  ngOnChanges(changes:SimpleChanges) {
    if (changes.items && changes.items.currentValue && changes.items.currentValue.length > 0) {
      this.hasItems = true;
    } else {
      this.hasItems = false;
    }
  }

  openInNewTab(url:string, itemId: number) {
    var win = window.open(url, '_blank');
    setTimeout(() => {
      this.marAsRead(itemId);
    }, 500);
    win.focus();
  }

  marAsRead(itemId: number) {
    this.newsService.markItemAsRead(itemId).subscribe(
      success => { },
      error => console.error('Could not read item', itemId)
    );
  }

  markAllAsRead() {
    return this.newsService.markItemsAsRead(this.items.map(e => e.id));
  }

  toggleRead(item: Item) {
    // assuming the api call will succeed
    item.unread = !item.unread;
    if (item.unread) {
      this.newsService.markItemAsUnread(item.id).subscribe(
        success => {},
        error => item.unread = !item.unread
      );
    } else {
      this.newsService.markItemAsRead(item.id).subscribe(
        success => {},
        error => item.unread = !item.unread
      );
    }
  }

  toggleFAvourite(item: Item) {
    // assuming the api call will succeed
    item.starred = !item.starred;
    if (item.starred) {
      this.newsService.markItemAsStarred(item.feedId, item.guidHash).subscribe(
        success => {},
        error => item.starred = !item.starred
      );
    } else {
      this.newsService.markItemAsUnstarred(item.feedId, item.guidHash).subscribe(
        success => {},
        error => item.unread = !item.unread
      );
    }
  }

}
