import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, interval, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { PosicoesEstruturaModel } from './model/posicoes-estrutura.model';

import { RoutesEnum } from './../geral-service/routes.enum';

@Injectable({ providedIn: 'root' })
export class ListaPoisService {
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    params: undefined,
  };

  getPlacasDisponiveis(): Observable<any> {
    return this.http
      .get(RoutesEnum.placasDisponiveis, this.httpOptions)
      .pipe(catchError((erro) => this.trataErro(erro)));
  }

  getPlacasDisponiveisMock(): Observable<any> {
    return new Observable((observer) => {
      observer.next(['123', '321', 'abc', 'cba']);
    }).pipe(catchError((erro) => this.trataErro(erro)));
  }

  getPosicaoPorPlacaInterval(placa?: string, data?: string): Observable<any> {
    const timer = 2 * 60 * 1000; // esta para atualizar a cada 2 minutos
    return interval(timer).pipe(
      switchMap(() => this.getPosicaoPorPlaca(placa, data))
    );
  }

  getPosicaoPorPlaca(placa?: string, data?: string): Observable<any> {
    this.httpOptions = {
      ...this.httpOptions,
      params: this.montaUrlPosicaoPorPaca(placa, data),
    };
    return this.http
      .get(RoutesEnum.posicoesPorPlaca, this.httpOptions)
      .pipe(catchError((erro) => this.trataErro(erro)));
  }

  montaUrlPosicaoPorPaca(placa?: string, data?: string) {
    let infos: any;
    if (placa && data) {
      infos = {
        placa,
        data,
      };
    } else {
      infos = '';
    }
    return infos;
  }

  getPOIS(): Observable<any> {
    this.httpOptions = {
      ...this.httpOptions,
      params: undefined,
    };

    const timer = 1000;

    return this.http
      .get(RoutesEnum.pontosDeInteresse, this.httpOptions)
      .pipe(catchError((erro) => this.trataErro(erro)));
  }

  trataErro(erro: any) {
    let err: any;

    if (erro.status === 0) {
      err = {
        msg: 'Houve um problema em nosso serviço, por favor aguarde.',
        cod: erro.status,
      };
    } else {
      // Mapeado com o status e message padrão, pois não saiu nada diferente de status 0
      err = { cod: erro.status, msg: erro.message };
    }

    return throwError(err);
  }

  mountMockPosicoesPorPlaca(): Observable<PosicoesEstruturaModel[]> {
    return new Observable((observer) => {
      observer.next([
        { nome: '1', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '2', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '3', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '4', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '5', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '6', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '7', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '8', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '9', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '10', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '1', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '2', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '3', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '4', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '5', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '6', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '7', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '8', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '9', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '10', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '1', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '2', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '3', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '4', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '5', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '6', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '7', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '8', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '9', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '10', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '1', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '2', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '3', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '4', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '5', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '6', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '7', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '8', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '9', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '10', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '1', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '2', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '3', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '4', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '5', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '6', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '7', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '8', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '9', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
        { nome: '10', tempo: 'tempo', posicoesVeiculosNoRaio: [] },
      ] as PosicoesEstruturaModel[]);
    });
  }
}
