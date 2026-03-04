export interface SimulacionRequestDTO {
    entidadId:number;        // ID del banco elegido
    valorVivienda:number;     // Precio del inmueble (S/ o $)
    cuotaInicial:number;      // Monto de la inicial (sin bono)
    bonoMonto:number;         // El monto del BBP calculado previamente
    plazoMeses:number;       // De 60 a 300
    sueldoNeto:number;        // Para validar ingreso mínimo
    mesesGracia:number;      // 0 a 6
    tipoGracia:string;        // "TOTAL", "PARCIAL" o "SIN_GRACIA"
    tipoCambio:number; 
}