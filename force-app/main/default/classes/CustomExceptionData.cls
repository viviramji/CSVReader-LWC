public with sharing class CustomExceptionData {
    public String name;
    public String message;
    public Integer code;
    public CustomExceptionData(String name, String msg, Integer code){
        this.name = name;
        this.message = msg;
        this.code = code;
    }
}
