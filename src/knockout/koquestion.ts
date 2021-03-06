﻿import * as ko from "knockout";
import {QuestionImplementorBase} from "./koquestionbase";
import {Question} from "../question";
import {SurveyElement} from "../base";

export class QuestionImplementor extends QuestionImplementorBase {
    private isUpdating: boolean = false;
    private koDummy: any;
    koValue: any; koComment: any; koTitle: any; koDescription: any; koRecommendationCount: any;
    constructor(public question: Question) {
        super(question);
        var self = this;
        question.valueChangedCallback = function () { self.onValueChanged(); };
        question.commentChangedCallback = function () { self.onCommentChanged(); };
        question.errorsChangedCallback = function () { self.onErrorsChanged(); };
        question.titleChangedCallback = function () { self.onVisibleIndexChanged(); };
        question.visibleIndexChangedCallback = function () { self.onVisibleIndexChanged(); };
        this.koDummy = ko.observable(0);
        this.koValue = this.createkoValue();
        this.koComment = ko.observable(this.question.comment);
        this.koTitle = ko.pureComputed(function () { self.koDummy(); return self.question.fullTitle; });
        this.koDescription = ko.pureComputed(function () { self.koDummy(); return self.question.description; });
        this.koRecommendationCount = ko.pureComputed(function () { self.koDummy(); return self.question.recommendationCount; });
        this.koErrors(this.question.errors);
        this.koValue.subscribe(function (newValue) {
            self.updateValue(newValue);
        });
        this.koComment.subscribe(function (newValue) {
            self.updateComment(newValue);
        });
        this.question["koValue"] = this.koValue;
        this.question["koComment"] = this.koComment;
        this.question["koTitle"] = this.koTitle;
        this.question["koDescription"] = this.koDescription;
        this.question["koQuestionAfterRender"] = function (el, con) { self.koQuestionAfterRender(el, con); };
        this.question["koRecommendationCount"] = this.koRecommendationCount;
    }
    protected updateQuestion() {
        this.koDummy(this.koDummy() + 1);
    }
    protected onValueChanged() {
        if (this.isUpdating) return;
        this.setkoValue(this.question.value);
    }
    protected onCommentChanged() {
        if (this.isUpdating) return;
        this.koComment(this.question.comment);
    }
    protected onVisibleIndexChanged() {
        this.koDummy(this.koDummy() + 1);
    }
    protected onErrorsChanged() {
        this.koErrors(this.question.errors);
    }
    protected createkoValue(): any { return ko.observable(this.question.value); }
    protected setkoValue(newValue: any) {
        this.koValue(newValue);
    }
    protected updateValue(newValue: any) {
        this.isUpdating = true;
        this.question.value = newValue;
        this.isUpdating = false;
    }
    protected updateComment(newValue: any) {
        this.isUpdating = true;
        this.question.comment = newValue;
        this.isUpdating = false;
    }
    protected getNo(): string {
        return this.question.visibleIndex > -1 ? this.question.visibleIndex + 1 + ". " : "";
    }
    protected koQuestionAfterRender(elements, con) {
        var el = SurveyElement.GetFirstNonTextElement(elements);
        var tEl = elements[0];
        if (tEl.nodeName == "#text") tEl.data = "";
        tEl = elements[elements.length - 1];
        if (tEl.nodeName == "#text") tEl.data = "";
        if (el && this.question.customWidget) this.question.customWidget.afterRender(this.question, el);
    }
}