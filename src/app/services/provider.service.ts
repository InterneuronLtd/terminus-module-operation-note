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
import { Injectable } from "@angular/core";
import { ApirequestService } from './apirequest.service';
import { EndpointsService } from './endpoints.service';
import { CoreProvider } from '../models/entities/core-provider.model';

@Injectable({
    providedIn: "root"
})
export class ProviderService {
    public allProviders: CoreProvider[];

    constructor(private apiRequest: ApirequestService,
        private endpoints: EndpointsService) {
        this.allProviders = [];
    }

    public async initAllProviders() {
        let data = await this.apiRequest.getRequest(this.endpoints.getProviderUrl).toPromise();

        this.allProviders = JSON.parse(data);
        this.allProviders.forEach((p) => {
            p.displayname = [p.lastname, ', ', p.firstname, ' (', p.provider_id, ')'].join('').trim();
        });
    }
}