import { HelloWorldComponent } from './hello-world/hello-world.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { routing } from './unit-test-routing.module';
import { UserService } from './user.service';
import { ExclamationPipe } from './exclamation.pipe';


@NgModule({
    declarations: [ HelloWorldComponent, ExclamationPipe ],
    imports: [CommonModule, routing],
    providers: [ UserService ],
})
export class UnitTestModule { }
