/**
 * Created by coen on 20-3-17.
 */

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Game } from '../game';
import { Poule } from '../poule';
import { PoulePlaceRepository } from '../pouleplace/repository';
import { FieldRepository } from '../field/repository';
import { RefereeRepository } from '../referee/repository';

@Injectable()
export class GameRepository {

    constructor(
        private pouleplaceRepos: PoulePlaceRepository,
        private fieldRepos: FieldRepository,
        private refereeRepos: RefereeRepository,
    ) {

    }

    jsonArrayToObject(jsonArray: any, poule: Poule): Game[] {
        const objects: Game[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObjectHelper(json, poule);
            objects.push(object);
        }
        return objects;
    }

    jsonToObjectHelper(json: any, poule: Poule): Game {
        const game = new Game(
            poule,
            poule.getPlaces().find(pouleplaceIt => json.homePoulePlace.number === pouleplaceIt.getNumber()),
            poule.getPlaces().find(pouleplaceIt => json.awayPoulePlace.number === pouleplaceIt.getNumber()),
            json.roundNumber, json.subNumber
        );
        game.setId(json.id);
        game.setState(json.state);
        game.setField(this.fieldRepos.getObject(json.field.id));
        // game.setReferee( this.refereeRepos.jsonToObjectHelper( json.referee ) );
        game.setStartDateTime(new Date(json.startDateTime));
        return game;
    }

    objectsToJsonArray(objects: any[]): any[] {
        const jsonArray: any[] = [];
        for (const object of objects) {
            const json = this.objectToJsonHelper(object);
            jsonArray.push(json);
        }
        return jsonArray;
    }

    objectToJsonHelper(object: Game): any {
        const json = {
            'id': object.getId(),
            'homePoulePlace': this.pouleplaceRepos.objectToJsonHelper(object.getHomePoulePlace()),
            'awayPoulePlace': this.pouleplaceRepos.objectToJsonHelper(object.getAwayPoulePlace()),
            'roundNumber': object.getRoundNumber(),
            'subNumber': object.getSubNumber(),
            'startDateTime': object.getStartDateTime().toISOString(),
            'field': this.fieldRepos.objectToJsonHelper(object.getField()),
            'referee': object.getReferee() ? this.refereeRepos.objectToJsonHelper(object.getReferee()) : null,
            'state': object.getState()
        };
        return json;
    }
}
