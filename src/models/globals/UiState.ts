import {observable, action} from 'mobx';
import preference, {PreferenceKeys} from '../../utils/preference'

interface IUIState {
    errMsg: string
    setErrMsg(msg: string, time?: number)
    showAjaxLoading()
    hideAjaxLoading()
}
class UIState implements IUIState {
    @observable isLockScreen: boolean = false // 全屏loading
    @observable isAjaxLoading: boolean = false //头部右上角的loading
    @observable navFolded = preference.get(PreferenceKeys.navFolded) == '1' // 侧边栏loading
    @observable errMsg: string = ''
    @observable showDevTools: boolean = false

    @action setErrMsg(msg, time = 10 * 1000) {
        this.errMsg = msg;
        setTimeout(this.clearErrMsg, time)
    }

    @action clearErrMsg() {
        this.errMsg = '';
    }

    @action lockScreen() {
        this.isLockScreen = true;
    }

    @action unLockScreen() {
        this.isLockScreen = false;
    }

    @action showAjaxLoading() {
        this.isAjaxLoading = true;
    }

    @action hideAjaxLoading() {
        this.isAjaxLoading = false;
    }

    @action triggerNavFold() {
        this.navFolded = !this.navFolded;
        preference.set(PreferenceKeys.navFolded, this.navFolded ? '1' : '0');
    }

    @action triggerDevTools() {
        this.showDevTools = !this.showDevTools
    }
}

const UiState = new UIState()
export default UiState;
