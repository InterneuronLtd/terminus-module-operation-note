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
import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { CoreOperation } from '../models/entities/core-operation.model';
import { CoreOperationProvider } from '../models/entities/core-operation-provider.model';

@Injectable({
    providedIn: 'root'
})
export class SubjectsService {

    unload = new Subject();
    contextChange = new Subject();

    //procedures = new Subject();
    operation: Subject<CoreOperation> = new Subject<CoreOperation>();

    private opProviderSubject = new BehaviorSubject([]);
    operationProviders = this.opProviderSubject.asObservable();

    nextOperationProvider(opProv: CoreOperationProvider[]) {
        this.opProviderSubject.next(opProv);
    }

    isViewPDF = new Subject(); 
    constructor() { }
}
