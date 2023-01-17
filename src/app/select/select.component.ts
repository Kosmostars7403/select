import {animate, AnimationEvent, state, style, transition, trigger} from '@angular/animations';
import {SelectionModel} from '@angular/cdk/collections';
import {
  AfterContentInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  HostListener,
  Input, OnChanges,
  OnDestroy,
  Output,
  QueryList, SimpleChanges
} from '@angular/core';
import {merge, startWith, Subject, switchMap, takeUntil, tap} from 'rxjs';
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent<T> implements OnChanges, AfterContentInit, OnDestroy {

  @Input()
  label = ''

  @Input()
  displayWith: ((value: T) => string | number) | null = null

  @Input()
  compareWith: ((v1: T | null, v2: T | null) => boolean) = (v1, v2) => v1 === v2

  @Input()
  set value(value: T | null) {
    this.selectModel.clear()

    if (value) {
      this.selectModel.select(value)
    }
  }

  get value() {
    return this.selectModel.selected[0] || null
  }

  private selectModel = new SelectionModel<T>()

  @Output()
  readonly opened = new EventEmitter()

  @Output()
  readonly selectionChanged = new EventEmitter()

  @Output()
  readonly closed = new EventEmitter()

  @HostListener('click')
  open() {
    this.isOpen = true
  }

  isOpen = false

  private optionMap = new Map<T | null, OptionComponent<T>>();

  unsubscribe$ = new Subject<void>()

  protected get displayValue() {
    if (this.displayWith && this.value) {
      return this.displayWith(this.value)
    }
    return this.value
  }

  close() {
    this.isOpen = false
  }

  @ContentChildren(OptionComponent, {descendants: true})
  options!: QueryList<OptionComponent<T>>

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['compareWith']) {
      this.selectModel.compareWith = changes['compareWith'].currentValue
      this.highlightSelectedOptions()
    }
  }

  ngAfterContentInit() {
    this.selectModel.changed.pipe(takeUntil(this.unsubscribe$)).subscribe(values => {
      values.removed.forEach(rv => this.optionMap.get(rv)?.deselect())
      values.added.forEach(av => this.optionMap.get(av)?.highLightAsSelected())
    })

    this.options.changes.pipe(
      startWith<QueryList<OptionComponent<T>>>(this.options),
      tap(() => this.refreshOptionsMap()),
      tap(() => queueMicrotask(() => this.highlightSelectedOptions())),
      switchMap(options => merge(...options.map(o => o.selected))),
      takeUntil(this.unsubscribe$)
    ).subscribe(selectedOptions => this.handleSelection(selectedOptions))
  }

  private handleSelection(options: OptionComponent<T>) {
    if (options.value) {
      options.value && this.selectModel.toggle(options.value)
      this.selectionChanged.emit(this.value)
    }

    this.close()
    this.cdr.markForCheck()
  }

  private refreshOptionsMap() {
    this.optionMap.clear();
    this.options.forEach(o => this.optionMap.set(o.value, o));
  }

  private highlightSelectedOptions() {
    const valuesWithUpdatedReferences = this.selectModel.selected.map(value => {
      const correspondingOption = this.findOptionsByValue(value);
      return correspondingOption ? correspondingOption.value! : value;
    });
    this.selectModel.clear();
    this.selectModel.select(...valuesWithUpdatedReferences);
  }

  private findOptionsByValue(value: T | null) {
    return this.options && this.options.find(o => this.compareWith(o.value, value))
  }

  onPanelAnimationDone({fromState, toState}: AnimationEvent) {
    if (fromState === 'void' && toState === null && this.isOpen) {
      this.opened.emit()
    }
    if (fromState === null && toState === 'void' && !this.isOpen) {
      this.closed.emit()
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
