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
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AutoComplete } from 'primeng/autocomplete';
import { SubjectsService } from '../services/subjects.service';
import { CoreProcedure } from '../models/entities/core-procedure.model';
import { CoreOperation } from '../models/entities/core-operation.model';
import { SNOMED } from '../models/snomed.model';
import { ApirequestService } from '../services/apirequest.service';
import { AppService } from '../services/app.service';
import { TerminologyConcept } from '../models/terminology-concept.model';

@Component({
    selector: 'app-operation-procedure',
    templateUrl: './operation-procedure.component.html',
    styleUrls: ['./operation-procedure.component.css']
})
export class OperationProcedureComponent implements OnInit {

    operationId: string;

    @ViewChild('autocomplete') ac: AutoComplete;

    operationProcedures: CoreProcedure[] = [];

    opProcedures: SNOMED[] = [];

    results: SNOMED[] = [];

    otherConcept: TerminologyConcept = {
        concept_id: 9177,
        conceptcode: "74964007",
        conceptname: "Other"
    }

    isViewPDF: boolean = false;

    subscriptions: Subscription = new Subscription();

    constructor(private subjectsService: SubjectsService,
        private confirmationService: ConfirmationService,
        private apiRequest: ApirequestService,
        private appService: AppService) {

        this.subscriptions.add(
            this.subjectsService.operation.subscribe(
                (op: CoreOperation) => {

                    this.operationId = op.operation_id;

                    this.operationProcedures = op.procedures == null ? [] : op.procedures;

                    this.opProcedures = [];

                    for(var i = 0; i < this.operationProcedures.length; i++)
                    {
                        let procedure: SNOMED = new SNOMED();
                        procedure.code = this.operationProcedures[i].code;
                        procedure.term = this.operationProcedures[i].name;

                        this.opProcedures.push(procedure); 
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

    search(event) {
        this.subscriptions.add(
            this.apiRequest.getRequest(this.appService.terminologyBaseURI.replace("VALUE", event.query + "/procedure?api-version=1.0"))
            .subscribe((response) => {
                let resultsFromDb:SNOMED[] = [];
                response.data.forEach((item)=>{
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

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    selectedValue(event) {
        let addedProcs = [];

        if (event.code == this.otherConcept.conceptcode) {
            addedProcs = this.operationProcedures.filter(x =>
                (x.name.toLowerCase().replace(/ /g, '') == event.term.toLowerCase().replace(/ /g, '')));
        }
        else {
            addedProcs = this.operationProcedures.filter(x => x.code == event.code);
        }
        
        if (addedProcs.length == 0) {
            let procedure: CoreProcedure = new CoreProcedure();

            procedure.procedure_id = event.code + '|' + this.operationId;
            procedure.operation_id = this.operationId;
            procedure.code = event.code;
            procedure.name = event.term;

            this.operationProcedures.push(procedure);            
        }
    }

    unSelectedValue(proc) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete the procedure?',
            accept: () => {
                for (var i = 0; i < this.operationProcedures.length; i++) {
                    if (this.operationProcedures[i].name === proc.term) {
                        this.operationProcedures.splice(i, 1);
                        i--;
                    }
                }
            },
            reject: () => {
                this.ac.selectItem(proc);
            }
        });
    }
}