import { NgModule } from '@angular/core';
import { ResultViewComponent } from './result-view/result-view.component'
import { TutorialComponent} from './tutorial/tutorial.component'
import { ErrorViewComponent } from './error-view/error-view.component'
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'main', component: ResultViewComponent },
  { path: 'help', component: TutorialComponent },
  { path: '',   redirectTo: '/main', pathMatch: 'full' },
  { path: '**', component: ErrorViewComponent }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
