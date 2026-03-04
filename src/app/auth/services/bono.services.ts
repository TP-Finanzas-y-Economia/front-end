import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BonoRequestDTO } from '../models/bono-requestDTO';

// Definimos una interfaz interna para mapear el 'record' de Java
interface BonoResponse {
  montoBono: number;
}

@Injectable({
  providedIn: 'root'
})
export class BonoServices {

  private readonly API_URL = 'http://localhost:8080/api/bono';

  constructor(private http: HttpClient) { }

  calcularBBP(body: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/calcular-bbp`, body);
  }
}