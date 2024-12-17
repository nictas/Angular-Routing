import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { ProductResolved } from './product';
import { ProductService } from './product.service';

@Injectable({
    providedIn: 'root'
})
export class ProductResolverService implements Resolve<ProductResolved> {

    constructor(private productService: ProductService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProductResolved> {
        const id = route.paramMap.get('id');
        if (isNaN(Number(id))) {
            const message = `Product ID is not a number: ${id}`;
            return of({ product: null, error: message });
        }
        return this.productService.getProduct(Number(id)).pipe(
            map(product => ({ product: product })),
            catchError(error => {
                const message = `Error while retrieving product: ${error}`;
                return of({ product: null, error: message });
            })
        );
    }

}
