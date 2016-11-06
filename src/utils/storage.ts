const leveljs = require('level-js')
class Storage {
    private db
    // @ngInject
    constructor() {
        this.db = new Promise<LevelUp>((resolve, reject) => {
            let db = <LevelUp>leveljs('storage')
            db.open(err => {
                if (err) {
                    return reject(err)
                }
                resolve(db)
            })
        })
    }

    async put(key: string, value: any) {
        let db: LevelUp = await this.db
        return await new Promise((resolve, reject) => {
            db.put(key, value, {raw: true}, (err) => {
                if (err) {
                    return reject(err)
                }
                resolve()
            })
        })
    }

    async get(key) {
        let db: LevelUp = await this.db
        return await new Promise((resolve, reject) => {
            db.get(key, {raw: true}, (err, value) => {
                if (err && err.message !== 'NotFound') {
                    console.error(err)
                    return reject(err)
                }
                resolve(value)
            })
        })
    }

    async del(key) {
        let db: LevelUp = await this.db
        return await new Promise((resolve, reject) => {
            db.del(key, (err) => {
                if (err) {
                    return reject(err)
                }
                resolve()
            })
        })
    }


    async cleanAll() {
        let db = await this.db
        let x = db.iterator({
            keys: true,
            values: false
        })
        let allKeys = []

        return await new Promise((resolve, reject) => {
            x.next((err, key) => {
                if (err) {
                    console.error(err)
                    reject(err)
                    return
                }
                if (key) {
                    allKeys.push(key)
                }

                if (!err && !key) {
                    // 遍历完成
                    db.batch(allKeys.map(key => {
                        return {
                            type: 'del',
                            key
                        }
                    }), (err) => {
                        if (err) {
                            console.error(err)
                            reject(err)
                            return
                        }
                        resolve()
                    })
                }
            })
        })
    }
}

export default new Storage()