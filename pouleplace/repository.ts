/**
 * Created by coen on 3-3-17.
 */

import { Injectable } from '@angular/core';
import { PoulePlace } from '../pouleplace';
import { Poule } from '../poule';
import { TeamRepository } from '../team/repository';

@Injectable()
export class PoulePlaceRepository {

    constructor(private teamRepos: TeamRepository) {

    }

    jsonArrayToObject(jsonArray: any, poule: Poule): PoulePlace[] {
        const objects: PoulePlace[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObjectHelper(json, poule);
            objects.push(object);
        }
        return objects;
    }

    jsonToObjectHelper(json: any, poule: Poule): PoulePlace {
        const pouleplace = new PoulePlace(poule, json.number);
        pouleplace.setId(json.id);
        poule.setName(json.name);
        if (json.team) {
            pouleplace.setTeam(this.teamRepos.jsonToObjectHelper(json.team));
        }
        return pouleplace;
    }

    objectsToJsonArray(objects: any[]): any[] {
        const jsonArray: any[] = [];
        for (const object of objects) {
            const json = this.objectToJsonHelper(object);
            jsonArray.push(json);
        }
        return jsonArray;
    }

    objectToJsonHelper(object: PoulePlace): any {
        const json = {
            'id': object.getId(),
            'number': object.getNumber(),
            'name': object.getName(),
            'team': object.getTeam() ? this.teamRepos.objectToJsonHelper(object.getTeam()) : null
        };
        return json;
    }
}
