//BEGIN LICENSE BLOCK 
//Interneuron Terminus

//Copyright(C) 2024  Interneuron Limited

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
import { EntityBase } from './entity-base.model';
import { CoreOperationPostopInstruction } from './core-operation-postop-instruction.model';
import { CoreOperationPreparation } from './core-operation-preparation.model';
import { CoreOperationProvider } from './core-operation-provider.model';
import { CoreProcedure } from './core-procedure.model';
import { CoreDiagnosis } from './core-diagnosis.model';
import { CoreOperationAnaesthetic } from './core-operationanaesthetic';
import { CoreOperationantibiotics } from './core-operationantibiotics';
import { CoreOperationNoteHistory } from './core-operation-note-history.model';
import { OperationNoteHendersonOutcome } from './core-operationnote-henderson-outcome.model';

export class CoreOperation extends EntityBase {
	constructor() {
		super();
		this.operationpostopinstructions = new CoreOperationPostopInstruction();
		this.operationpreparation = new CoreOperationPreparation();
		this.operationproviders = [];
		this.diagnoses = []
		this.procedures = [];
		this.operationanaesthetic=[];
	
	}

	operation_id: string;
	person_id: string;
	encounter_id: string;
	location_id: string;
	statuscode: string;
	statustext: string;
	operationtypecode: string;
	operationtypetext: string;
	scheduleidentifiercode: string;
	scheduleidentifiertext: string;
	reasoncode: string;
	reasontext: string;
	operationduration: number;
	operationdurationunit: string;
	plannedstart: string;
	start: string;
	finish: string;
	operationsidecode: string;
	operationsidetext: string;
	operationnotestatuscode: string;
	operationnotestatustext: string;
	operationqualifiercode: string;
	operationqualifiertext: string;
	asagradetext:string="";
	asagradecode:string="";
	isretrospectivedata: boolean;

	locationtext: string = "";
	operationpostopinstructions: CoreOperationPostopInstruction;
	operationpreparation: CoreOperationPreparation;
	operationproviders: CoreOperationProvider[];
	diagnoses: CoreDiagnosis[];
	operationanaesthetic:CoreOperationAnaesthetic[];
	operationantibiotics:CoreOperationantibiotics[];

	procedures: CoreProcedure[];
	latestoperationnotehistory: CoreOperationNoteHistory;
	hendersonoutcome: OperationNoteHendersonOutcome;
}