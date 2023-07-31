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
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CoreOperation } from '../models/entities/core-operation.model';
import { OperationNoteHendersonOutcome } from '../models/entities/core-operationnote-henderson-outcome.model';
import { SubjectsService } from '../services/subjects.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-henderson-outcome',
  templateUrl: './henderson-outcome.component.html',
  styleUrls: ['./henderson-outcome.component.css']
})
export class HendersonOutcomeComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();
  
  hendersonOutcome: OperationNoteHendersonOutcome = new OperationNoteHendersonOutcome();

  constructor(private subjectsService: SubjectsService) {
    this.subscriptions.add(this.subjectsService.operation.subscribe(
      (op: CoreOperation) => {
          op.hendersonoutcome = op.hendersonoutcome == null ? new OperationNoteHendersonOutcome() : op.hendersonoutcome;
          
          if (!op.hendersonoutcome.operationnotehendersonoutcome_id) {
            op.hendersonoutcome = new OperationNoteHendersonOutcome();
            op.hendersonoutcome.operation_id = op.operation_id;
            op.hendersonoutcome.operationnotehendersonoutcome_id = uuidv4();
            op.hendersonoutcome.issofttissuefailure = 0;
            op.hendersonoutcome.isasepticloosening = 0;
            op.hendersonoutcome.isstructurefailure = 0;
            op.hendersonoutcome.isinfection = 0;
            op.hendersonoutcome.istumorprogression = 0;
            op.hendersonoutcome.isimplantrelated = 0;
            op.hendersonoutcome.isnonimplantrelated = 0;
          }

          this.hendersonOutcome = op.hendersonoutcome;
      }
    ));
  }

  ngOnInit() {
  }

  onOutcomeOptionChange(selectedOutcome, event) {
    this.hendersonOutcome.issofttissuefailure = 0;
    this.hendersonOutcome.isasepticloosening = 0;
    this.hendersonOutcome.isstructurefailure = 0;
    this.hendersonOutcome.isinfection = 0;
    this.hendersonOutcome.istumorprogression = 0;
    this.hendersonOutcome.isimplantrelated = 0;
    this.hendersonOutcome.isnonimplantrelated = 0;

    if (selectedOutcome == "SOFT_TISSUE_FAILURE") {
      this.hendersonOutcome.issofttissuefailure = event.target.checked ? 1 : 0;
    }
    else if (selectedOutcome == "ASEPTIC_LOOSENING") {
      this.hendersonOutcome.isasepticloosening = event.target.checked ? 1 : 0;
    }
    else if (selectedOutcome == "STRUCTURE_FAILURE") {
      this.hendersonOutcome.isstructurefailure = event.target.checked ? 1 : 0;
    }
    else if (selectedOutcome == "INFECTION") {
      this.hendersonOutcome.isinfection = event.target.checked ? 1 : 0;
    }
    else if (selectedOutcome == "TUMOR_PROGRESSION") {
      this.hendersonOutcome.istumorprogression = event.target.checked ? 1 : 0;
    }
    else if (selectedOutcome == "IMPLANT_RELATED") {
      this.hendersonOutcome.isimplantrelated = event.target.checked ? 1 : 0;
      this.hendersonOutcome.isstructurefailure = event.target.checked ? 1 : 0;
    }
    else if (selectedOutcome == "NON_IMPLANT_RELATED") {
      this.hendersonOutcome.isnonimplantrelated = event.target.checked ? 1 : 0;
      this.hendersonOutcome.isstructurefailure = event.target.checked ? 1 : 0;
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
