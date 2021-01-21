import { ActionReducerMap } from '@ngrx/store';
import {
  PosicoesVeiculoState,
  reducer as posicaoVeiculoReducer,
} from '../lista-pois/lista-posicoes-por-placa/ngrx/reducer/reducers';

export interface AppState {
  posicoesVeiculos: PosicoesVeiculoState;
}
export const reducers: ActionReducerMap<AppState> = {
  posicoesVeiculos: posicaoVeiculoReducer,
};
