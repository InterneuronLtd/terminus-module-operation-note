//BEGIN LICENSE BLOCK 
//Interneuron Terminus

//Copyright(C) 2025  Interneuron Limited

//This program is free software: you can redistribute it and/or modify
//it under the terms of the GNU General Public License as published by
//the Free Software Foundation, either version 3 of the License, or
//(at your option) any later version.

//This program is distributed in the hope that it will be useful,
//but WITHOUT ANY WARRANTY; without even the implied warranty of
//MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

//See the
//GNU General Public License for more details.

//You should have received a copy of the GNU General Public License
//along with this program.If not, see<http://www.gnu.org/licenses/>.
//END LICENSE BLOCK 
// Interneuron Terminus
// Copyright(C) 2023  Interneuron Holdings Ltd
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the
// GNU General Public License for more details.
// You should have received a copy of the GNU General Public License
// along with this program.If not, see<http://www.gnu.org/licenses/>.


import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { AppComponent } from './app.component';
import { OperationProcedureComponent } from './operation-procedure/operation-procedure.component';
import { OperationDiagnosisComponent } from './operation-diagnosis/operation-diagnosis.component';
import { ProcedureDetailComponent } from './procedure-detail/procedure-detail.component';
import { ProcedureImplantComponent } from './procedure-implant/procedure-implant.component';
import { ProcedureProviderComponent } from './procedure-provider/procedure-provider.component';
import { OperationDetailComponent } from './operation-detail/operation-detail.component';
import { PatientBannerComponent } from './patient-banner/patient-banner.component';
import { OperationProviderComponent } from './operation-provider/operation-provider.component';
import { TerminologyService } from './services/terminology.service';
import { OperationPreparationComponent } from './operation-preparation/operation-preparation.component';
import { OperationPostopInstructionComponent } from './operation-postop-instruction/operation-postop-instruction.component';
import { ProviderService } from './services/provider.service';
import { AutoGrowDirective } from './utilities/auto-grow.directive';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NumberOnlyDirective } from './utilities/number-only.directive';
import { NumberDecimalDirective } from './utilities/number-decimal.directive';
import { AutoCompleteValidationDirective } from "./utilities/auto-complete-validation";
import { NgxExtendedPdfViewerModule, pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { HendersonOutcomeComponent } from './henderson-outcome/henderson-outcome.component';
 
@NgModule({ declarations: [
        AppComponent,
        ProcedureProviderComponent,
        OperationProcedureComponent,
        OperationDiagnosisComponent,
        ProcedureImplantComponent,
        ProcedureDetailComponent,
        OperationDetailComponent,
        PatientBannerComponent,
        OperationProviderComponent,
        OperationPreparationComponent,
        AutoGrowDirective,
        OperationPostopInstructionComponent,
        NumberOnlyDirective,
        NumberDecimalDirective,
        AutoCompleteValidationDirective,
        HendersonOutcomeComponent
    ],
    //bootstrap: [AppComponent], //Development
    bootstrap: [], imports: [BrowserModule,
        FormsModule,
        BrowserAnimationsModule,
        MultiSelectModule,
        DropdownModule,
        AutoCompleteModule,
        ReactiveFormsModule,
        CalendarModule,
        RadioButtonModule,
        ConfirmDialogModule,
        FontAwesomeModule,
        ModalModule.forRoot(),
        NgxExtendedPdfViewerModule], providers: [
        ConfirmationService,
        TerminologyService,
        ProviderService,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule {
    constructor(private injector: Injector) {
        pdfDefaultOptions.assetsFolder = "assets/ngx-extended-pdf-viewer";
    }

    ngDoBootstrap() {
        const el = createCustomElement(AppComponent, { injector: this.injector });
        customElements.define('app-operation-note', el);  // "customelement-selector" is the dom selector that will be used in parent app to render this component

        //you could create more than one element here by repeating above lines for each component, make sure you use unique selectors.
    }
}
