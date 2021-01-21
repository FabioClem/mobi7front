import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class ToastyMontService {
  constructor(private toastr: ToastrService) {}

  mostraOToasty(
    titulo: string,
    mensagem: string,
    tema?: 'default' | 'info' | 'success' | 'wait' | 'error' | 'warning',
    timeout?: number
  ) {
    timeout = timeout ? timeout : 5000;
    switch (tema) {
      case 'default':
        this.toastr.show(titulo, mensagem, { timeOut: timeout });
        break;
      case 'info':
        this.toastr.info(titulo, mensagem, { timeOut: timeout });
        break;
      case 'success':
        this.toastr.success(titulo, mensagem, { timeOut: timeout });
        break;
      case 'error':
        this.toastr.error(titulo, mensagem, { timeOut: timeout });
        break;
      case 'warning':
        this.toastr.warning(titulo, mensagem, { timeOut: timeout });
        break;
    }
  }
}
