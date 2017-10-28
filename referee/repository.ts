
import { Injectable } from '@angular/core';
import { Referee } from '../referee';
import {Competitionseason} from "../competitionseason";

@Injectable()
export class RefereeRepository {

    constructor() {

    }

    jsonArrayToObject( jsonArray: any, competitionseason: Competitionseason ): Referee[]
    {
        let objects: Referee[] = [];
        for (let json of jsonArray) {
            let object = this.jsonToObjectHelper(json, competitionseason);
            objects.push( object );
        }
        return objects;
    }

    jsonToObjectHelper( json : any, competitionseason: Competitionseason ): Referee
    {
        let referee = new Referee(competitionseason, json.stars);
        referee.setName(json.name);
        return referee;
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

    objectToJsonHelper( object : Referee ): any
    {
        let json = {
            "id":object.getId(),
            "stars":object.getStars(),
            "name":object.getName()
        };
        return json;
    }
}