import { createAction, props } from '@ngrx/store';
import { PosicoesVeiculosModel } from '../../../model/posicoes-veiculos.model';

export const setPosicoesVeiculos = createAction(
  '[Lista posicoes por placa] Salva info posicoes por placa',
  props<{ posicoes: PosicoesVeiculosModel[] }>()
);

export const getPosicoesVeiculos = createAction(
  '[Lista posicoes por placa] Busca info posicoes por placa',
  props<{ placa: string; data: string }>()
);

export const setErrorServiceMessage = createAction(
  '[Lista posicoes por placa] Salva erro do serviço',
  props<{ erro: string }>()
);
