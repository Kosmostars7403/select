import {Component, EventEmitter, HostBinding, HostListener, Input, Output} from '@angular/core';

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss']
})
export class OptionComponent {
  @Input()
  value: string | null = null

  @Output()
  selected = new EventEmitter()

  @HostListener('click')
  select() {
    this.isSelected = true
    this.selected.emit(this)
  }

  @HostBinding('class.selected')
  protected isSelected = false

  deselect() {
    this.isSelected = false
  }
}
