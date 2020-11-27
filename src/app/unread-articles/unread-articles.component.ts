import { Component, OnInit, ViewChild } from '@angular/core';
import { NewsService } from '../api/news.service';
import { AlertController } from '@ionic/angular';
import { Article } from '../api/article';
import { ArticleListComponent } from '../article-list/article-list.component';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-unread-articles',
  templateUrl: './unread-articles.component.html',
  styleUrls: ['./unread-articles.component.scss'],
})
export class UnreadArticlesComponent implements OnInit {
  articles: Article[] = [];
  @ViewChild('articleList', { static: false}) articleList: ArticleListComponent;
  loadingSpinner: HTMLIonLoadingElement;

  constructor(
    private newsService: NewsService,
    public alertController: AlertController,
    public loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.loadUnread();
  }

  loadUnread() {
    this.presentLoading();
    this.newsService.getUnreadArticles().subscribe(
      data => {
        this.loadingSpinner.dismiss();
        this.articles = data;
      },
      error => {
        this.loadingSpinner.dismiss();
        this.presentErrorAlert(error);
      },
    )
  }

  async presentErrorAlert(error:any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Error',
      // subHeader: 'Subtitle',
      message: error.status+': '+error.message,
      buttons: ['OK']
    });

    await alert.present();
  }

  markAllAsRead() {
    this.articleList.markAllAsRead().subscribe(
      success => { this.loadUnread() },
      error => console.error('Could not mark multiple items as read.')
    );
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Getting unread articles...',
    });
    await loading.present();
    this.loadingSpinner = loading;
  }

}
