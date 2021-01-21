import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take, takeUntil } from 'rxjs/operators';
import { ListaPoisService } from '../lista-pois.service';
import { PosicoesVeiculosModel } from '../model/posicoes-veiculos.model';

import * as moment from 'moment';
import { Posicoes } from '../model/posicoes.model';
import { PosicoesEstruturaModel } from '../model/posicoes-estrutura.model';

import * as geolib from 'geolib';
import { ToastyMontService } from '../../geral-service/toasty.service';
import { select, Store } from '@ngrx/store';
import {
  getPosicoesVeiculos,
  setPosicoesVeiculos,
} from './ngrx/action/actions';
import { selectPosicoesVeiculos } from './ngrx/selector/selector';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-lista-posicoes-por-placa',
  templateUrl: './lista-posicoes-por-placa.component.html',
  styleUrls: ['./lista-posicoes-por-placa.component.scss'],
  providers: [ListaPoisService, ToastyMontService],
})
export class ListaPosicoesPorPlacaComponent implements OnInit {
  public estaCarregando = false;
  public mensagemErro: string = '';

  public listaComPosicoes: Posicoes[] = [];

  public listaPosicaoVeiculo: PosicoesVeiculosModel[] = [];

  public listaDePontosAglomeradoOriginal: PosicoesEstruturaModel[] = [];

  public listaDePontosAglomerado: PosicoesEstruturaModel[] = [];

  public quantidadeCarregadaNaLista: number = 30;

  public placa: string = '';
  public data: string = '';

  public esconderRegistrosQueNaoPossuiTempo = false;

  public $unsubscribe: Subject<void> = new Subject<void>();

  public ultimaAtualizacao: string = '';

  constructor(
    private listaPoisService: ListaPoisService,
    private route: ActivatedRoute,
    private toastyMontService: ToastyMontService,
    private store: Store<any>
  ) {}

  async ngOnInit() {
    await this.montaInformacoesInit();
    // this.mountInfoInMock(); // Usado para mock
    this.pegaPosicoesVeiculosStorage();
  }

  pegaPosicoesVeiculosStorage() {
    this.store
      .pipe(select(selectPosicoesVeiculos), takeUntil(this.$unsubscribe))
      .subscribe(async (posicoesVeiculos: PosicoesVeiculosModel[]) => {
        this.listaPosicaoVeiculo = [];
        setTimeout(async () => {
          this.ultimaAtualizacao = moment().format('DD/MM/YYYY HH:mm:ss');
          this.listaPosicaoVeiculo = posicoesVeiculos;
          this.estaCarregando = false;
          await this.validEntrouNoRaioAndPush();
        }, 50);
      });
  }

  async montaInformacoesInit() {
    this.placa = this.route.snapshot.paramMap.get('placa') as string;
    this.data = moment(
      this.route.snapshot.paramMap.get('data') as string,
      'DDMMYYYY'
    ).format('MM/DD/YYYY');
    if (this.placa && this.data) {
      this.store.dispatch(
        getPosicoesVeiculos({ placa: this.placa, data: this.data })
      );
      this.listarPosicaoPorPlaca(this.placa, this.data);
      await this.getAllPOIS();
    } else {
      this.toastyMontService.mostraOToasty(
        'A placa e a data são necessarios para a busca por favor insira os dados.',
        'Ops, aconteceu algo',
        'error'
      );
    }
  }

  async listarPosicaoPorPlaca(placa: string, dataFormatada: string) {
    this.estaCarregando = true;
    this.listaPoisService
      .getPosicaoPorPlacaInterval(placa, dataFormatada)
      .pipe(take(1))
      .subscribe(
        async (resposta: PosicoesVeiculosModel[]) => {
          this.store.dispatch(setPosicoesVeiculos({ posicoes: resposta }));
          this.estaCarregando = false;
        },
        (error) => {
          this.estaCarregando = false;
          this.mensagemErro =
            'Não foi possivel carregar a lista de Posições por placa, verifique com o adiministrador do sistema para mais informações.';
          this.toastyMontService.mostraOToasty(
            error.msg,
            'Ops, aconteceu algo',
            'error'
          );
        }
      );
  }

  async getAllPOIS() {
    this.listaPoisService
      .getPOIS()
      .pipe(take(1))
      .subscribe(
        (resposta: Posicoes[]) => {
          this.listaComPosicoes = resposta;
        },
        (error) => {
          this.estaCarregando = false;
          this.mensagemErro =
            'Não foi possivel carregar a lista de Pontos de interesse, verifique com o adiministrador do sistema para mais informações.';
          this.toastyMontService.mostraOToasty(
            error.msg,
            'Ops, aconteceu algo',
            'error'
          );
        }
      );
  }

