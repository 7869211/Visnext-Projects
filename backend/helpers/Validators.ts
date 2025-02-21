class Validators {
    static isValidEmail(email: string): boolean {
        return email.includes('@');
    }

    static isValidPassword(password: string): boolean {
        if(!password || typeof password !== 'string'){
            return false;
        }
        return password.length > 4;
    }

    static isValidName(name: string): boolean {
        return typeof name === 'string' && name.trim().length > 0;
    }

    static isValidStr(str: string | null | undefined): boolean {
        return typeof str === 'string' && str.trim().length > 0;
    }
}

export default Validators;
