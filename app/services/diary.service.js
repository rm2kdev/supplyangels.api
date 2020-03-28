const Metadata = require(basedir + '/helpers/metadata.js');

module.exports = DiaryService = {

    create: (owner, insertObject) => {
        return new Promise((resolve, reject) => {
            // resolve(samples)
            let diaryEntry = insertObject;
            insertObject.metadata = Metadata.generateWithOwner(owner);

            DiaryModel.create(diaryEntry)
                .then(result => resolve(result))
                .catch(error => reject(error))
        })
    },

    listall: (owner) => {
        return new Promise((resolve, reject) => {
            DiaryModel.find({"metadata.owner": owner})
                .then( data => {
                    if (!data) reject("No diary entries returned.");
                    resolve(data)
                })
                .catch(error => reject(error))
        })
    }

};
