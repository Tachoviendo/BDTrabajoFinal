import { HttpClient } from '@angular/common/http';
import { inject, Injectable, input } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Pozo } from '../types/schemas';
import { AuthService } from './auth-service/auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PozosListService {
  public baseURL(id_usuario: number): string {
    return environment.apiURL + `usuarios/${id_usuario}/pozos`;
  }
  public httpClient = inject(HttpClient);
  private auth = inject(AuthService);

  private getUserIdOrThrow(): number {
    const id = this.auth.userId();
    if (!id) {
      throw new Error('No se encontró id_usuario autenticado');
    }
    return id;
  }

  public async getListaPozos(): Promise<Pozo[]> {
    const id_usuario = this.getUserIdOrThrow();

    return await firstValueFrom(this.httpClient.get<Pozo[]>(this.baseURL(id_usuario)));
  }
  public async deletePozo(id_pozo: number): Promise<void> {
    const id_usuario = this.getUserIdOrThrow();

    await firstValueFrom(this.httpClient.delete(`${this.baseURL(id_usuario)}/${id_pozo}`));
  }
}
