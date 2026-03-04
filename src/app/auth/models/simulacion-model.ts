import { EntidadFinanciera } from "./entidadFinanciera.model";

export interface Simulacion {
    id?: number;
    entidad?: EntidadFinanciera;
    entidadId?: number; // Útil para enviar solo el ID al backend
    valorInmueble: number;
    porcentajeCuotaInicial: number;
    montoBonoAplicado: number;
    plazoMeses: number;
    mesesGracia: number;
    tipoGracia: 'TOTAL' | 'PARCIAL' | 'SIN_GRACIA';
    monedaSimulacion: 'PEN' | 'USD';
    tipoCambioUsado: number;
    fechaSimulacion?: Date;
}