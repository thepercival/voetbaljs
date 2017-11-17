/**
 * Created by coen on 3-3-17.
 */

import { Injectable } from '@angular/core';
import { PoulePlaceRepository } from '../pouleplace/repository';
import { Poule } from '../poule';
import { GameRepository } from '../game/repository';
import { Round } from '../round';

@Injectable()
export class PouleRepository {

    constructor(private pouleplaceRepos: PoulePlaceRepository, private gameRepos: GameRepository) {

    }

    jsonArrayToObject(jsonArray: any, round: Round): Poule[] {
        const objects: Poule[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObjectHelper(json, round);
            objects.push(object);
        }
        return objects;
    }

    jsonToObjectHelper(json: any, round: Round): Poule {
        const poule = new Poule(round, json.number);
        poule.setName(json.name);
        this.pouleplaceRepos.jsonArrayToObject(json.places, poule);
        if (json.games != null) {
            this.gameRepos.jsonArrayToObject(json.games, poule);
        }
        return poule;
    }

    objectsToJsonArray(objects: any[]): any[] {
        const jsonArray: any[] = [];
        for (const object of objects) {
            const json = this.objectToJsonHelper(object);
            jsonArray.push(json);
        }
        return jsonArray;
    }

    objectToJsonHelper(object: Poule): any {
        const json = {
            'id': object.getId(),
            'number': object.getNumber(),
            'name': object.getName(),
            'places': this.pouleplaceRepos.objectsToJsonArray(object.getPlaces())
        };
        return json;
    }
}
