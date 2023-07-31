//BEGIN LICENSE BLOCK 
//Interneuron Terminus

//Copyright(C) 2023  Interneuron Holdings Ltd

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
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { PatientBanner } from '../models/patient-banner.model'
import AppConfig from "src/assets/config/operation-note.config.json";
import { Subscription } from 'rxjs';
import { ApirequestService } from '../services/apirequest.service';
import { SubjectsService } from '../services/subjects.service';
import { AppService } from '../services/app.service';
import { CoreOperation } from '../models/entities/core-operation.model';

@Component({
    selector: 'app-patient-banner',
    templateUrl: './patient-banner.component.html',
    styleUrls: ['./patient-banner.component.css']
})
export class PatientBannerComponent implements OnInit, OnDestroy {

    patientBanner: PatientBanner = new PatientBanner();

    subscriptions: Subscription = new Subscription();

    isViewPDF: boolean = false;
    filename: string = "";

    operation: CoreOperation = new CoreOperation();

    constructor(private apiRequest: ApirequestService, private subjectsService: SubjectsService, private appService: AppService) {
        this.subjectsService.isViewPDF.subscribe((isViewPDF: boolean) => {
            this.isViewPDF = isViewPDF;
        });

        this.subscriptions.add(
            this.subjectsService.contextChange.subscribe(() => {
                this.loadPatientBannerData();
            })
        );

        this.subscriptions.add(
            this.subjectsService.operation.subscribe(
                (op: CoreOperation) => {
                    this.operation = op;
                }
            )
        );
    }

    ngOnInit() {

    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    loadPatientBannerData() {
        this.subscriptions.add(this.apiRequest.getRequest(
            AppConfig.uris.dynamicApiUri + AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "GetPatientBannerData").url + this.appService.personId)
            .subscribe((patientBannerData: string) => {
                this.patientBanner = <PatientBanner>JSON.parse(patientBannerData);
            }));
    }
}
