import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { take, tap } from 'rxjs/operators';
import { ToastyMontService } from 'src/app/home/geral-service/toasty.service';
import { ListaPoisService } from '../../../lista-pois.service';
import { PosicoesVeiculosModel } from '../../../model/posicoes-veiculos.model';
import {
  getPosicoesVeiculos,
  setErrorServiceMessage,
  setPosicoesVeiculos,
} from '../action/actions';

@Injectable({ providedIn: 'root' })
export class PosicoesVeiculoEffects {
  constructor(
    private actions$: Actions,
    private store: Store<any>,
    private listaPoisService: ListaPoisService,
    private toastyMontService: ToastyMontService
  ) {}

  getPosicoesVeiculos$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getPosicoesVeiculos),
        tap(({ placa, data }) => {
          this.listaPoisService
            .getPosicaoPorPlaca(placa, data)
            .pipe(take(1))
            .subscribe(
              async (resposta: PosicoesVeiculosModel[]) => {
                this.store.dispatch(
                  setPosicoesVeiculos({ posicoes: resposta })
                );
              },
              (error) => {
                this.store.dispatch(
                  setErrorServiceMessage({
                    erro:
                      'Não foi possivel carregar a lista de Posições por placa, verifique com o adiministrador do sistema para mais informações.',
                  })
                );
                this.toastyMontService.mostraOToasty(
                  error.msg,
                  'Ops, aconteceu algo',
                  'error'
                );
              }
            );
        })
      ),
    { dispatch: false }
  );
}