  async validEntrouNoRaioAndPush() {
    this.listaDePontosAglomeradoOriginal = [];
    this.listaDePontosAglomerado = [];
    let po: PosicoesEstruturaModel[] = [];
    this.listaComPosicoes.forEach((poi) => {
      const p: PosicoesEstruturaModel = {
        nome: poi.nome,
        tempo: '',
        posicoesVeiculosNoRaio: [],
      };
      this.listaPosicaoVeiculo.forEach((posicaoVeiculo) => {
        /** Utilizado biblioteca de terceiro com a formula. */
        const isPoint = geolib.isPointWithinRadius(
          {
            latitude: posicaoVeiculo.latitude,
            longitude: posicaoVeiculo.longitude,
          },
          { latitude: poi.latitude, longitude: poi.longitude },
          poi.raio // o raio vem em metros !?
        );

        if (isPoint) {
          p.posicoesVeiculosNoRaio.push(posicaoVeiculo);
        }
      });
      po.push(this.organizaTempoDaLista(p));
    });
    this.listaDePontosAglomeradoOriginal = po;
    for (let index = 0; index < this.quantidadeCarregadaNaLista; index++) {
      const ponto = this.listaDePontosAglomeradoOriginal[index];
      if (ponto) {
        this.listaDePontosAglomerado.push(ponto);
      }
    }
  }

  organizaTempoDaLista(
    posicoes: PosicoesEstruturaModel
  ): PosicoesEstruturaModel {
    if (posicoes.posicoesVeiculosNoRaio.length > 0) {
      const tempo = this.somaDatas(posicoes.posicoesVeiculosNoRaio);
      posicoes.tempo =
        tempo.hours() +
        ' horas ' +
        tempo.minutes() +
        ' minutos ' +
        tempo.seconds() +
        ' segundos';
    } else {
      posicoes.tempo = 'N/A';
    }
    return posicoes;
  }

  somaDatas(posicoesVeiculosNoRaio: PosicoesVeiculosModel[]) {
    posicoesVeiculosNoRaio.reduce((a, b) => {
      return new Date(a.data) > new Date(b.data) ? a : b;
    });
    const dataInicio = posicoesVeiculosNoRaio[0].data;
    const dataFim =
      posicoesVeiculosNoRaio[posicoesVeiculosNoRaio.length - 1].data;
    let ms = moment(dataFim).diff(moment(dataInicio));
    var d = moment.duration(ms);
    return d;
  }

  @HostListener('scroll', ['$event'])
  onScrolll($event: any) {
    if (
      $event.target.offsetHeight + $event.target.scrollTop >=
      $event.target.scrollHeight
    ) {
      const initIndex = this.listaDePontosAglomerado.length;
      for (
        let index = initIndex;
        index < initIndex + this.quantidadeCarregadaNaLista;
        index++
      ) {
        const ponto = this.listaDePontosAglomeradoOriginal[index];
        if (ponto) {
          this.listaDePontosAglomerado.push(ponto);
        }
      }
    }
  }

  mountInfoInMock() {
    this.estaCarregando = true;
    this.listaPoisService
      .mountMockPosicoesPorPlaca()
      .pipe(take(1))
      .subscribe((r) => {
        this.listaDePontosAglomeradoOriginal = r;
        for (let index = 0; index < this.quantidadeCarregadaNaLista; index++) {
          const ponto = this.listaDePontosAglomeradoOriginal[index];
          this.listaDePontosAglomerado.push(ponto);
        }
        this.estaCarregando = false;
      });
  }

  getMostraRegistro(tempo: string) {
    let valid = true;
    if (tempo === 'N/A' && this.esconderRegistrosQueNaoPossuiTempo) {
      valid = false;
    }
    return valid;
  }

  get quatidadePontosAparecendo() {
    let count = 0;
    if (this.esconderRegistrosQueNaoPossuiTempo) {
      this.listaDePontosAglomerado.forEach((pontos) => {
        if (pontos.tempo !== 'N/A') {
          count++;
        }
      });
    } else {
      count = this.listaDePontosAglomerado.length;
    }
    return count;
  }

  get quatidadePontosQuePossuiemTempo() {
    let count = 0;
    this.listaDePontosAglomerado.forEach((pontos) => {
      if (pontos.tempo !== 'N/A') {
        count++;
      }
    });
    return count;
  }

  ngOnDestroy() {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }
}
