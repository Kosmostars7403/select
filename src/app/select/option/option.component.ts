import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionComponent<T> {
  @Input()
  value: T | null = null

  @Input()
  disabledReason = ''

  @Input()
  @HostBinding('class.disabled')
  disabled = false

  @Output()
  selected = new EventEmitter()

  @HostListener('click')
  protected select() {
    this.highLightAsSelected()
    this.selected.emit(this)
  }

  @HostBinding('class.selected')
  protected isSelected = false

  constructor(private cdr: ChangeDetectorRef) {
  }

  highLightAsSelected() {
    this.isSelected = true
    this.cdr.markForCheck()
  }

  deselect() {
    this.isSelected = false
    this.cdr.markForCheck()
  }
}
