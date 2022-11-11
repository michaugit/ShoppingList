import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Item} from "../../../models/item";
import {FormControl} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import UnitService from "../../../services/unitService";
import CommonProductsService from "../../../services/commonProductsService";
import {UserListsService} from "../../../services/user-lists.service";
import {ItemService} from "../../../services/item.service";
import Swal from "sweetalert2";


@Component({
  selector: 'app-add-list-item',
  templateUrl: './add-list-item.component.html',
  styleUrls: ['./add-list-item.component.css']
})
export class AddListItemComponent implements OnInit {

  @Input()
  listId?: number;

  @Output()
  refreshItems: EventEmitter<any> = new EventEmitter();

  isValid = true;
  selectedUnit: string
  unitTypes: string[] = [];

  selectedFile?: File
  selectedFileName: string = ''
  preview: string = ''

  productName: FormControl
  commonProducts: string[];
  filteredOptions: Observable<string[]> | undefined;

  constructor(private translate: TranslateService, private itemService: ItemService) {
    this.productName = new FormControl('');
    this.unitTypes = UnitService.getUnits()
    this.selectedUnit = UnitService.getDefaultUnit()
    this.commonProducts = CommonProductsService.getCommonProducts()
  }

  ngOnInit(): void {
    this.filteredOptions = this.productName.valueChanges.pipe(
      startWith(this.productName.value), map(value => this._filter(value || '')),
    );
  }

  addItem(text: string, quantity: number, unit: string) {
    if (text === "") return;

    this.itemService.create({'text': text, 'quantity': quantity, 'unit': unit, 'listId': this.listId!}).subscribe({
      next: () => {
        this.refreshItems.emit()
      },
      error: err => {
        Swal.fire({
          title: this.translate.instant('common.fail'),
          text: err.error.message,
          icon: 'error',
          showConfirmButton: false
        })
      }
    })

    this.filteredOptions = this.productName.valueChanges.pipe(
      startWith(''), map(value => this._filter(value || '')),
    );
    this.selectedUnit = UnitService.getDefaultUnit()
    this.deletePicture()
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.commonProducts.filter(
      option => (this.translate.instant("commonProducts." + option)).toLowerCase().includes(filterValue));
  }

  onSelectionChanged($event: any) {
    const translatedValue = this.translate.instant("commonProducts." + $event.option.value);
    this.productName.setValue(translatedValue)
  }

  selectFiles(event: any): void {
    this.selectedFile = event.target.files[0]
    this.selectedFileName = event.target.files[0].name

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0])

    reader.onload = (e: any) => {
      this.preview = e.target.result
    }
  }

  deletePicture(): void {
    this.selectedFile = undefined
    this.selectedFileName = ''
    this.preview = ''
  }

  cancel(): void {
    this.selectedUnit = UnitService.getDefaultUnit()
    this.productName.setValue('')
    this.filteredOptions = this.productName.valueChanges.pipe(
      startWith(this.productName.value), map(value => this._filter(value || '')),
    );
    this.deletePicture()
  }

}
