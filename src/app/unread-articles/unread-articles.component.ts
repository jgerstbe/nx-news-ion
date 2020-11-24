import { Component, OnInit } from '@angular/core';
import { NewsService } from '../api/news.service';
import { AlertController } from '@ionic/angular';
import { Article } from '../api/article';

@Component({
  selector: 'app-unread-articles',
  templateUrl: './unread-articles.component.html',
  styleUrls: ['./unread-articles.component.scss'],
})
export class UnreadArticlesComponent implements OnInit {
  articles: Article[] = [];

  constructor(
    private newsService: NewsService,
    public alertController: AlertController,
  ) { }

  ngOnInit() {
    this.loadUnread();
  }

  loadUnread() {
    this.newsService.getUnreadArticles().subscribe(
      data => this.articles = data,
      error => this.presentErrorAlert(error)
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

}
