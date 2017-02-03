﻿import {QuestionIfactsRadiogroupModel} from "../question_ifactsradiogroup";
import {JsonObject} from "../jsonobject";
import {QuestionFactory} from "../questionfactory";
import {QuestionCheckboxBaseImplementor} from "../knockout/koquestion_baseselect";

export class QuestionIfactsRadiogroup extends QuestionIfactsRadiogroupModel {
    constructor(public name: string) {
        super(name);
        new QuestionCheckboxBaseImplementor(this);
    }
}

JsonObject.metaData.overrideClassCreatore("ifactsradiogroup", function () { return new QuestionIfactsRadiogroup(""); });

QuestionFactory.Instance.registerQuestion("ifactsradiogroup", (name) => { var q = new QuestionIfactsRadiogroup(name); q.choices = QuestionFactory.DefaultChoices; return q; });