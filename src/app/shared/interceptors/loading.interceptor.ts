import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {


  constructor(private loader :LoadingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // if (request.method === 'GET' &&
    // (request.url.includes('summary/') || request.url.includes('user/')
    // ||request.url.includes('role/')||request.url.includes('jobDegree/')
    // )) {
    //   return next.handle(request);
    // }
    // if (request.method === 'POST' ) {
    //   return next.handle(request);
    // }
    // if (request.method === 'PUT' ) {
    //   return next.handle(request);
    // }
    // if (request.method === 'DELETE' && request.url.includes('summary/')) {
    //   return next.handle(request);
    // }
    if (request.method === 'GET' ) {
        return next.handle(request);
      }
    this.loader.busy();
    return next.handle(request).pipe(
      finalize(() => {

        setTimeout(()=>{
          this.loader.idle();
        },2000)

      })
    );
  }
}
function finalize(arg0: () => void): import("rxjs").OperatorFunction<HttpEvent<any>, HttpEvent<unknown>> {
  throw new Error('Function not implemented.');
}

