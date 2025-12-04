import { Injectable, signal } from '@angular/core';
import { Usuario } from '../../types/schemas';

@Injectable({
  providedIn: 'root',
})
export class MainStore {
  public token = '';
  public user = signal<Usuario | undefined>(undefined);

  
}
