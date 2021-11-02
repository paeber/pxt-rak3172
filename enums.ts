// Enum defines

enum eRAK3172_RC {
    OK,	                    //Command executed correctly without error.
    AT_ERROR,	            //Generic error or input is not supported.
    AT_PARAM_ERROR,         //The input parameter of the command is wrong.
    AT_BUSY_ERROR,          //The network is busy so the command is not completed.
    AT_TEST_PARAM_OVERFLOW,	//The parameter is too long.
    AT_NO_NETWORK_JOINED,	//Module is not yet joined to a network.
    AT_RX_ERROR,           	//Error detected during the reception of the command
    AT_DUTYCYLE_RESTRICTED  //Duty cycle limited and cannot send data
}

enum eBool {
    disable,   //disable represents 0
    enable     //enable represents 1
}

