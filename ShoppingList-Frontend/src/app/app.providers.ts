import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatCardModule} from "@angular/material/card";
import {MatToolbarModule} from "@angular/material/toolbar";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {TranslateModule} from "@ngx-translate/core";
import {CommonModule} from "@angular/common";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatListItem, MatListModule} from "@angular/material/list";
import {MatDatepicker, MatDatepickerModule} from "@angular/material/datepicker";


export const materialTestImports = [MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  BrowserAnimationsModule,
  MatCardModule,
  MatToolbarModule,
  MatAutocompleteModule,
  MatSelectModule,
  MatCheckboxModule,
  MatListModule,
  MatDatepickerModule,
  MatTooltipModule]

export const commonTestImports = [FormsModule,
  CommonModule,
  ReactiveFormsModule,
  HttpClientTestingModule,
  RouterTestingModule,
  TranslateModule.forRoot()]
