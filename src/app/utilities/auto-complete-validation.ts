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

import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[autoCompleteValidation]'
})
export class AutoCompleteValidationDirective {
  private regex: RegExp = new RegExp(/^[a-zA-Z\d\s()]+$/g);  
  private specialKeys: Array < string > = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight','ArrowUp','ArrowDown', 'Del', 'Delete'];  
  constructor(private el: ElementRef) {}  
 
  @HostListener('keydown', ['$event']) 
  onKeyDown(event: KeyboardEvent) {  
      // Allow Backspace, tab, end, and home keys     
      if (this.specialKeys.indexOf(event.key) !== -1) {  
          return;  
      }        
      let current: string = this.el.nativeElement.part.value;
      current = current + "" +  event.key;  
      if (current && !String(current).match(this.regex)) {  
          event.preventDefault();  
      }  
  }  
}
