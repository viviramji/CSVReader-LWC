import { LightningElement, track, api } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

import readCSV from '@salesforce/apex/CSVReaderController.readCSVFile';

const columns = [
    { label: 'Identity Document', fieldName: 'Identity_Document__c' }, 
    { label: 'First Name', fieldName: 'First_Name__c' },
    { label: 'Last Name', fieldName: 'Last_Name__c'},
    { label: 'Status', fieldName: 'Status__c'}
];

export default class CSVReader extends LightningElement {
    @api recordId;
    @track error;
    @track columns = columns;
    @track data;

    // accepted parameters
    get acceptedFormats() {
        return ['.csv'];
    }
    
    handleUploadFinished(event) {
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;

        // calling apex class
        readCSV({idContentDocument : uploadedFiles[0].documentId})
        .then(result => {
            window.console.log('result ===> '+result);
            this.data = result;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success!!',
                    message: 'Accounts are created based CSV file!!!',
                    variant: 'success',
                }),
            );
        })
        .catch(error => {
            this.error = error;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error!!',
                    message: JSON.stringify(error),
                    variant: 'error',
                }),
            );     
        })

    }
}