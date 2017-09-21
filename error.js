class BasehttpError extends Error {
    constructor(msg, httpCode, OPCode, httpMsg) {
        super(msg)
        this.OPCode = OPCode
        this.httpCode = httpCode
        this.httpMsg = httpMsg
        this.name = 'BaseHTTPError'
    }
    static get['DEFAULT_OPCODE']() {
        return 100000
    }
}

class InternalError extends BasehttpError {
    constructor(msg) {
        const OPCode = 100001
        const httpMsg = "服务器出错了"
        super(msg, OPCode, 500, httpMsg)
    }
}

class ValidationError extends BasehttpError {
    constructor(path, reason) {
        const OPCode = 200000
        const httpCode = 400
        super(`Error validation params:${path} ,reason:${reason}`, httpCode, OPCode, '参数错误，请检查后重试')
        this.name = 'ValidationError'
    }
}

class DuplicatedNameError extends ValidationError {
    constructor(username) {
        super('username', `duplicate user name: ${username}`)
        this.httpMsg = '这个昵称已经被使用了'
        this.OPCode = 200001
    }
}

module.exports = {
    BasehttpError,
    ValidationError,
    DuplicatedNameError,
    InternalError
}