public with sharing class csvImportController {
    @AuraEnabled
    public static Account set_account(Account acc) {
        insert acc;
        return acc;
    }

    @AuraEnabled
    public static Account update_account(Account acc){
        update acc;
        return acc;
    }
}
