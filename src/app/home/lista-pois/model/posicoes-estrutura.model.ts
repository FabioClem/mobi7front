import { PosicoesVeiculosModel } from './posicoes-veiculos.model';

export interface PosicoesEstruturaModel {
  nome: string;
  tempo: string;
  posicoesVeiculosNoRaio: PosicoesVeiculosModel[];
}
