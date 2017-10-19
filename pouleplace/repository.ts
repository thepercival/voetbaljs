/**
 * Created by coen on 3-3-17.
 */

import { Injectable } from '@angular/core';
import { PoulePlace } from '../pouleplace';
import { Poule } from '../poule';
import { TeamRepository } from '../team/repository';

@Injectable()
export class PoulePlaceRepository {

    constructor( private teamRepos: TeamRepository ) {

    }

    jsonArrayToObject( jsonArray: any, poule: Poule ): PoulePlace[]
    {
        let objects: PoulePlace[] = [];
        for (let json of jsonArray) {
            let object = this.jsonToObjectHelper(json, poule);
            objects.push( object );
        }
        return objects;
    }

    jsonToObjectHelper( json : any, poule: Poule ): PoulePlace
    {
        let pouleplace = new PoulePlace(poule, json.number);
        pouleplace.setId(json.id);
        poule.setName(json.name);
        if (json.team){
            pouleplace.setTeam(this.teamRepos.jsonToObjectHelper(json.team));
        }
        return pouleplace;
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

    objectToJsonHelper( object : PoulePlace ): any
    {
        let json = {
            "id":object.getId(),
            "number":object.getNumber(),
            "name":object.getName(),
            "team":this.teamRepos.objectToJsonHelper(object.getTeam())
        };
        return json;
    }
}