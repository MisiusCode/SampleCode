class DbAgent {
    insertData (data) {
        return new Promise((resolve, reject) => {
            // console.log(data)
            fetch('/statistic', {
                method: 'POST',
                body: data
            })
                .then((onSuccess) => resolve(onSuccess))
                .catch((onError) => reject(onError))
        })
    }
}

export default new DbAgent()
