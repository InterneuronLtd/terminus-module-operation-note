//BEGIN LICENSE BLOCK 
//Interneuron Terminus

//Copyright(C) 2021  Interneuron CIC

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
import { CoreDiagnosis } from './entities/core-diagnosis.model';
import { CoreProcedure } from './core-procedure.model';
import { CoreOperation } from './core-operation.model';
import { CoreProcedureDetail } from './entities/core-procedure-detail.model';
import { CoreOperationPreparation } from './entities/core-operation-preparation.model';
import { CoreProcedureImplant } from './entities/core-procedure-implant.model';
import { CoreProcedureFinding } from './entities/core-procedure-finding.model';
import { StructuresAffected } from './structures-affected.model';
import { FluidLoss } from './fluid-loss.model';
import { CoreProcedureProvider } from './entities/core-procedure-provider.model';
import { CoreProblem } from './entities/core-problem.model';
import { CoreIndication } from './entities/core-indication.model';
import { CoreOperationPostopInstruction } from './entities/core-operation-postop-instruction.model';
import { CoreOperationProvider } from './entities/core-operation-provider.model';

export class OperationNote {
    operation: CoreOperation;
    operationPreparation: CoreOperationPreparation;
    postOperativeInstructions: CoreOperationPostopInstruction;
    operationProvider: CoreOperationProvider[] = [];

    diagnoses: CoreDiagnosis[] = [];
    procedures: CoreProcedure[] = [];
    
    procedureDetail: CoreProcedureDetail[] = [];
    procedureImplants: CoreProcedureImplant[] = [];
    procedureFindings: CoreProcedureFinding[] = [];
    procedureStructuresAffected: StructuresAffected[] = [];
    procedureFluidLoss: FluidLoss[] = [];
    procedureProvider: CoreProcedureProvider[] = [];
    problems: CoreProblem[] = [];
    indications: CoreIndication[] = [];
}