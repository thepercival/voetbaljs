import { Injectable } from '@angular/core';
import { Field } from '../field';
import {Competitionseason} from '../competitionseason';

@Injectable()
export class FieldRepository {

    private fields: Field[] = [];
    constructor() {

    }

    getObject( id: number ): Field {
        return this.fields.find( fieldIt => id === fieldIt.getId() );
    }

    jsonArrayToObject( jsonArray: any, competitionseason: Competitionseason ): Field[] {
        const objects: Field[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObjectHelper(json, competitionseason);
            objects.push( object );
        }
        return objects;
    }

    jsonToObjectHelper( json: any, competitionseason: Competitionseason ): Field {
        const field = new Field(competitionseason, json.number);
        field.setId(json.id);
        field.setName(json.name);
        this.fields.push(field);
        return field;
    }

    objectsToJsonArray( objects: any[] ): any[] {
        const jsonArray: any[] = [];
        for (const object of objects) {
            const json = this.objectToJsonHelper(object);
            jsonArray.push( json );
        }
        return jsonArray;
    }

    objectToJsonHelper( object: Field ): any {
        const json = {
            'id': object.getId(),
            'number': object.getNumber(),
            'name': object.getName()
        };
        return json;
    }
}
