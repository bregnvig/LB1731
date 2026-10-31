import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'loop-json',
  template: `
    <article class="row g-4 align-items-start">
      <div class="col-lg-6">
        <form class="card card-body">
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">Email address</label>
            <input type="email" name="email" [(ngModel)]="login.email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
            <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Password</label>
            <input type="password" name="password" autocomplete [(ngModel)]="login.password" class="form-control" id="exampleInputPassword1">
          </div>
          <div class="mb-3 form-check">
            <input type="checkbox" name="rememberMe" [(ngModel)]="login.rememberMe" class="form-check-input" id="exampleCheck1">
            <label class="form-check-label" for="exampleCheck1">Remember me</label>
          </div>
          <div>
            <button type="submit" class="btn btn-primary">Submit</button>
          </div>
        </form>
      </div>
      <div class="col-lg-6">
        <figure class="json-panel">
          <figcaption ngNonBindable>&#123;&#123; login | json &#125;&#125;</figcaption>
          <code>
    <pre class="text-white fw-bolder mb-0">{{login | json}}</pre>
          </code>
        </figure>
      </div>
    </article>
  `,
  styles: `
    .json-panel { margin: 0; border-radius: 1rem; background: #0b1220; overflow: hidden; }
    figcaption { padding: .625rem 1.375rem; border-bottom: 1px solid rgba(255, 255, 255, .1);
      font: 500 .8125rem var(--bs-font-monospace); color: #38e1ff; }
    pre { min-height: 12rem; font-size: 1rem; }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class JsonComponent {

  login: any = {};
}
