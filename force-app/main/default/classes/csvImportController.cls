public with sharing class csvImportController {
    @AuraEnabled
    public static Account set_account(Account acc) {
        System.debug(acc);
        acc.Name = acc.First_Name__c + ' ' + acc.Last_Name__c;
        try{
            insert acc;
            return acc;
        }catch(DmlException e){
            System.debug('@@@ error mother ducker ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());  
        }
    }

    @AuraEnabled
    public static Account update_account(Account acc){
        System.debug(acc);
        acc.Name = acc.First_Name__c + ' ' + acc.Last_Name__c;
        try{
            update acc;
            return acc;
        }catch(DmlException e){
            System.debug('@@@ error mother ducker ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());  
        }
    }
}
