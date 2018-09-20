import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription, of } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';
import * as fromStore from '../../../store';
import * as fromAuthStore from './../../../../auth/store';
import * as fromRouting from '../../../../routing/store';

@Component({
  selector: 'y-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit, OnDestroy {
  sub: Subscription;
  form: FormGroup;

  constructor(
    private store: Store<fromStore.UserState>,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.sub = this.store
      .select(fromAuthStore.getUserToken)
      .pipe(
        switchMap(data => {
          if (data && data.access_token) {
            return this.store.select(fromRouting.getRedirectUrl).pipe(take(1));
          }
          return of();
        })
      )
      .subscribe(url => {
        if (url) {
          // If forced to login due to AuthGuard, then redirect to intended destination
          this.store.dispatch(new fromRouting.Go({ path: [url] }));
          this.store.dispatch(new fromRouting.ClearRedirectUrl());
        } else {
          // User manual login
          this.store.dispatch(new fromRouting.Back());
        }
      });

    this.form = this.fb.group({
      userId: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // tslint:disable-line
          )
        ]
      ],
      password: ['', Validators.required]
    });
  }

  login() {
    this.store.dispatch(
      new fromAuthStore.LoadUserToken({
        userId: this.form.controls.userId.value,
        password: this.form.controls.password.value
      })
    );
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
