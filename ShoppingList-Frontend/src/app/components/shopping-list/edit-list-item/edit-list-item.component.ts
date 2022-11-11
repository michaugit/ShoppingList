import {Component, Input, OnInit} from '@angular/core';
import {Item} from "../../../models/item";
import {FormControl} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import UnitService from "../../../services/unitService";
import CommonProductsService from "../../../services/commonProductsService";
import {ItemService} from "../../../services/item.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-edit-list-item',
  templateUrl: './edit-list-item.component.html',
  styleUrls: ['./edit-list-item.component.css']
})
export class EditListItemComponent implements OnInit {

  @Input()
  item!: Item;

  @Input()
  index!: number;

  isValid = true;
  unitTypes: string[] = [];

  selectedFile?: File
  selectedFileName: string = ''
  photoPreview?: string

  productName: FormControl;
  commonProducts: string[];
  filteredOptions: Observable<string[]> | undefined;

  constructor(private translate: TranslateService, private itemService: ItemService) {
    this.productName = new FormControl('')
    this.unitTypes = UnitService.getUnits()
    this.commonProducts = CommonProductsService.getCommonProducts()
  }

  ngOnInit(): void {
    this.productName.setValue(this.item.text)
    this.filteredOptions = this.productName.valueChanges.pipe(
      startWith(this.productName.value), map(value => this._filter(value || '')),
    );

    this.loadPhoto()
  }

  editItem(item: Item, text: string, num: string, unit: string) {
    item.text = text
    item.quantity = +num
    item.unit = unit
    item.isBeingEditing = false
    item.photo = this.selectedFile


    this.itemService.update(item).subscribe({
      next: () => {
        this.item.isBeingEditing = false
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
  }

  loadPhoto() {
    if (this.item.photo !== undefined) {
      this.selectedFile = this.item.photo
      this.selectedFileName = this.item.photo.name!

      const reader = new FileReader();
      reader.readAsDataURL(this.item.photo)
      reader.onload = (e: any) => {
        this.photoPreview = e.target.result
      }
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.commonProducts.filter(
      option => (this.translate.instant("commonProducts." + option)).toLowerCase().includes(filterValue))
  }

  onSelectionChanged($event: any) {
    const translatedValue = this.translate.instant("commonProducts." + $event.option.value);
    this.productName.setValue(translatedValue)
  }

  selectFile(event: any): void {
    this.selectedFile = event.target.files[0]
    this.selectedFileName = event.target.files[0].name

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0])

    reader.onload = (e: any) => {
      this.photoPreview = e.target.result
    }
  }

  deletePicture(): void {
    this.selectedFile = undefined
    this.selectedFileName = ''
    this.photoPreview =  undefined
  }
}
