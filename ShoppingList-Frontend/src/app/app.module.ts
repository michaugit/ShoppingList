import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';

import {ReactiveFormsModule} from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from "@angular/material/menu";
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatCardModule} from "@angular/material/card";
import {MatSelectModule} from "@angular/material/select";
import {MatStepperModule} from "@angular/material/stepper";
import {DateAdapter, MAT_DATE_LOCALE, MatRippleModule} from "@angular/material/core";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatTabsModule} from "@angular/material/tabs";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatChipsModule} from "@angular/material/chips";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatDialogModule} from "@angular/material/dialog";
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//tlumaczenie
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from "@angular/material/datepicker";
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { CUSTOM_DATE_FORMATS } from './models/custom-date-formats';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import { RegisterComponent } from './components/register/register.component';
import { ShoppingListComponent } from './components/shopping-list/shopping-list.component';
import { ListItemComponent } from './components/shopping-list/list-item/list-item.component';
import { AddListItemComponent } from './components/shopping-list/add-list-item/add-list-item.component';
import { EditListItemComponent } from './components/shopping-list/edit-list-item/edit-list-item.component';
import { UserListsComponent } from './components/user-lists/user-lists.component';
import { AddUserListComponent } from './components/user-lists/add-user-list/add-user-list.component';
import { EditUserListComponent } from './components/user-lists/edit-user-list/edit-user-list.component';
import { UserListComponent } from './components/user-lists/user-list/user-list.component';
import { MainNavigationComponent } from './components/main-navigation/main-navigation.component';

import { httpInterceptorProviders } from './helpers/http.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ShoppingListComponent,
    ListItemComponent,
    AddListItemComponent,
    EditListItemComponent,
    UserListsComponent,
    AddUserListComponent,
    EditUserListComponent,
    UserListComponent,
    MainNavigationComponent
  ],
  imports: [
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatStepperModule,
    MatRippleModule,
    MatDialogModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatTabsModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    FormsModule,
    MatNativeDateModule
  ],
  providers: [
    httpInterceptorProviders,
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
