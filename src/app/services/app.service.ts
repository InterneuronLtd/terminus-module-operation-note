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
/* Interneuron Observation App
Copyright(C) 2023  Interneuron Holdings Ltd
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program.If not, see<http://www.gnu.org/licenses/>. */

import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import jwt_decode from "jwt-decode";
import { CoreOperation } from '../models/entities/core-operation.model';


@Injectable({
    providedIn: 'root'
})
export class AppService {
    subscriptions: Subscription;
    public personId: string;
    public encounterId: string;
    public operation: CoreOperation[] = [];
    public apiService: any;
    public baseURI: string;
    public appConfig: any = null;
    public loggedInUserName: string = null;
    public enableLogging: boolean = false;
    public contexts: any;
    public operationId: string;
    public terminologyBaseURI: string;
    constructor() { }

    decodeAccessToken(token: string): any {
        try {
            return jwt_decode(token);
        }
        catch (Error) {
            return null;
        }
    }

    logToConsole(msg: any) {
        if (this.enableLogging) {
            console.log(msg);
        }
    }

    destructor() {
        this.personId = null;
        this.encounterId = null;
        this.operation = [];
        this.apiService = null;
        this.baseURI = null;
        this.appConfig = null;
        this.loggedInUserName = null;
        this.enableLogging = false;
        this.contexts = null;
        this.operationId = null;
    }
}