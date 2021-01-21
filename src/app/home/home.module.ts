import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { ListaPoisComponent } from './lista-pois/lista-pois.component';
import { HttpClientModule } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ListaPosicoesPorPlacaComponent } from './lista-pois/lista-posicoes-por-placa/lista-posicoes-por-placa.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityModule } from '@clr/angular';

@NgModule({
  imports: [
    HomeRoutingModule,
    HttpClientModule,
    CommonModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ClarityModule,
  ],
  exports: [],
  declarations: [HomeComponent, ListaPoisComponent, ListaPosicoesPorPlacaComponent],
  providers: [],
})
export class HomeModule {}
