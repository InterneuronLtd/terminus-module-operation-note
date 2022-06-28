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
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CoreOperation } from '../models/entities/core-operation.model';
import { ApirequestService } from '../services/apirequest.service';
import { SubjectsService } from '../services/subjects.service';
import AppConfig from "src/assets/config/operation-note.config.json";
import { AppService } from '../services/app.service';

@Component({
    selector: 'app-operation-detail',
    templateUrl: './operation-detail.component.html',
    styleUrls: ['./operation-detail.component.css']
})
export class OperationDetailComponent implements OnInit, OnDestroy {

    subscriptions: Subscription = new Subscription();

    operation: CoreOperation = new CoreOperation();

    isViewPDF: boolean = false;
    isSubmitted: boolean = false;
    @Input() set isSubmit(isSubmitted:boolean) {
        this.isSubmitted = isSubmitted;
    }
    constructor(private apiRequest: ApirequestService,
        private subjectsService: SubjectsService,
        private appService: AppService
    ) {
        
        this.subscriptions.add(this.subjectsService.operation.subscribe(
            (op: CoreOperation) => {
                this.operation = op;
                this.initFileName(this.operation.isretrospectivedata);
            }
        ));

        this.subjectsService.isViewPDF.subscribe((isViewPDF: boolean) => {
            this.isViewPDF = isViewPDF;
        });
    }

    ngOnInit() {

    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    initFileName(isRetrospectiveData: boolean) {
        if (isRetrospectiveData) {
            this.operation.latestoperationnotehistory.filename = this.operation.latestoperationnotehistory.filename.replace("Note", "Data");
        }
        else {
            this.operation.latestoperationnotehistory.filename = this.operation.latestoperationnotehistory.filename.replace("Data", "Note");
        }
    }

    onRetrospectiveDataChange(event) {
        if (this.operation.latestoperationnotehistory.filename) {
            this.initFileName(event.target.checked);
        }
    }

    onOperationQualifierChange(selectedText) {
        this.operation.operationqualifiertext = selectedText;
    }
}
