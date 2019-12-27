public inherited sharing class CSVReaderController {
    @AuraEnabled
    public static list<Account> readCSVFile(Id idContentDocument){
        list<Account> lstAccsToInsert = new list<Account>();
        if(idContentDocument != null) {
            
            // getting File Data based on document id 
            ContentVersion objVersion = [SELECT Id, VersionData FROM ContentVersion WHERE ContentDocumentId =:idContentDocument limit 1];
            // split the file data
            
            list<String> lstCSVLines = objVersion.VersionData.toString().split('\n');

            for(Integer i = 1; i < lstCSVLines.size(); i++){
                Account objAcc = new Account();
                list<String> csvRowData = lstCSVLines[i].split(';');
                System.debug('csvRowData====> '+csvRowData);
                objAcc.Name = csvRowData[1] + csvRowData[2]; // accName
                objAcc.Identity_Document__c = csvRowData[0];
                objAcc.First_Name__c = csvRowData[1];
                objAcc.Last_Name__c = csvRowData[2];
                objAcc.Status__c = 'OK';
                lstAccsToInsert.add(objAcc);
            }/* 

            try{    
                if(!lstAccsToInsert.isEmpty()) {
                    insert lstAccsToInsert;
                }
            }
            catch (Exception ex) {
                system.debug(ex);
                throw new AuraHandledException(ex.getMessage());
            } */ 
        }
        return lstAccsToInsert;    
    }

    @AuraEnabled
    public static list<Account> set_data(String file){
        list<Account> lst_of_data = new list<Account>();
        System.debug('@@@ ' + file);
        /* list<String> lstCSVLines = file.split('\n');

        for(Integer i = 1; i < lstCSVLines.size(); i++){
            Account objAcc = new Account();
            list<String> csvRowData = lstCSVLines[i].split(';');
            System.debug('csvRowData====> '+csvRowData);
            objAcc.Name = csvRowData[1] + ' ' + csvRowData[2]; // accName
            objAcc.First_Name__c = csvRowData[1];
            objAcc.Last_Name__c = csvRowData[2];
            objAcc.Identity_Document__c = csvRowData[0];
            objAcc.Status__c = 'OK';
            lst_of_data.add(objAcc);
        }
 */
        return lst_of_data;
    }
}
