import {Component, HostListener, Input} from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent {

  @Input()
  label = ''

  @Input()
  value: string | null = ''

  @HostListener('click')
  open() {
    this.isOpen = true
  }

  isOpen = false

  close() {
    this.isOpen = false
  }

}
