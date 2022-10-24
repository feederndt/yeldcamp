class ExpressError extends Error {
    constructor(message, stutusCode) {
        super();
        this.message = message;
        this.statusCode = stutusCode;
    }
}

module.exports = ExpressError;