﻿export interface HashTable<T> {
    [key: string]: T;
}
export interface ISurveyData {
    getValue(name: string): any;
    setValue(name: string, newValue: any);
    getComment(name: string): string;
    setComment(name: string, newValue: string);
}
export interface ISurvey extends ISurveyData {
    currentPage: IPage;
    pageVisibilityChanged(page: IPage, newValue: boolean);
    questionVisibilityChanged(question: IQuestion, newValue: boolean);
    questionAdded(question: IQuestion, index: number);
    questionRemoved(question: IQuestion);
    validateQuestion(name: string): SurveyError;
    processHtml(html: string): string;
    processText(text: string): string;
    isDesignMode: boolean;
    requiredText: string;
    questionStartIndex: string;
    questionTitleTemplate: string;
    storeOthersAsComment: boolean;
    uploadFile(name: string, file: File, storeDataAsText: boolean, uploadingCallback: (status: string) => any): boolean;
    afterRenderQuestion(question: IQuestion, htmlElement);
}
export interface IConditionRunner {
    runCondition(values: HashTable<any>);
}
export interface IQuestion extends IConditionRunner {
    name: string;
    visible: boolean;
    hasTitle: boolean;
    setVisibleIndex(value: number);
    onSurveyValueChanged(newValue: any);
    onSurveyLoad();
    supportGoNextPageAutomatic(): boolean;
}
export interface IPage extends IConditionRunner {
    visible: boolean;
}

export class ItemValue {
    public static Separator = '|';
    public static setData(items: Array<ItemValue>, values: Array<any>) {
        items.length = 0;
        for (var i = 0; i < values.length; i++) {
            var value = values[i];
            var item = new ItemValue(null);
            if (typeof (value.value) !== 'undefined') {
                var exception = null;
                if (typeof (value.getType) !== 'undefined' && value.getType() == 'itemvalue') {
                    value.itemValue = value.itemValue;
                    item.itemText = value.itemText;
                    exception = ItemValue.itemValueProp;
                }
                ItemValue.copyAttributes(value, item, exception);
            } else {
                item.value = value;
            }
            items.push(item);
        }
    }
    public static getData(items: Array<ItemValue>): any {
        var result = new Array();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.hasText) {
                result.push({ value: item.value, text: item.text });
            } else {
                result.push(item.value);
            }
        }
        return result;
    }
    public static getItemByValue(items: Array<ItemValue>, val: any): ItemValue {
        for (var i = 0; i < items.length; i ++) {
            if (items[i].value == val) return items[i];
        }
        return null;
    }
    private static itemValueProp = [ "text", "value", "hasText"];
    private static copyAttributes(src: any, dest: any, exceptons: Array<string>) {
        for (var key in src) {
            if ((typeof src[key] == 'function')) continue;
            if (exceptons && exceptons.indexOf(key) > -1) continue;
            dest[key] = src[key];
        }
    }
    private itemValue: any;
    private itemText: string;
    constructor(value: any, text: string = null) {
        this.text = text;
        this.value = value;
    }
    public getType(): string { return "itemvalue"; }
    public get value(): any { return this.itemValue; }
    public set value(newValue: any) {
        this.itemValue = newValue;
        if (!this.itemValue) return;
        var str: string = this.itemValue.toString();
        var index = str.indexOf(ItemValue.Separator);
        if (index > -1) {
            this.itemValue = str.slice(0, index);
            this.text = str.slice(index + 1);
        }
    }
    public get hasText(): boolean { return this.itemText ? true : false; }
    public get text(): string {
        if (this.hasText) return this.itemText;
        if (this.value) return this.value.toString();
        return null;
    }
    public set text(newText: string) {
        this.itemText = newText;
    }
}

export class Base {
    public getType(): string {
        throw new Error('This method is abstract');
    }
    protected isTwoValueEquals(x: any, y: any): boolean {
        if (x === y) return true;
        if (!(x instanceof Object) || !(y instanceof Object)) return false;
        for (var p in x) {
            if (!x.hasOwnProperty(p)) continue;
            if (!y.hasOwnProperty(p)) return false;
            if (x[p] === y[p]) continue;
            if (typeof (x[p]) !== "object") return false;
            if (!this.isTwoValueEquals(x[p], y[p])) return false;
        }
        for (p in y) {
            if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false;
        }
        return true;
    }
}
export class SurveyError {
    public getText(): string {
        throw new Error('This method is abstract');
    }
}

export const SurveyPageId = "sq_page";
export class SurveyElement {
    public static ScrollElementToTop(elementId: string): boolean {
        if (!elementId) return false;
        var el = document.getElementById(elementId);
        if (!el || !el.scrollIntoView) return false;
        var elemTop = el.getBoundingClientRect().top;
        if (elemTop < 0)  el.scrollIntoView();
        return elemTop < 0;
    }
    public static GetFirstNonTextElement(elements: any) {
        if (!elements || !elements.length) return;
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].nodeName != "#text") return elements[i]; 
        }
        return null;
    }
    public static FocusElement(elementId: string): boolean {
        if (!elementId) return false;
        var el = document.getElementById(elementId);
        if (el) {
            el.focus();
            return true;
        }
        return false;
    }
}

export class Event<T extends Function, Options>  {
    private callbacks: Array<T>;
    public get isEmpty(): boolean { return this.callbacks == null || this.callbacks.length == 0; }
    public fire(sender: any, options: Options) {
        if (this.callbacks == null) return;
        for (var i = 0; i < this.callbacks.length; i ++) {
            var callResult = this.callbacks[i](sender, options);

        }
    }
    public add(func: T) {
        if (this.callbacks == null) {
            this.callbacks = new Array<T>();
        }
        this.callbacks.push(func);
    }
    public remove(func: T) {
        if (this.callbacks == null) return;
        var index = this.callbacks.indexOf(func, 0);
        if (index != undefined) {
            this.callbacks.splice(index, 1);
        }
    }
}