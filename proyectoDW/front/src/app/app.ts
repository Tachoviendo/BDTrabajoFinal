import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {
  IonApp,
  IonRouterLink,
  IonRouterOutlet,
  IonToolbar,
  IonTitle,
  IonHeader,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonMenu,
  IonBackButton,
  IonList,
  IonItem,
  IonMenuToggle,
  IonLabel,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { MainStore } from './shared/services/mainstore-service/main.store';
import { WebsocketService } from './shared/services/websocket.service';
@Component({
  selector: 'app-root',
  imports: [
    IonRouterOutlet,
    IonContent,
    IonApp,
    IonTitle,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonMenu,
    IonList,
    IonMenuToggle,
    IonItem,
    RouterLink,
    IonButton,
    IonLabel,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('front');
  public mainStore = inject(MainStore)
  public webSocketService = inject(WebsocketService)

  public wsConnection = effect(() => {
    if (this.mainStore.user()) {
      this.webSocketService.connect(this.mainStore.user()!.id_usuario);
    }
  });

    


  
  
}
