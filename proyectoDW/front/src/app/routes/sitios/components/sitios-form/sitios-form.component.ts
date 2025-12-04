import { Component, input, OnInit, output } from '@angular/core';
import { SitioBody } from '../../../../shared/types/schemas';
import { IonList, IonItem, IonLabel, IonInput, IonButton } from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sitios-form',
  templateUrl: './sitios-form.component.html',
  styleUrls: ['./sitios-form.component.scss'],
  imports: [FormsModule, IonList, IonItem, IonLabel, IonInput, IonButton],
})
export class SitiosFormComponent {

  public sitio = input.required<SitioBody>();
  public saved = output<SitioBody>();

  handleSitio() {
    this.saved.emit(this.sitio());
  }

}
