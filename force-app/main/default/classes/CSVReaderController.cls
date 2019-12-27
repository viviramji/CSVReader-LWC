public inherited sharing class CSVReaderController {
    @AuraEnabled
    public static list<Account> readCSVFile(Id idContentDocument){
        list<Account> lstAccsToInsert = new list<Account>();
        list<Account> lstAccsInDB = [SELECT Id, Identity_Document__c, First_Name__c, Last_Name__c FROM Account LIMIT 500];
        if(idContentDocument != null) {
            
            // getting File Data based on document id 
            ContentVersion objVersion = [SELECT Id, VersionData FROM ContentVersion WHERE ContentDocumentId =:idContentDocument limit 1];
            // split the file data
            list<String> lstCSVLines = objVersion.VersionData.toString().split('\n');
            //check if overload the process
            if(lstCSVLines.size() > 500){
                String name = 'Limit data';
                String msg = 'You are not allow to import a CSV with ' + lstCSVLines.size() + ' lines.';
                Integer code = 999;
                CustomExceptionData my_own_exception = new CustomExceptionData(name, msg, code);
                throw new AuraHandledException(JSON.serialize(my_own_exception));
            } else //CHECK FORMAT FILE
                if(lstCSVLines[0].contains(';') && lstCSVLines.size() > 0){
                String name = 'Invalid Format';
                String msg = 'Please use a CSV file separated  with commas instead of semicolon.';
                Integer code = 666;
                CustomExceptionData my_own_exception = new CustomExceptionData(name, msg, code);
                throw new AuraHandledException(JSON.serialize(my_own_exception));
            }
            String HEADER = lstCSVLines[0];
            Boolean has_id_column = false;
            String defaulf_header = 'Identity_Document__c,First_Name__c,Last_Name__c';
            string default_header_id = 'id,Identity_Document__c,First_Name__c,Last_Name__c';

            if(HEADER.contains('id,')){
                system.debug('@@@ contains id');
                has_id_column = true;
            }else{
                system.debug('@@@ ! contains id');
            }

            for(Integer i = 1; i < lstCSVLines.size(); i++){
                Account objAcc = new Account();
                list<String> csvRowData = lstCSVLines[i].split(',');
                System.debug('csvRowData====> '+csvRowData);
                if(has_id_column){
                    objAcc.Aux_Id__c = csvRowData[0];
                    objAcc.Identity_Document__c = csvRowData[1];
                    objAcc.Name = csvRowData[2] + csvRowData[3];
                    objAcc.First_Name__c = csvRowData[2];
                    objAcc.Last_Name__c = csvRowData[3];
                    objAcc.Status__c = 'OK';
                    lstAccsToInsert.add(objAcc);
                }else{
                    objAcc.Aux_Id__c = '0';
                    objAcc.Identity_Document__c = csvRowData[0];
                    objAcc.Name = csvRowData[1] + csvRowData[2];
                    objAcc.First_Name__c = csvRowData[1];
                    objAcc.Last_Name__c = csvRowData[2];
                    objAcc.Status__c = 'OK';
                    lstAccsToInsert.add(objAcc);
                }
            }
        }
        return lstAccsToInsert;    
    }

}
