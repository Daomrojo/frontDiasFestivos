import { Pais } from './pais';
import { TipoFestivo } from './tipo-festivo';

export interface Festivo {
  id: number;
  nombre: string;
  dia: number;
  mes: number;
  diasPascua: number;
  idPais: number;
  pais?: Pais;
  idTipo: number;
  tipoFestivo?: TipoFestivo;
}