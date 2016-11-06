/**
 *
 * Created by huangjin on 16/4/8.
 */
import {Once} from './once'
import {observable, action} from 'mobx'
import UiState from '../models/globals/UiState'

import {camelize, unCamelize} from './camelize'
import {validator} from './validator'
import * as session from './session'
import {ERR_TOKEN_NEED_REFRESH} from "./session";
const clone = require('clone')
const hash = require('object-hash')
const once = new Once('api')

let lang = 'zh-CN'

interface ApiResponse {
    data?: any
    meta?: {
        errCode?: number
        errMsg?: string
    }
}
class LoadingStore {
    @observable counter = 0
    @observable msg = ''
    @observable type = ''

    @action setMsg(msg = '', type = 'info', timeout = 3000) {
        this.counter++
        if (this.type === 'error' && type !== 'error') {
            this.counter--
            return
        }

        this.type = type
        this.msg = msg
        if (timeout === 0) {
            return
        }
        setTimeout(this.hideMsg, timeout)
    }

    @action hideMsg() {
        this.counter--
    }
}
export let loadingStore = new LoadingStore()

export let genApi = (apiUrl, apiMethod = 'GET', {
    withCredentials = false,
    requestSchema = null,
    responseSchema = null,
    cached = true
} = {}) => {
    let reqValidate: string|boolean = false
    if (requestSchema) {
        reqValidate = hash(requestSchema)
        validator.addSchema(<string>reqValidate, requestSchema)
    }
    let respValidate: string|boolean = false
    if (responseSchema) {
        respValidate = hash(responseSchema)
        validator.addSchema(<string>respValidate, responseSchema)
    }
    let api = {
        method: apiMethod.toUpperCase(),
        url: apiUrl,
        withCredentials,
        cached,
        reqValidate,
        respValidate
    }
    return (requestBody, blockUI = true) => {
        let id = apiUrl + '||' + hash({requestBody, lang})
        let {method = 'GET', url, withCredentials, cached, reqValidate, respValidate} = api
        if (reqValidate) {
            let errors
            try {
                errors = validator.validate(reqValidate, requestBody)
            } catch (err) {
                errors = err
            }
            if (errors) {
                console.warn('request body invalid', apiUrl, errors, requestBody)
                return Promise.reject(errors)
            }
        }
        let headers = new Headers()
        headers.set('Accept-Language', lang)
        headers.set('X-Request-With', 'cp-web')
        let body
        if (typeof requestBody === 'boolean') {
            blockUI = requestBody
            requestBody = null
        }

        if (requestBody) {
            requestBody = unCamelize(requestBody)
            switch (method) {
                case 'GET':
                    url += '?' + Object.keys(requestBody).map(k => {
                            return k + '=' + requestBody[k]
                        }).join('&')
                    break
                default:
                    headers.set('Content-Type', 'application/json')
                    body = JSON.stringify(requestBody)
                    break
            }
        }


        return once.do(id, async() => {
            let startTime = Date.now()
            if (blockUI) {
                UiState.showAjaxLoading()
                // loadingStore.setMsg('Processing now', 'info', 0)
            }
            let ret = (async() => {
                let isLogin = false
                try {
                    let token = await session.check()
                    headers.set('Authorization', `bearer ${token}`)
                    isLogin = true
                } catch (err) {
                    // nothing
                    isLogin = false
                }

                //  check login
                if (withCredentials && !isLogin) {
                    await Promise.reject(session.ERR_NO_SESSION)
                    return
                }

                let response: ApiResponse = {}
                let needRefresh = false
                let request = new Request(url, {
                    method,
                    headers,
                    body
                })
                try {
                    let resp = await fetch(request);
                    let xBuild = resp.headers.get('x-build')
                    if (xBuild) {
                        try {
                            let xBR = localStorage.getItem('x-build') || ''
                            localStorage.setItem('x-build', xBuild)
                            if (xBR && xBR !== xBuild) {
                                if (DEBUG) {
                                    debugger
                                }
                                localStorage.setItem('reload debug', 'x build cause reload')
                                window.location.reload(true)
                            }
                        } catch (err) {
                            // nothing
                        }
                    }
                    let data = <ApiResponse>await resp.json()
                    response = data.data || {}
                    if (data.meta.errCode !== 0) {
                        await Promise.reject(data)
                    }
                } catch (err) {
                    let {data} = err
                    if (!data || !data.meta || data.meta.errCode !== ERR_TOKEN_NEED_REFRESH || !withCredentials) {
                        // 异常状态
                        log(url, err, Date.now() - startTime)
                        await Promise.reject(err)
                        return
                    }
                    needRefresh = true
                }
                if (needRefresh) {
                    // 尝试刷新 token 后再次请求
                    try {
                        let token = await session.refresh()
                        headers.set('Authorization', `bearer ${token}`)
                        let resp = await fetch(request);
                        let data = <ApiResponse>await resp.json()
                        response = data.data || {}
                    } catch (err) {
                        // 异常状态
                        log(url, err, Date.now() - startTime)
                        await Promise.reject(err)
                        return
                    }
                }

                response = camelize(response)

                if (respValidate) {
                    let errors
                    try {
                        errors = validator.validate(respValidate, response)
                    } catch (err) {
                        errors = err
                    }
                    if (errors) {
                        console.warn('response body invalid', apiUrl, errors, response)
                        await Promise.reject(errors)
                        return
                    }
                }
                return await Promise.resolve(response)
            })()

            if (blockUI) {
                ret.then(() => {
                    UiState.hideAjaxLoading()
                }).catch(err => {
                    UiState.hideAjaxLoading()
                    UiState.setErrMsg(getErrText(err))
                })
            }
            return await ret
        }, cached)
    }
}
export function clean() {
    once.clean()
}

function log(url, err, during) {
    try {
        let t = encodeURIComponent(url)
        let img = new Image()
        img.src = '/log?a=request&t=' + t + '&d=' + encodeURIComponent(JSON.stringify(err.meta)) +
            '&ms=' + during +
            '&u=' + session.id()
    } catch (e) {
        // do nothing
    }
}
function getErrText(err: any = null): string {
    if (!err) {
        return ''
    }

    if (err.validation) {
        // json schema error
        console.warn(err)
        return 'params error'
    }
    if (!err.meta) {
        // err is string
        console.warn(err)
        // this.showInfo('We feel sorry that a problem might occur, please refresh and try again.', 'error', false)
        return '出错啦，请刷新后再试'
    }
    err = <IError>err
    let errMsg = this.translate('err-' + err.meta.errCode)
    if (errMsg !== 'err-' + err.meta.errCode) {
        return errMsg
    }
    switch (err.meta.errCode) {
        default:
            return '出错啦，请刷新后再试'
    }
}
interface IError {
    meta: {
        errCode: number
        errMsg: string
        reqId: string
    }
}
