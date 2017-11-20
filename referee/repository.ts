
import { Injectable } from '@angular/core';
import { Referee } from '../referee';
import { Competitionseason } from '../competitionseason';

@Injectable()
export class RefereeRepository {

    constructor() {

    }

    jsonArrayToObject(jsonArray: any, competitionseason: Competitionseason): Referee[] {
        const objects: Referee[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObjectHelper(json, competitionseason);
            objects.push(object);
        }
        return objects;
    }

    jsonToObjectHelper(json: any, competitionseason: Competitionseason): Referee {
        const referee = new Referee(competitionseason, json.number);
        referee.setName(json.name);
        return referee;
    }

    objectsToJsonArray(objects: any[]): any[] {
        const jsonArray: any[] = [];
        for (const object of objects) {
            const json = this.objectToJsonHelper(object);
            jsonArray.push(json);
        }
        return jsonArray;
    }

    objectToJsonHelper(object: Referee): any {
        const json = {
            'id': object.getId(),
            'number': object.getNumber(),
            'name': object.getName()
        };
        return json;
    }
}
