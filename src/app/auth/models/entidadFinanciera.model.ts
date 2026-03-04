export interface EntidadFinanciera {
    id?: number;
    nombreEntidad: string;
    tasaEfectivaAnual: number;
    tasaSeguroDesgravamen: number;
    tasaSeguroInmueble: number;
    ingresoMinimoRequerido: number;
    montoMaximoPrestamo: number;
    periodoGraciaMaximo: number;
    precioMinVivienda: number;
    precioMaxVivienda: number;
    porcentajeCuotaInicialMinima: number;
    admiteCRC: boolean;
}