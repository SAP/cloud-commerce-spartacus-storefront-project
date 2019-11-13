import { Component, HostBinding, OnInit } from '@angular/core';
import {
  AsmService,
  AuthService,
  GlobalMessageService,
  GlobalMessageType,
  RoutingService,
  User,
  UserService,
  UserToken,
} from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AsmEnablerService } from '../asm-enabler.service';
import { AsmComponentService } from '../services/asm-component.service';

@Component({
  selector: 'cx-asm-main-ui',
  templateUrl: './asm-main-ui.component.html',
  styleUrls: ['./asm-main-ui.component.scss'],
})
export class AsmMainUiComponent implements OnInit {
  csAgentToken$: Observable<UserToken>;
  csAgentTokenLoading$: Observable<boolean>;
  customer$: Observable<User>;

  @HostBinding('class.hidden') disabled = false;

  private startingCustomerSession = false;

  constructor(
    protected authService: AuthService,
    protected userService: UserService,
    protected asmService: AsmService,
    protected asmComponentService: AsmComponentService,
    protected globalMessageService: GlobalMessageService,
    protected routingService: RoutingService,
    protected asmEnablerService: AsmEnablerService
  ) {}

  ngOnInit(): void {
    this.csAgentToken$ = this.authService.getCustomerSupportAgentToken();
    this.csAgentTokenLoading$ = this.authService.getCustomerSupportAgentTokenLoading();
    this.customer$ = this.authService.getUserToken().pipe(
      switchMap(token => {
        if (token && !!token.access_token) {
          this.handleCustomerSessionStartRedirection(token);
          return this.userService.get();
        } else {
          return of(undefined);
        }
      })
    );
  }

  private handleCustomerSessionStartRedirection(token: UserToken): void {
    if (
      this.startingCustomerSession &&
      this.authService.isCustomerEmulationToken(token)
    ) {
      this.startingCustomerSession = false;
      this.globalMessageService.remove(GlobalMessageType.MSG_TYPE_ERROR);
      this.routingService.go('/');
    }
  }

  loginCustomerSupportAgent({
    userId,
    password,
  }: {
    userId: string;
    password: string;
  }): void {
    this.authService.authorizeCustomerSupporAgent(userId, password);
  }

  logout(): void {
    this.asmComponentService.logoutCustomerSupportAgentAndCustomer();
  }

  startCustomerEmulationSession({ customerId }: { customerId: string }): void {
    this.authService
      .getCustomerSupportAgentToken()
      .pipe(take(1))
      .subscribe(customerSupportAgentToken =>
        this.authService.startCustomerEmulationSession(
          customerSupportAgentToken,
          customerId
        )
      )
      .unsubscribe();
    this.startingCustomerSession = true;
  }

  hideUi(): void {
    this.disabled = true;
    this.asmEnablerService.unload();
  }
}
