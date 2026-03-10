let errormidd = async (error, req, resp, next) => {
    resp.status(error.status || 500).send({ message: error })
}

export default errormidd