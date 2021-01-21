import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { ToastrModule } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { ListaPoisService } from '../lista-pois.service';
import { PosicoesVeiculosModel } from '../model/posicoes-veiculos.model';
import { Posicoes } from '../model/posicoes.model';

import { ListaPosicoesPorPlacaComponent } from './lista-posicoes-por-placa.component';

describe('ListaPosicoesPorPlacaComponent', () => {
  let component: ListaPosicoesPorPlacaComponent;
  let fixture: ComponentFixture<ListaPosicoesPorPlacaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastrModule.forRoot(), StoreModule.forRoot({})],
      declarations: [ListaPosicoesPorPlacaComponent],
      providers: [
        { provide: HttpClient },
        { provide: HttpHandler },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({
                data: '16122018',
                placa: 'TESTE001',
              }),
            },
          },
        },
        ListaPoisService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPosicoesPorPlacaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('expect ListaPoisService injection', inject(
    [ListaPoisService],
    (service: ListaPoisService) => {
      expect(service).toBeTruthy();
    }
  ));

  it('expect service getPOIS return info | error and insert in variable', inject(
    [ListaPoisService],
    (service: ListaPoisService) => {
      service
        .getPOIS()
        .pipe(take(1))
        .subscribe(
          (r: Posicoes[]) => {
            component.listaComPosicoes = r;
            expect(component.listaComPosicoes).toBeInstanceOf(Array);
          },
          (error) => {
            component.mensagemErro = error.msg;
            expect(component.mensagemErro).not.toBeNull();
          }
        );
    }
  ));

  it('expect service getPosicaoPorPlaca return info | error and insert in variable', inject(
    [ListaPoisService],
    (service: ListaPoisService) => {
      service
        .getPosicaoPorPlaca('TESTE001', '12/16/2018')
        .pipe(take(1))
        .subscribe(
          (r: PosicoesVeiculosModel[]) => {
            component.listaPosicaoVeiculo = r;
            expect(component.listaPosicaoVeiculo).toBeInstanceOf(Array);
          },
          (error) => {
            component.mensagemErro = error.msg;
            expect(component.mensagemErro).not.toBeNull();
          }
        );
    }
  ));

  it('expect message problem with request error', () => {
    const nativeElement = fixture.nativeElement;
    component.mensagemErro =
      'Não foi possivel carregar a lista de Posições por placa, verifique com o adiministrador do sistema para mais informações.';

    expect(
      nativeElement.querySelector(
        '.conteudo .alert .alert-text .mensagem-de-erro'
      ).textContent
    ).not.toBeNull();
  });

  it('expect to sum a array of dates', () => {
    let posicoesDummy: PosicoesVeiculosModel[] = [
      {
        data: '2018-12-16T00:13:28.000+00:00',
        id: 1,
        ignicao: false,
        latitude: 0,
        longitude: 0,
        placa: 'teste1',
        velocidade: 0,
      },
      {
        data: '2018-12-16T15:44:59.000+00:00',
        id: 2,
        ignicao: false,
        latitude: 0,
        longitude: 0,
        placa: 'teste1',
        velocidade: 0,
      },
      {
        data: '2018-12-16T23:45:47.000+00:00',
        id: 3,
        ignicao: false,
        latitude: 0,
        longitude: 0,
        placa: 'teste1',
        velocidade: 0,
      },
    ];
    const datasSomadas = component.somaDatas(posicoesDummy);
    // valor somado de horas das informações acima 23.538611111111113
    expect(datasSomadas.asHours()).toBeGreaterThan(23);
  });

  it('expect params "data" formated is there', () => {
    // configurado valor no ActivatedRoute paramMap
    expect(component.data).toContain('12/16/2018');
  });
  it('expect params "placa" is there', () => {
    // configurado valor no ActivatedRoute paramMap
    expect(component.placa).toContain('TESTE001');
  });
});
