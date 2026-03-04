import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntidadFinanciera } from '../models/entidadFinanciera.model';
import { Simulacion } from '../models/simulacion-model';
import { CronogramaPagos } from '../models/cronograma.model';
import { Observable } from 'rxjs';
import { SimulacionRequestDTO } from '../models/simulacion-requestDTO';

@Injectable({
  providedIn: 'root',
})
export class CronogramaServices {
  private readonly API_URL = 'http://localhost:3000/api/cronograma';

  constructor(private http: HttpClient) { }

  // Filtra los bancos según los datos ingresados
  getBancosAptos(sueldo: number, precio: number, inicial: number): Observable<EntidadFinanciera[]> {
    return this.http.get<EntidadFinanciera[]>(
      `${this.API_URL}/bancos-disponibles?sueldo=${sueldo}&precio=${precio}&cuotaInicial=${inicial}`
    );
  }

  // Envía la simulación para calcular el cronograma completo (con VAN, TIR y Cuotas)
  generarCronograma(simDTO: SimulacionRequestDTO): Observable<CronogramaPagos> {
    return this.http.post<CronogramaPagos>(`${this.API_URL}/generar-cronograma`, simDTO);
  }
}
