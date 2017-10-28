
import { Injectable } from '@angular/core';
import { Field } from '../field';
import {Competitionseason} from "../competitionseason";

@Injectable()
export class FieldRepository {

    constructor() {

    }

    jsonArrayToObject( jsonArray: any, competitionseason: Competitionseason ): Field[]
    {
        let objects: Field[] = [];
        for (let json of jsonArray) {
            let object = this.jsonToObjectHelper(json, competitionseason);
            objects.push( object );
        }
        return objects;
    }

    jsonToObjectHelper( json : any, competitionseason: Competitionseason ): Field
    {
        let field = new Field(competitionseason, json.number);
        field.setName(json.name);
        return field;
    }

    objectsToJsonArray( objects: any[] ): any[]
    {
        let jsonArray: any[] = [];
        for (let object of objects) {
            let json = this.objectToJsonHelper(object);
            jsonArray.push( json );
        }
        return jsonArray;
    }

    objectToJsonHelper( object : Field ): any
    {
        let json = {
            "id":object.getId(),
            "number":object.getNumber(),
            "name":object.getName()
        };
        return json;
    }
}