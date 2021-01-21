import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { take } from 'rxjs/operators';

import { ListaPoisComponent } from './lista-pois.component';
import { ListaPoisService } from './lista-pois.service';

describe('ListaPoisComponent', () => {
  let component: ListaPoisComponent;
  let fixture: ComponentFixture<ListaPoisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), ToastrModule.forRoot()],
      declarations: [ListaPoisComponent],
      providers: [
        { provide: HttpClient },
        { provide: HttpHandler },
        ListaPoisService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPoisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should bind value in input dataSelecionada', () => {
    const nativeElement = fixture.nativeElement;
    const dataSelecionadaInput: HTMLInputElement = nativeElement.querySelector(
      '#dataSelecionada'
    );
    fixture.detectChanges();

    dataSelecionadaInput.value = '12/16/2018';

    dataSelecionadaInput.dispatchEvent(new Event('input'));

    expect(component.dataSelecionada).not.toBeNull();
  });

  it('expect ListaPoisService injection', inject(
    [ListaPoisService],
    (service: ListaPoisService) => {
      expect(service).toBeTruthy();
    }
  ));

  it('expect service getPlacasDisponiveisMock return info', inject(
    [ListaPoisService],
    (service: ListaPoisService) => {
      service
        .getPlacasDisponiveisMock()
        .pipe(take(1))
        .subscribe((r) => {
          expect(r).toBeInstanceOf(Array);
        });
    }
  ));

  it('expect service getPlacasDisponiveis return info | error', inject(
    [ListaPoisService],
    (service: ListaPoisService) => {
      service
        .getPlacasDisponiveis()
        .pipe(take(1))
        .subscribe(
          (r) => {
            expect(r).toBeInstanceOf(Array);
          },
          (error) => {
            expect(error).not.toBeNull();
          }
        );
    }
  ));

  it('should set message "Sem placa" to screen', () => {
    component.dataSelecionada = '';
    component.listarPosicaoPorPlaca('');
    expect(component.errorSemData).toBeTruthy();
  });

  it('should filter datagrid contains more than one value', inject(
    [ListaPoisService],
    (service: ListaPoisService) => {
      service
        .getPlacasDisponiveisMock()
        .pipe(take(1))
        .subscribe((resposta: string[]) => {
          component.listaPlacasOriginal = resposta;
          component.textoFiltro = 'a';
          // resposta contem os seguintes valores mockados '123', '321', 'abc', 'cba'
          component.filtraListaPlaca();
          expect(component.listaPlacas.length).toBeGreaterThan(1);
        });
    }
  ));
});
