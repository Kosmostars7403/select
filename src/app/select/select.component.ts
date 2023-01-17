import {animate, AnimationEvent, state, style, transition, trigger} from '@angular/animations';
import {SelectionModel} from '@angular/cdk/collections';
import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  HostListener,
  Input,
  Output,
  QueryList
} from '@angular/core';
import {merge, startWith, switchMap} from 'rxjs';
import {OptionComponent} from './option/option.component';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  animations: [
    trigger('dropDown', [
      state('void', style({transform: 'scaleY(0)', opacity: 0})),
      state('*', style({transform: 'scaleY(1)', opacity: 1})),
      transition(':enter', [animate('320ms cubic-bezier(0, 1, 0.45, 1.34)')]),
      transition(':leave', [animate('420ms cubic-bezier(0.88, -0.7, 0.86, 0.85)')])
    ])
  ]
})
export class SelectComponent implements AfterContentInit {

  @Input()
  label = ''

  @Input()
  set value(value: string | null) {
    this.selectModel.clear()

    if (value) {
      this.selectModel.select(value)
    }
  }

  get value() {
    return this.selectModel.selected[0] || null
  }

  private selectModel = new SelectionModel<string>()

  @Output()
  readonly opened = new EventEmitter()

  @Output()
  readonly closed = new EventEmitter()

  @HostListener('click')
  open() {
    this.isOpen = true
  }

  isOpen = false

  close() {
    this.isOpen = false
  }

  @ContentChildren(OptionComponent, {descendants: true})
  options!: QueryList<OptionComponent>

  ngAfterContentInit() {
    this.highlightSelectedOptions(this.value)

    this.selectModel.changed.subscribe(values => {
      values.removed.forEach(rv => this.findOptionsByValue(rv)?.deselect())
    })
    
    this.options.changes.pipe(
      startWith<QueryList<OptionComponent>>(this.options),
      switchMap(options => merge(...options.map(o => o.selected)))
    ).subscribe(selectedOptions => {
      selectedOptions.value && this.selectModel.select(selectedOptions.value)
    })
  }

  private highlightSelectedOptions(value: string | null) {
    this.findOptionsByValue(value)?.highLightAsSelected()
  }

  private findOptionsByValue(value: string | null) {
    return this.options && this.options.find(o => o.value === value)
  }

  onPanelAnimationDone({fromState, toState}: AnimationEvent) {
    if (fromState === 'void' && toState === null && this.isOpen) {
      this.opened.emit()
    }
    if (fromState === null && toState === 'void' && !this.isOpen) {
      this.closed.emit()
    }
  }


}
