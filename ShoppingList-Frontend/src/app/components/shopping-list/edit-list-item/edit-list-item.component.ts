import {Component, Input, OnInit} from '@angular/core';
import {Item} from "../../../models/item";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
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

  unitTypes: string[] = [];
  commonProducts: string[];
  filteredOptions: Observable<string[]> | undefined;

  selectedFile?: File
  photoPreview?: string

  form!: FormGroup

  constructor(private translate: TranslateService, private formBuilder: FormBuilder,
              private itemService: ItemService) {
    this.unitTypes = UnitService.getUnits()
    this.commonProducts = CommonProductsService.getCommonProducts()
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      text: [this.item.text, Validators.required],
      quantity: [this.item.quantity],
      unit: [this.item.unit],
      image: [this.item.photo?.name]
    });

    this.filteredOptions = this.form.get('text')!.valueChanges.pipe(
      startWith(this.form.get('text')!.value), map(value => this._filter(value || '')),
    );
    this.loadPhoto()
  }

  editItem() {
    this.item.text = this.form.get('text')?.value
    this.item.quantity = +this.form.get('quantity')?.value
    this.item.unit = this.form.get('unit')?.value
    this.item.photo = this.selectedFile


    this.itemService.update(this.item).subscribe({
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
    this.form.get('text')?.setValue(translatedValue)
  }

  selectFile(event: any): void {
    this.selectedFile = event.target.files[0]
    this.form.get('image')?.setValue(this.selectedFile!.name)

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0])

    reader.onload = (e: any) => {
      this.photoPreview = e.target.result
    }
  }

  deletePicture(): void {
    this.selectedFile = undefined
    this.photoPreview =  undefined
  }
}
