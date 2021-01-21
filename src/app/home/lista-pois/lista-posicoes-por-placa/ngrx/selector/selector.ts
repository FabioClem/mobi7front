import { createFeatureSelector, createSelector } from '@ngrx/store';

import {
  PosicoesVeiculoState,
  listaPosicoesVeiculosFeatureKey,
} from '../reducer/reducers';

export const selectPosicoesState = createFeatureSelector<PosicoesVeiculoState>(
  listaPosicoesVeiculosFeatureKey
);

export const selectPosicoesVeiculos = createSelector(
  selectPosicoesState,
  (posicoesVeiculos) => (posicoesVeiculos ? posicoesVeiculos.posicoes : [])
);
