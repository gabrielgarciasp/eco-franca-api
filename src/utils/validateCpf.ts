const validatyCpf = (cpf:string):boolean => {
    const cpfNoDot = cpf.replace(/[^\d]+/g,''); 
    if(cpfNoDot == '') return false;	    
    if (cpfNoDot.length != 11 || 
        cpfNoDot == "00000000000" || 
        cpfNoDot == "11111111111" || 
        cpfNoDot == "22222222222" || 
        cpfNoDot == "33333333333" || 
        cpfNoDot == "44444444444" || 
        cpfNoDot == "55555555555" || 
        cpfNoDot == "66666666666" || 
        cpfNoDot == "77777777777" || 
        cpfNoDot == "88888888888" || 
        cpfNoDot == "99999999999") {
            return false;
        }

    // Validaty first digit	
    let add = 0;	
    for (let i=0; i < 9; i ++) {
        add += parseInt(cpfNoDot.charAt(i)) * (10 - i);	
        let rev = 11 - (add % 11);  
        if (rev == 10 || rev == 11) {
            rev = 0;
        };
        if (rev != parseInt(cpfNoDot.charAt(9))) {
            return false;
        };  	
    }   
    // Validaty second digit
    add = 0;	
    for (let i = 0; i < 10; i ++) {
        add += parseInt(cpfNoDot.charAt(i)) * (11 - i);	
    }	

    let rev = 11 - (add % 11);	
    if (rev == 10 || rev == 11)	{
        rev = 0;
    }
    if (rev != parseInt(cpfNoDot.charAt(10))){
        return false;
    }   
    return true;
}

export { validatyCpf }