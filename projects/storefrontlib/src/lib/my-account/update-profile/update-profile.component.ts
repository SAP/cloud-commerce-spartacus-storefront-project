import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  GlobalMessageService,
  GlobalMessageType,
  RoutingService,
  Title,
  User,
  UserService,
} from '@spartacus/core';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'cx-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss'],
})
export class UpdateProfileComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  titles$: Observable<Title[]>;
  user$: Observable<User>;
  loading$: Observable<boolean>;

  constructor(
    private routingService: RoutingService,
    private userService: UserService,
    private globalMessageService: GlobalMessageService
  ) {}

  ngOnInit(): void {
    // reset the previous form processing state
    this.userService.resetUpdatePersonalDetailsProcessingState();

    this.user$ = this.userService.get();
    this.titles$ = this.userService.getTitles().pipe(
      tap(titles => {
        if (Object.keys(titles).length === 0) {
          this.userService.loadTitles();
        }
      })
    );
    this.loading$ = this.userService.getUpdatePersonalDetailsResultLoading();

    this.subscription.add(
      this.userService
        .getUpdatePersonalDetailsResultSuccess()
        .subscribe(success => this.onSuccess(success))
    );
  }

  onSuccess(success: boolean): void {
    if (success) {
      this.globalMessageService.add(
        'Personal details successfully updated',
        GlobalMessageType.MSG_TYPE_CONFIRMATION
      );
      this.routingService.go({ route: 'home' });
    }
  }

  onCancel(): void {
    this.routingService.go({ route: 'home' });
  }

  onSubmit({ uid, userUpdates }: { uid: string; userUpdates: User }): void {
    this.userService.updatePersonalDetails(uid, userUpdates);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    // clean up the state
    this.userService.resetUpdatePersonalDetailsProcessingState();
  }
}
