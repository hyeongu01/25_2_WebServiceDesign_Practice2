const RequestForm = (data, meta) => {
    return {
        data: data,
        meta: meta
    }
}

const ErrorRequestForm = (error, message) => {
    return {
        error: error,
        message: message
    }
}

module.exports = {
    RequestForm,
    ErrorRequestForm
}