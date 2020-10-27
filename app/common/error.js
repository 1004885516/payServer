'use strict';

/**
 * 
 */
class PayServerError extends Error{

    constructor(param){
        super();
        this.code = param.code;
        this.message = param.message;
    }

    toJSON(){
        return{
            code:this.code,
            message:this.message
        }
    }

    toString(){
        return this.toJSON().toString();
    }

}

module.exports = PayServerError;