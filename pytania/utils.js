
module.exports = {
    deleteAll: async function (db,path) {
        let ref = db.collection(path)
        await db.collection(path).onSnapshot(snapshot => {
            snapshot.docs.forEach(doc => {
                ref.doc(doc.id).delete()
            })
        })
        console.log('usunelismy wszystko')
    }
    
};