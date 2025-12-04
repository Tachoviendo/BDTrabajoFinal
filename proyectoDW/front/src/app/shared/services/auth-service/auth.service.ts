import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MainStore } from '../mainstore-service/main.store';
import { firstValueFrom } from 'rxjs';
import { Usuario } from '../../types/schemas';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private mainStore = inject(MainStore);
  public baseURL = environment.apiURL + 'login';

  public async logged(email: string, password: string) {
    try {
      console.log(this.baseURL)
      const { token } = await firstValueFrom(
        this.httpClient.post<{ token: string }>(this.baseURL, { email, password })
      );
      environment;
      console.log(token);
      this.mainStore.token = token;
      localStorage.setItem('token', token);

      const user = await firstValueFrom(this.httpClient.get<Usuario>(this.baseURL));
      this.mainStore.user.set(user);
    } catch (err:any) {
      console.log('Mensaje de error', err.error.message);
      if (err.status === 0) throw new Error(err.message);
      throw err;
    }
  }

  public async getUser(){
    try{
      
    const user = await firstValueFrom(this.httpClient.get<Usuario>(this.baseURL));
    this.mainStore.user.set(user);
    }catch(err:any){
       console.log('Mensaje de error', err.error.message);
      if (err.status === 0) throw new Error(err.message);
      throw err;

    }


  }

  public token(): string | null {
    if (this.mainStore.token) return this.mainStore.token;
    return localStorage.getItem('token');
  }

  public userId(): number | null {
    const user = this.mainStore.user();
    return user?.id_usuario ?? null;
  }
}
