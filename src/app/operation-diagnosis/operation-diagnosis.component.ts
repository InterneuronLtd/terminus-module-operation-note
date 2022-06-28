//BEGIN LICENSE BLOCK 
//Interneuron Terminus

//Copyright(C) 2022  Interneuron CIC

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
import { Component, OnInit, ViewChild } from '@angular/core';
import { AutoComplete } from 'primeng/autocomplete';
import { Subscription } from 'rxjs';
import { SubjectsService } from '../services/subjects.service';
import { CoreDiagnosis } from '../models/entities/core-diagnosis.model';
import { CoreOperation } from '../models/entities/core-operation.model';
import { ApirequestService } from '../services/apirequest.service';
import { SNOMED } from '../models/snomed.model';
import { ConfirmationService } from 'primeng/api';
import { AppService } from '../services/app.service';
import { TerminologyConcept } from '../models/terminology-concept.model';
import AppConfig from "src/assets/config/operation-note.config.json"
 
@Component({
    selector: 'app-operation-diagnosis',
    templateUrl: './operation-diagnosis.component.html',
    styleUrls: ['./operation-diagnosis.component.css']
})
export class OperationDiagnosisComponent implements OnInit {

    @ViewChild('autocomplete') ac: AutoComplete;

    operationId: string;

    operation: CoreOperation = new CoreOperation();
    ASAGradedata = AppConfig.ASAGradedata;

    operationDiagnosis: CoreDiagnosis[] = [];

    opDiagnoses: SNOMED[] = [];

    results: SNOMED[] = [];

    otherConcept: TerminologyConcept = {
        concept_id: 9177,
        conceptcode: "74964007",
        conceptname: "Other"
    }
    
     
    isViewPDF: boolean = false;

    subscriptions: Subscription = new Subscription();

    constructor(private subjectsService: SubjectsService, private apiRequest: ApirequestService,
        private confirmationService: ConfirmationService, private appService: AppService) {

        this.subscriptions.add(
            this.subjectsService.operation.subscribe(
                (op: CoreOperation) => {
                    this.operationId = op.operation_id;

                    this.operation = op;

                    this.operationDiagnosis = op.diagnoses == null ? [] : op.diagnoses;

                    this.opDiagnoses = [];

                    for (var i = 0; i < this.operationDiagnosis.length; i++) {
                        let diagnosis: SNOMED = new SNOMED();
                        diagnosis.code = this.operationDiagnosis[i].diagnosiscode;
                        diagnosis.term = this.operationDiagnosis[i].diagnosistext;

                        this.opDiagnoses.push(diagnosis);
                    }
                }
            )
        );

        this.subscriptions.add(
            this.subjectsService.isViewPDF.subscribe((isViewPDF: boolean) => {
                this.isViewPDF = isViewPDF;
            })
        );
    }

    ngOnInit() {

    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
     
    onASAChange() {

        this.operation.asagradecode = AppConfig.ASAGradedata.find((x: { Name: string }) => x.Name == this.operation.asagradetext).Id;

    }
    search(event) {
        this.subscriptions.add(
            this.apiRequest.getRequest(this.appService.terminologyBaseURI.replace("VALUE", event.query + "/disorder?api-version=1.0"))
                .subscribe((response) => {
                    let resultsFromDb: SNOMED[] = [];
                    response.data.forEach((item) => {
                        let snomedData: SNOMED = new SNOMED();
                        snomedData.code = item.code;
                        snomedData.fsn = item.fsn;
                        snomedData.level = item.level;
                        snomedData.parentCode = item.parentCode;
                        snomedData.term = item.term;
                        resultsFromDb.push(snomedData);
                    })
                    if (resultsFromDb.length == 0) {
                        let concept: SNOMED = new SNOMED();
                        concept.code = this.otherConcept.conceptcode;
                        concept.term = event.query + ' (Other)';

                        resultsFromDb.push(concept);
                    }
                    this.results = resultsFromDb;
                })
        );
    }

    selectedValue(diag: SNOMED) {
        let addedProcs = [];

        if (diag.code == this.otherConcept.conceptcode) {
            addedProcs = this.operationDiagnosis.filter(x =>
                (x.diagnosistext.toLowerCase().replace(/ /g, '') == diag.term.toLowerCase().replace(/ /g, '')));
        }
        else {
            addedProcs = this.operationDiagnosis.filter(x => x.diagnosiscode == diag.code);
        }

        if (addedProcs.length == 0) {
            let diagnosis: CoreDiagnosis = new CoreDiagnosis();
            diagnosis.diagnosis_id = diag.code + '|' + this.operationId,
                diagnosis.operation_id = this.operationId,
                diagnosis.statuscode = 'Active',
                diagnosis.statustext = 'Active',
                diagnosis.diagnosiscode = diag.code,
                diagnosis.diagnosistext = diag.term

            this.operationDiagnosis.push(diagnosis);
        }
    }

    unSelectedValue(event) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this diagnosis?',
            accept: () => {
                for (var i = 0; i < this.operationDiagnosis.length; i++) {
                    if (this.operationDiagnosis[i].diagnosistext === event.term) {
                        this.operationDiagnosis.splice(i, 1);
                        i--;
                    }
                }
            },
            reject: () => {
                this.ac.selectItem(event);
            }
        });
    }



}
