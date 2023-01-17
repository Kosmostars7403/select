import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {User} from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'select';

  selectValue = new User(1, 'Albert Einstein', 'albert', 'Germany/USA')
  users: User[] = [new User(1, 'Albert Einstein', 'albert', 'Germany/USA'),]

  constructor(private cdr: ChangeDetectorRef) {
  }
  ngOnInit() {
    setTimeout(() => {
      this.users = [
        new User(1, 'Albert Einstein', 'albert', 'Germany/USA'),
        new User(2, 'Niels Bohr', 'niels', 'Denmark'),
        new User(3, 'Marie Curie', 'marie', 'Poland/French'),
        new User(4, 'Isaac Newton', 'isaac', 'United Kingdom'),
        new User(5, 'Stephen Hawking', 'stephen', 'United Kingdom', true),
        new User(6, 'Max Planck', 'max', 'Germany'),
        new User(7, 'James Clerk Maxwell', 'james', 'United Kingdom'),
        new User(8, 'Michael Faraday', 'michael', 'United Kingdom'),
        new User(9, 'Richard Feynman', 'richard', 'USA'),
        new User(10, 'Ernest Rutherford', 'ernest', 'New Zealand'),
      ];
      this.selectValue = new User(10, 'Ernest Rutherford', 'ernest', 'New Zealand')
      this.cdr.markForCheck()
    }, 3000)
  }

  displayWithFn(user: User) {
    return user.name
  }

  compareWithFn(user1: User | null, user2: User | null): boolean {
    return user1?.nickname.toLowerCase() === user2?.nickname.toLowerCase()
  }
}
