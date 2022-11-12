import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import UnitService from "../../../services/unitService";
import CommonProductsService from "../../../services/commonProductsService";
import {ItemService} from "../../../services/item.service";
import Swal from "sweetalert2";


@Component({
  selector: 'app-add-list-item',
  templateUrl: './add-list-item.component.html',
  styleUrls: ['./add-list-item.component.css']
})
export class AddListItemComponent implements OnInit {

  @Input()
  listId!: number;

  @Output()
  refreshItems: EventEmitter<any> = new EventEmitter();

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
      text: ['', Validators.required],
      quantity: [''],
      unit: [''],
      image: ['']
    });

    this.setDefaultValues()
    this.filteredOptions = this.form.get('text')!.valueChanges.pipe(
      startWith(this.form.get('text')!.value), map(value => this._filter(value || '')),
    );
  }

  addItem() {
    this.itemService.create({
      'text': this.form.get('text')?.value,
      'quantity': +this.form.get('quantity')?.value,
      'unit': this.form.get('unit')?.value,
      'listId': +this.listId,
      'done': false
    }, this.selectedFile).subscribe({
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
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.commonProducts.filter(
      option => (this.translate.instant("commonProducts." + option)).toLowerCase().includes(filterValue));
  }

  onSelectionChanged($event: any) {
    const translatedValue = this.translate.instant("commonProducts." + $event.option.value);
    this.form.get('text')?.setValue(translatedValue)
  }

  selectFiles(event: any): void {
    this.selectedFile = event.target.files[0]
    this.form.get('image')?.setValue(this.selectedFile?.name)

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0])

    reader.onload = (e: any) => {
      this.photoPreview = e.target.result
    }
  }

  clearForm(formDirective: FormGroupDirective): void {
    this.form.reset();
    formDirective.resetForm();
    this.setDefaultValues()
    this.deletePicture()
  }

  setDefaultValues(): void{
    this.form.get('quantity')!.setValue('1')
    this.form.get('unit')!.setValue(UnitService.getDefaultUnit())
  }

  deletePicture(): void{
    this.selectedFile = undefined
    this.photoPreview =  undefined
    this.form.get('image')?.reset()
  }
}
