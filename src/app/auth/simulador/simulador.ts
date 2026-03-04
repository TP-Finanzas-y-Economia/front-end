import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { BonoServices } from '../services/bono.services';
import { SimulacionRequestDTO } from '../models/simulacion-requestDTO';

@Component({
  selector: 'app-simulador',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatInputModule,
    MatButtonModule, MatSelectModule, MatCheckboxModule,
    MatFormFieldModule, MatIconModule, MatDividerModule, MatProgressBarModule
  ],
  templateUrl: './simulador.html',
  styleUrl: './simulador.css',
})
export class SimuladorComponent {
  pasoActual: number = 1;
  loading: boolean = false;
  errorMsg: string = '';

  // Paso 1
  valorVivienda: number = 0;
  sueldoIngresado: number = 0;
  esSostenible: boolean = false;
  esIntegrador: boolean = false;
  montoBonoAplicado: number = 0;

  // Paso 2
  cuotaInicialMonto: number = 0;
  porcentajeCalculado: number = 0;
  plazoMeses: number = 0;
  mesesGracia: number = 0;
  tipoGracia: string = 'SIN_GRACIA';
  tipoCambio: number = 3.75;

  // Bancos
  bancosFiltrados: any[] = [];
  entidadIdSeleccionada: number | null = null;

  // Resultado
  cronograma: any = null;
  listaDeCuotas: any[] = []; // IMPORTANTE: Se llenará con resp.cuotas

  constructor(private http: HttpClient, private bonoService: BonoServices) {}

  validarBono() {
    this.loading = true;
    this.errorMsg = '';
    this.bonoService.calcularBBP({
      valorVivienda: this.valorVivienda,
      esSostenible: this.esSostenible,
      esIntegrador: this.esIntegrador
    }).subscribe({
      next: (resp: any) => {
        this.montoBonoAplicado = resp.montoBono;
        this.pasoActual = 2;
        this.loading = false;
      },
      error: () => { this.errorMsg = 'Error al calcular bono'; this.loading = false; }
    });
  }

  calcularPorcentaje() {
    if (this.valorVivienda > 0) {
      this.porcentajeCalculado = (this.cuotaInicialMonto * 100) / this.valorVivienda;
    }
  }

  mostrarBancosDisponibles() {
    this.loading = true;
    this.http.get<any[]>('http://localhost:8080/api/cronograma/bancos-disponibles', {
      params: {
        sueldo: this.sueldoIngresado.toString(),
        precio: this.valorVivienda.toString(),
        cuotaInicial: this.cuotaInicialMonto.toString()
      }
    }).subscribe({
      next: (data) => {
        this.bancosFiltrados = data;
        this.loading = false;
        if (data.length === 0) this.errorMsg = "No hay bancos disponibles.";
      },
      error: () => { this.errorMsg = "Error al consultar bancos."; this.loading = false; }
    });
  }

  // ... dentro de la clase SimuladorComponent ...

  // VALIDACION DEL TIPO DE GRACIA
  onTipoGraciaChange() {
    if (this.tipoGracia === 'SIN_GRACIA') {
      this.mesesGracia = 0;
    }
  }

  generar() {
    this.errorMsg = '';
    this.cronograma = null;

    if (this.plazoMeses < 60 || this.plazoMeses > 300) {
    this.errorMsg = "El plazo debe estar entre 60 y 300 meses para proceder.";
    return; // <--- ESTO DETIENE TODO. No habrá post, no habrá cálculo.
  }
    // 1. Buscar los datos del banco seleccionado para validar límites
    const bancoSeleccionado = this.bancosFiltrados.find(b => b.id === this.entidadIdSeleccionada);

    if (!bancoSeleccionado) {
      this.errorMsg = "Seleccione una entidad financiera válida.";
      return;
    }

    // 2. Validación de Plazo Máximo (del Banco)
    if (this.plazoMeses > bancoSeleccionado.plazoMaximoMeses) {
      this.errorMsg = `El plazo máximo para ${bancoSeleccionado.nombreEntidad} es de ${bancoSeleccionado.plazoMaximoMeses} meses.`;
      return;
    }

    // 3. Validación de Plazo Mínimo (Mivivienda suele ser 60 meses)
    if (this.plazoMeses < 60) {
      this.errorMsg = "El plazo mínimo para este crédito es de 60 meses (5 años).";
      return;
    }

    // 4. Validación de Meses de Gracia vs Tipo de Gracia
    if (this.tipoGracia === 'SIN_GRACIA' && this.mesesGracia > 0) {
      this.mesesGracia = 0; // Forzamos a 0 por seguridad
    }

    // 5. Validación de no exceder los meses de gracia (máximo 6 meses suele ser el estándar)
    if (this.mesesGracia > 6) {
      this.errorMsg = "El periodo de gracia no puede exceder los 6 meses.";
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    const request: SimulacionRequestDTO = {
      entidadId: this.entidadIdSeleccionada!,
      valorVivienda: this.valorVivienda,
      cuotaInicial: this.cuotaInicialMonto,
      bonoMonto: this.montoBonoAplicado,
      plazoMeses: this.plazoMeses,
      sueldoNeto: this.sueldoIngresado,
      mesesGracia: this.mesesGracia || 0,
      tipoGracia: this.tipoGracia,
      tipoCambio: this.tipoCambio
    };

    this.http.post('http://localhost:8080/api/cronograma/generar-cronograma', request)
      .subscribe({
        next: (resp: any) => {
          this.cronograma = resp;
          this.listaDeCuotas = resp.cuotas;
          this.loading = false;
          setTimeout(() => document.getElementById('resultado-final')?.scrollIntoView({ behavior: 'smooth' }), 200);
        },
        error: (err) => {
          this.errorMsg = "Error: " + (err.error || "No se pudo procesar la solicitud");
          this.loading = false;
        }
      });
  }

  reiniciar() {
    this.pasoActual = 1;
    this.cronograma = null;
    this.listaDeCuotas = [];
    this.entidadIdSeleccionada = null;
  }
}