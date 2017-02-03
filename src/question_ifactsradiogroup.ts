import {JsonObject} from "./jsonobject";
import {QuestionFactory} from "./questionfactory";
import {QuestionCheckboxBase} from "./question_baseselect";

export class QuestionIfactsRadiogroupModel extends QuestionCheckboxBase {
    constructor(public name: string) {
        super(name);
    }
    public getType(): string {
        return "ifactsradiogroup";
    }
    supportGoNextPageAutomatic() { return true; }
}

JsonObject.metaData.addClass("ifactsradiogroup", [], function () { return new QuestionIfactsRadiogroupModel(""); }, "checkboxbase");

QuestionFactory.Instance.registerQuestion("ifactsradiogroup", (name) => { var q = new QuestionIfactsRadiogroupModel(name); q.choices = QuestionFactory.DefaultChoices; return q;});