import { inject, OnInit, signal } from '@angular/core';
import { Component } from '@angular/core';
import { IonButton, IonCol, IonRow, IonGrid, ViewWillEnter, IonCard, IonCardHeader, IonCardTitle, IonContent, IonCardSubtitle, IonCardContent, IonList, IonItem, IonLabel, IonNote, IonPopover, IonToolbar, IonButtons } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Pozo } from '../../../../shared/types/schemas';
import { PozosListService } from '../../../../shared/services/pozos-list.service';
import { DatePipe } from '@angular/common';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-pozos-list',
  imports: [
    DatePipe,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonCardSubtitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonPopover,
    IonToolbar,
    IonButtons
],
  templateUrl: './pozos-list.page.html',
  styleUrl: './pozos-list.page.css',
})
export class PozosListPage implements OnInit, ViewWillEnter {
  public pozosListService = inject(PozosListService);
  public toastController = inject(ToastController)
  private router = inject(Router);
  public pozos = signal<Pozo[]>([]);

  async ngOnInit(): Promise<void> {
    await this.cargarPozos();
  }

  async ionViewWillEnter() {
    await this.cargarPozos();
  }

  private async cargarPozos() {
    const pozos = await this.pozosListService.getListaPozos();
    this.pozos.set(pozos);
  }

  irAEditar(pozo: Pozo) {
    this.router.navigate(['/pozo-edit', pozo.id_pozo]);
  }

  irAIntervaloLit(pozo: Pozo) {
    this.router.navigate([`/pozos/${pozo.id_pozo}/intervalos-litologicos-list`]);
  }

  irAIntervaloPer(pozo: Pozo) {
    this.router.navigate([`/pozos/${pozo.id_pozo}/intervalos-diametros-list`]);
  }

  irANivelesA(pozo: Pozo) {
    this.router.navigate([`/pozos/${pozo.id_pozo}/aportes-list`]);
  }

  irADetalle(pozo:Pozo){
    this.router.navigate([`pozos-detail/${pozo.id_pozo}`])
  }

  public async borrarPozo(pozo: Pozo) {
    try{
      await this.pozosListService.deletePozo(pozo.id_pozo);
    await this.ionViewWillEnter();

    }catch (err: any) {
      const toast = await this.toastController.create({
        message: err.error.message,
        duration: 1000,
        position: 'bottom',
        color: 'danger',
        animated: true,

      });
      
      await toast.present();
    }

  }
}
