import { Cuota } from './cuota.model';

export interface CronogramaPagos {
    id?: number;
    simulacionId?: number;
    tcea: number;
    van: number; // Agregado según lo que calculamos en el backend
    tir: number; // Agregado según lo que calculamos en el backend
    montoPrestamoNeto: number;
    totalIntereses: number;
    montoTotalPagado: number;
    cuotas?: Cuota[]; // Lista de cuotas asociadas
}