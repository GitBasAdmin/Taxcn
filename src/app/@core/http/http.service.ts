import { Inject, Injectable, InjectionToken, Injector, Optional, Type } from '@angular/core';
import { HttpClient, HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ErrorHandlerInterceptor } from '../../@core/http/error-handler.interceptor';
// import { ApiPrefixInterceptor } from '@core/http/api-prefix.interceptor';
// import { AuthInterceptor } from '@core/http/auth.interceptor';
import { LoadingInterceptor } from '../../@core/http/loading.interceptor';
import { HeaderInterceptor } from '../../@core/http/header.interceptor';
// import { HttpCancelInterceptor } from '@core/http/http-cancel.interceptor';

// HttpClient is declared in a re-exported module, so we have to extend the original module to make it work properly
// (see https://github.com/Microsoft/TypeScript/issues/13897)
declare module '@angular/common/http/' {
  // Augment HttpClient with the added configuration methods from HttpService, to allow in-place replacement of
  // HttpClient with HttpService using dependency injection
  export interface HttpClient {
    /**
     * Skips default error handler for this request.
     * @return The new instance.
     */
    skipErrorHandler(): HttpClient;

    /**
     * Do not use API prefix for this request.
     * @return The new instance.
     */
    disableApiPrefix(): HttpClient;
    /**
     * Do not use block UI for this request.
     * @return The new instance.
     */
    disableLoading(): HttpClient;
    /**
     * Do not append header for this request.
     * @return The new instance.
     */
    disableHeader(): HttpClient;

    disableAuthentication(): HttpClient;
  }
}

// From @angular/common/http/src/interceptor: allows to chain interceptors
class HttpInterceptorHandler implements HttpHandler {
  constructor(private next: HttpHandler, private interceptor: HttpInterceptor) {}

  handle(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    return this.interceptor.intercept(request, this.next);
  }
}

/**
 * Allows to override default dynamic interceptors that can be disabled with the HttpService extension.
 * Except for very specific needs, you should better configure these interceptors directly in the constructor below
 * for better readability.
 *
 * For static interceptors that should always be enabled (like ApiPrefixInterceptor), use the standard
 * HTTP_INTERCEPTORS token.
 */
export const HTTP_DYNAMIC_INTERCEPTORS = new InjectionToken<HttpInterceptor>('HTTP_DYNAMIC_INTERCEPTORS');

/**
 * Extends HttpClient with per request configuration using dynamic interceptors.
 */
@Injectable({
  providedIn: 'root'
})
export class HttpService extends HttpClient {
  constructor(
    private httpHandler: HttpHandler,
    private injector: Injector,
    @Optional() @Inject(HTTP_DYNAMIC_INTERCEPTORS) private interceptors: HttpInterceptor[] = []
  ) {
    super(httpHandler);

    if (!this.interceptors) {
      // Configure default interceptors that can be disabled here
      this.interceptors = [
        // this.injector.get(ApiPrefixInterceptor),
        this.injector.get(ErrorHandlerInterceptor),
        // this.injector.get(AuthInterceptor),
        this.injector.get(LoadingInterceptor),
        this.injector.get(HeaderInterceptor),
        // this.injector.get(HttpCancelInterceptor),
      ];
    }
  }

  override skipErrorHandler(): HttpClient {
    return this.removeInterceptor(ErrorHandlerInterceptor);
  }

  // disableApiPrefix(): HttpClient {
  //   return this.removeInterceptor(ApiPrefixInterceptor);
  // }

  // disableAuthentication(): HttpClient {
  //   return this.removeInterceptor(AuthInterceptor);
  // }

  override disableLoading(): HttpClient {
    return this.removeInterceptor(LoadingInterceptor);
  }

  override disableHeader(): HttpClient {
    return this.removeInterceptor(HeaderInterceptor)
  }

  // Override the original method to wire interceptors when triggering the request.
  override request(method?: any, url?: any, options?: any): any {
    const handler = this.interceptors.reduceRight(
      (next, interceptor) => new HttpInterceptorHandler(next, interceptor),
      this.httpHandler
    );
    /*
    var xxx = JSON.parse(options.body);
    xxx.programName = 'xxxx';
    options.body = JSON.stringify(xxx);
    console.log(options)
    */
    return new HttpClient(handler).request(method, url, options);
  }

  private removeInterceptor(interceptorType: Type<HttpInterceptor>): HttpService {
    return new HttpService(
      this.httpHandler,
      this.injector,
      this.interceptors.filter((i) => !(i instanceof interceptorType))
    );
  }

  private addInterceptor(interceptor: HttpInterceptor): HttpService {
    return new HttpService(this.httpHandler, this.injector, this.interceptors.concat([interceptor]));
  }
}
