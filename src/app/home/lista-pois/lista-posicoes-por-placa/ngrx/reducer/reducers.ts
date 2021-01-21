import { Action, createReducer, on } from '@ngrx/store';
import { PosicoesVeiculosModel } from '../../../model/posicoes-veiculos.model';

import { setPosicoesVeiculos } from '../action/actions';

export const listaPosicoesVeiculosFeatureKey = 'posicoesVeiculos';

export interface PosicoesVeiculoState {
  posicoes: PosicoesVeiculosModel[];
}

export const initialState: PosicoesVeiculoState = {
  posicoes: [],
};

const posicoesReducer = createReducer(
  initialState,
  on(setPosicoesVeiculos, (state, { posicoes }) => ({ ...state, posicoes }))
);

export function reducer(
  state: PosicoesVeiculoState | undefined,
  action: Action
) {
  return posicoesReducer(state, action);
}
