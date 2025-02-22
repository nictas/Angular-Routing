import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { RouterModule } from '@angular/router';
import { MessageComponent } from './message.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: 'messages',
        component: MessageComponent,
        outlet: 'popup'
      }
    ])
  ],
  declarations: [
    MessageComponent
  ]
})
export class MessageModule { }
