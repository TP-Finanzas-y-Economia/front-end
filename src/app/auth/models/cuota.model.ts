export interface Cuota {
    id?: number;
    numeroCuota: number;
    saldoInsoluto: number;
    interes: number;
    amortizacion: number;
    seguroDesgravamen: number;
    seguroInmueble: number;
    montoCuotaSoles: number;
    montoCuotaDolares: number;
}