import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EntidadFinanciera } from '../models/entidadFinanciera.model';
import { CronogramaPagos } from '../models/cronograma.model';
import { CronogramaServices } from '../services/cronograma.services';
import { Simulacion } from '../models/simulacion-model';
import { SimulacionRequestDTO } from '../models/simulacion-requestDTO';

@Component({
  selector: 'app-simulador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './simulador.html',
  styleUrl: './simulador.css',
})
export class Simulador {

  // CONTROL DE ETAPAS
  pasoActual: 1 | 2 | 3 = 1;

  simulacion: Simulacion = {
    valorInmueble: 0,
    porcentajeCuotaInicial: 7.5,
    montoBonoAplicado: 0,
    plazoMeses: 120,
    mesesGracia: 0,
    tipoGracia: 'SIN_GRACIA',
    monedaSimulacion: 'PEN',
    tipoCambioUsado: 3.75,
    entidadId: undefined
  };

  sueldoIngresado: number = 0;

  bancos: EntidadFinanciera[] = [];
  cronograma: CronogramaPagos | null = null;
  loading = false;
  errorMsg = '';

  constructor(private cronogramaService: CronogramaServices) {}

  // ==============================
  // PASO 1 - VALIDAR BONO
  // ==============================

  validarBono(): void {

    this.errorMsg = '';
    this.cronograma = null;

    if (!this.simulacion.valorInmueble || !this.sueldoIngresado) {
      this.errorMsg = 'Debe ingresar sueldo y valor del inmueble.';
      return;
    }

    this.calcularBonoAutomatico();

    if (this.simulacion.montoBonoAplicado > 0) {
      this.pasoActual = 2;
    } else {
      this.errorMsg = 'No califica para Bono del Buen Pagador.';
    }
  }

  private calcularBonoAutomatico(): void {
    const p = this.simulacion.valorInmueble;

    if (p >= 68800 && p <= 98100) this.simulacion.montoBonoAplicado = 27400;
    else if (p > 98100 && p <= 146900) this.simulacion.montoBonoAplicado = 22800;
    else if (p > 146900 && p <= 244600) this.simulacion.montoBonoAplicado = 20900;
    else if (p > 244600 && p <= 362100) this.simulacion.montoBonoAplicado = 7800;
    else this.simulacion.montoBonoAplicado = 0;
  }

  // ==============================
  // PASO 2 - FILTRAR BANCOS
  // ==============================

  buscarBancos(): void {

    if (this.simulacion.porcentajeCuotaInicial < 7.5) {
      this.errorMsg = 'La cuota inicial mínima es 7.5%.';
      return;
    }

    const montoInicial =
      (this.simulacion.porcentajeCuotaInicial *
        this.simulacion.valorInmueble) /
      100;

    this.cronogramaService
      .getBancosAptos(
        this.sueldoIngresado,
        this.simulacion.valorInmueble,
        montoInicial
      )
      .subscribe({
        next: (res) => {
          this.bancos = res;

          if (res.length === 0) {
            this.errorMsg = 'No hay bancos disponibles para este perfil.';
            return;
          }

          this.pasoActual = 3;
        },
        error: () =>
          (this.errorMsg = 'Error al buscar bancos disponibles.'),
      });
  }

  // ==============================
  // PASO 3 - GENERAR CRONOGRAMA
  // ==============================

  generar(): void {

    if (!this.simulacion.entidadId) {
      this.errorMsg = 'Debe seleccionar un banco.';
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    const requestDTO: SimulacionRequestDTO = {
      entidadId: this.simulacion.entidadId,
      valorVivienda: this.simulacion.valorInmueble,
      cuotaInicial:
        (this.simulacion.porcentajeCuotaInicial *
          this.simulacion.valorInmueble) /
        100,
      bonoMonto: this.simulacion.montoBonoAplicado,
      plazoMeses: this.simulacion.plazoMeses,
      sueldoNeto: this.sueldoIngresado,
      mesesGracia: this.simulacion.mesesGracia,
      tipoGracia: this.simulacion.tipoGracia,
      tipoCambio: this.simulacion.tipoCambioUsado
    };

    this.cronogramaService.generarCronograma(requestDTO).subscribe({
      next: (res) => {
        this.cronograma = res;
        this.loading = false;
        this.scrollResultado();
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Error en el cálculo';
      }
    });
  }

  private scrollResultado(): void {
    setTimeout(() => {
      const element = document.getElementById('resultado-seccion');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  nuevaSimulacion(): void {
    this.pasoActual = 1;
    this.bancos = [];
    this.cronograma = null;
    this.errorMsg = '';
    this.simulacion.entidadId = undefined;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}