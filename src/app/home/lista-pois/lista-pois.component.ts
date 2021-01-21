import { Component, OnInit } from '@angular/core';
import { ListaPoisService } from './lista-pois.service';
import { take } from 'rxjs/operators';

import { Router } from '@angular/router';

import * as moment from 'moment';
import { ToastyMontService } from '../geral-service/toasty.service';

@Component({
  selector: 'app-lista-pois',
  templateUrl: './lista-pois.component.html',
  styleUrls: ['./lista-pois.component.scss'],
  providers: [ListaPoisService, ToastyMontService],
})
export class ListaPoisComponent implements OnInit {
  public listaPlacasOriginal: string[] = [];
  public listaPlacas: string[] = [];

  public dataSelecionada: any;

  public filtroPlaca: string = '';

  public estaCarregando = false;

  public errorSemData = false;

  public textoFiltro: string = '';

  constructor(
    private listaPoisService: ListaPoisService,
    private router: Router,
    private toastyMontService: ToastyMontService
  ) {}

  ngOnInit() {
    this.listarPlacasDisponiveis();
  }

  listarPlacasDisponiveis() {
    this.estaCarregando = true;
    this.listaPoisService
      // .getPlacasDisponiveisMock() // Usado somente para carregar informações em mock
      .getPlacasDisponiveis()
      .pipe(take(1))
      .subscribe(
        (resposta: string[]) => {
          this.estaCarregando = false;
          this.listaPlacasOriginal = resposta;
          this.listaPlacas = this.listaPlacasOriginal;
        },
        (error) => {
          this.estaCarregando = false;
          this.toastyMontService.mostraOToasty(
            error.msg,
            'Ops, aconteceu algo',
            'error'
          );
        }
      );
  }

  listarPosicaoPorPlaca(placa: string) {
    this.errorSemData = false;
    // formatação da data sera de MM/DD/YYYY
    // 16/12/2018
    if (placa && this.dataSelecionada) {
      const formatDate = moment(this.dataSelecionada).format('DDMMYYYY');
      this.router.navigateByUrl(
        `acoes/lista-posicoes-por-placa/${placa}/${formatDate}`
      );
    } else {
      this.errorSemData = true;
      this.toastyMontService.mostraOToasty(
        'Por favor preencha uma data ou um nome valido para continuar com a busca',
        'Ops, aconteceu algo',
        'warning'
      );
    }
  }

  filtraListaPlaca() {
    if (this.textoFiltro) {
      const listaFiltrada: string[] = [];
      this.listaPlacasOriginal.forEach((placa) => {
        if (
          placa
            .toLocaleLowerCase()
            .includes(this.textoFiltro.toLocaleLowerCase())
        ) {
          listaFiltrada.push(placa);
        }
      });

      this.listaPlacas = listaFiltrada;
    } else {
      this.listaPlacas = this.listaPlacasOriginal;
    }
  }
}
