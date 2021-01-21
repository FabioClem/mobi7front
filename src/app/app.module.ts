import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';

import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityModule } from '@clr/angular';

import { ToastrModule } from 'ngx-toastr';

import localePt from '@angular/common/locales/pt';
import { StoreModule } from '@ngrx/store';

import {
  listaPosicoesVeiculosFeatureKey,
  reducer as posicoesVeiculosReducer,
} from './home/lista-pois/lista-posicoes-por-placa/ngrx/reducer/reducers';
import { EffectsModule } from '@ngrx/effects';
import { PosicoesVeiculoEffects } from './home/lista-pois/lista-posicoes-por-placa/ngrx/effect/effect';

registerLocaleData(localePt);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    ClarityModule,
    ToastrModule.forRoot(),
    StoreModule.forRoot({}),
    StoreModule.forFeature(
      listaPosicoesVeiculosFeatureKey,
      posicoesVeiculosReducer
    ),
    EffectsModule.forRoot([PosicoesVeiculoEffects]),
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
