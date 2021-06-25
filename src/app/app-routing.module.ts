import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SettingsComponent } from './settings/settings.component';
import { UnreadArticlesComponent } from './unread-articles/unread-articles.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'unread'
      },
      {
        path: 'unread',
        component: UnreadArticlesComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
      {
        path: 'folder/:id',
        loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
      }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
    onSameUrlNavigation: 'reload',
    relativeLinkResolution: 'legacy'
})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
