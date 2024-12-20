import { NgModule } from '@angular/core';

import { ProductDetailComponent } from './product-detail.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductListComponent } from './product-list.component';

import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ProductEditInfoComponent } from './product-edit/product-edit-info.component';
import { ProductEditTagsComponent } from './product-edit/product-edit-tags.component';
import { ProductResolverService } from './product-resolver.service';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: 'products',
        children: [
          {
            path: '', component: ProductListComponent
          },
          {
            path: ':id', component: ProductDetailComponent,
            resolve: { product: ProductResolverService }
          },
          {
            path: ':id/edit', component: ProductEditComponent,
            resolve: { product: ProductResolverService },
            children: [
              { path: '', redirectTo: 'info', pathMatch: 'full' },
              { path: 'info', component: ProductEditInfoComponent },
              { path: 'tags', component: ProductEditTagsComponent }
            ]
          }
        ]
      }
    ])
  ],
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    ProductEditComponent,
    ProductEditInfoComponent,
    ProductEditTagsComponent
  ]
})
export class ProductModule { }
