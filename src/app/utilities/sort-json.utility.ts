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
export var sortJson = function(...args: any[]) {
    var fields = [].slice.call(arguments),
        n_fields = fields.length;
 
    return function(A,B) {
        var a, b, field, key, primer, reverse, result, i;
 
        for(i = 0; i < n_fields; i++) {
            result = 0;
            field = fields[i];
 
            key = typeof field === 'string' ? field : field.name;
 
            a = A[key];
            b = B[key];
 
            if (typeof field.primer  !== 'undefined'){
                a = field.primer(a);
                b = field.primer(b);
            }
 
            reverse = (field.reverse) ? -1 : 1;
 
            if (a<b) result = reverse * -1;
            if (a>b) result = reverse * 1;
            if(result !== 0) break;
        }
        return result;
    }
 };