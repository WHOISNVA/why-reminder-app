import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { StorageService } from '../services/storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private storage: StorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.
    const userInfo = this.storage.getUser();
    //console.log('intercept:', JSON.stringify(userInfo));
    // Clone the request and replace the original headers with    
    if(userInfo && userInfo.idToken) {
        req = req.clone({
            setHeaders: {
                'Authorization': `${userInfo.idToken}`,
            }            
        });
        //console.log('authReq:', req);
        // send cloned request with header to the next handler.
        return next.handle(req); 
    } else {
        return next.handle(req);
    }
  }
}
