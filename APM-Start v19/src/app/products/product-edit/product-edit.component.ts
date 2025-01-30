import { Component, OnInit } from '@angular/core';

import { MessageService } from '../../messages/message.service';

import { Product } from '../product';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css'],
  standalone: false
})
export class ProductEditComponent implements OnInit {
  pageTitle = 'Product Edit';
  errorMessage = '';

  private initialProduct: Product | null = null;
  private currentProduct: Product | null = null;

  private dataIsValid: { [key: string]: boolean } = {};

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  get product(): Product | null {
    return this.currentProduct;
  }

  set product(value: Product | null) {
    this.currentProduct = value;
    // Clone the object to retain a copy
    this.initialProduct = value ? { ...value } : null;
  }

  get isDirty(): boolean {
    return JSON.stringify(this.initialProduct) !== JSON.stringify(this.currentProduct);
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      const productResolved = data['product'];
      this.errorMessage = productResolved.error;
      this.onProductRetrieved(productResolved.product);
    });
  }

  onProductRetrieved(product: Product): void {
    this.product = product;

    if (!this.product) {
      this.pageTitle = 'No product found';
    } else {
      if (this.product.id === 0) {
        this.pageTitle = 'Add Product';
      } else {
        this.pageTitle = `Edit Product: ${this.product.productName}`;
      }
    }
  }

  deleteProduct(): void {
    if (!this.product || !this.product.id) {
      // Don't delete, it was never saved.
      this.onSaveComplete(`${this.product?.productName} was deleted`);
    } else {
      if (confirm(`Really delete the product: ${this.product.productName}?`)) {
        this.productService.deleteProduct(this.product.id).subscribe({
          next: () => this.onSaveComplete(`${this.product?.productName} was deleted`),
          error: err => this.errorMessage = err
        });
      }
    }
  }

  isValid(path?: string): boolean {
    this.validate();
    if (path) {
      return this.dataIsValid[path];
    }
    return Object.keys(this.dataIsValid).every(path => this.dataIsValid[path]);
  }

  saveProduct(): void {
    if (this.product && this.isValid()) {
      if (this.product.id === 0) {
        this.productService.createProduct(this.product).subscribe({
          next: () => this.onSaveComplete(`The new ${this.product?.productName} was saved`),
          error: err => this.errorMessage = err
        });
      } else {
        this.productService.updateProduct(this.product).subscribe({
          next: () => this.onSaveComplete(`The updated ${this.product?.productName} was saved`),
          error: err => this.errorMessage = err
        });
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(message?: string): void {
    if (message) {
      this.messageService.addMessage(message);
    }
    this.resetProduct();
    this.router.navigateByUrl("/products");
  }

  validate(): void {
    this.dataIsValid = {};

    if (this.product?.productName && this.product.productName.length >= 3 &&
      this.product.productCode) {
      this.dataIsValid['info'] = true;
    } else {
      this.dataIsValid['info'] = false;
    }

    if (this.product?.category && this.product.category.length >= 3) {
      this.dataIsValid['tags'] = true;
    } else {
      this.dataIsValid['tags'] = false;
    }
  }

  resetProduct(): void {
    this.initialProduct = null;
    this.currentProduct = null;
  }
}
