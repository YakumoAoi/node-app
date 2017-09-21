class BaseHTTPError extends Error {
    constructor(OPCode, httpCode, http, httpMsg) {
        this.OPCode = OPCode
        this.httpCode = httpCode
        this.http = http
        this.httpMsg = httpMsg
    }
}
class ValidationError extends BaseHTTPError {
    constructor(path, reason) {
        const OPCode = 1000001
        const httpCode = 400
        super(`error validating param: ${path}, reason: ${reason}`, OPCode, httpCode, '参数错误，请检查后重试')
    }
    toString() {
        return 'balo'
    }
}

let e = new ValidationError('name', 'should be less than 16character')

console.log(JSON.stringify(e))