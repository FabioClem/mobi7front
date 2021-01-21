import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaPoisComponent } from './lista-pois/lista-pois.component';
import { ListaPosicoesPorPlacaComponent } from './lista-pois/lista-posicoes-por-placa/lista-posicoes-por-placa.component';

const routes: Routes = [
  { path: 'acoes', redirectTo: 'acoes/lista-pois', pathMatch: 'full' },
  { path: 'acoes/lista-pois', component: ListaPoisComponent },
  {
    path: 'acoes/lista-posicoes-por-placa/:placa/:data',
    component: ListaPosicoesPorPlacaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
