// core/interceptors/loading.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Mostrar loading al iniciar request
    // this.loadingService.show();

    return next.handle(request).pipe(
      // Ocultar loading al finalizar (éxito o error)
      finalize(() => {
        // this.loadingService.hide();
      })
    );
  }
}
