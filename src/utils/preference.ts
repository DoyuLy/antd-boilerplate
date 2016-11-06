import safeLocalStorage from './safeLocalStorage.js';

const PreferenceDefaultConfigs = {
    'navFolded': false, //左侧导航栏，默认不收起
};

const PreferenceKeys: any = Object.keys(PreferenceDefaultConfigs).reduce((last, key) => {
    last[key] = key
    return last
}, {})

function checkKey(key) {
    if (!(key in PreferenceKeys)) {
        throw new Error(`${key} should be in Preference for better management. Add it first!`);
    }
}

const Preference = {
    set(key, value){
        if (process.env.NODE_ENV !== 'production') {
            checkKey(key);
        }
        safeLocalStorage.setItem(key, value);
    },
    get(key){
        if (process.env.NODE_ENV !== 'production') {
            checkKey(key);
        }
        return safeLocalStorage.getItem(key) || PreferenceDefaultConfigs[key];
    }
};

export default Preference;

export {PreferenceKeys}

