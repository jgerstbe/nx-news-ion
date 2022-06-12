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
      setTimeout(() => this.addItemScrollObserver(), 1000);
    } else {
      this.hasItems = false;
    }
  }

  openInNewTab(url:string, itemId: number) {
    var win = window.open(url, '_blank');
    setTimeout(() => {
      this.markAsRead(itemId);
    }, 500);
    win.focus();
  }

  addItemScrollObserver() {
    const ComponentInstance = this;
    const observer = new MutationObserver(function(mutations: MutationRecord[]) {
      mutations.forEach(function(mutationRecord: MutationRecord) {
        // TODO if the sorting of items can be changed (old -> new / new -> old) this has to be evaluated accordingly
        if (mutationRecord.oldValue < (mutationRecord.target as HTMLElement).id) ComponentInstance.markAsReadByScrolling(Number(mutationRecord.oldValue));
      });    
    });
    
    [...(document as any).querySelectorAll('ion-item-sliding span.itemScrollSpy')].forEach(item => {
      observer.observe(item, { 
        attributes: true, 
        attributeFilter: ['id'], 
        attributeOldValue: true,
      });
    })
  }

  markAsReadByScrolling(itemId: number) {
    const item: Item = this.items.find(e => e.id === itemId);
    if (item.unread) {
      item.unread = false;
      this.markAsRead(itemId);
    }
  }

  markAsRead(itemId: number) {
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

  toggleFavorite(item: Item) {
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
