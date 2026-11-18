import { Routes } from '@angular/router';
import { Paises } from './componentes/paises/paises';
import { TiposFestivos } from './componentes/tipos-festivos/tipos-festivos';
import { Festivos } from './componentes/festivos/festivos';
import { Consultas } from './componentes/consultas/consultas';

export const routes: Routes = [
  { path: '', redirectTo: 'festivos', pathMatch: 'full' },
  { path: 'paises', component: Paises },
  { path: 'tipos-festivos', component: TiposFestivos },
  { path: 'festivos', component: Festivos },
  { path: 'consultas', component: Consultas },
  { path: '**', redirectTo: 'festivos' }
];
