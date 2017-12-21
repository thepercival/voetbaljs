/**
 * Created by coen on 20-3-17.
 */
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';

import { FieldRepository, IField } from '../field/repository';
import { Game } from '../game';
import { Poule } from '../poule';
import { IPoulePlace, PoulePlaceRepository } from '../pouleplace/repository';
import { IReferee, RefereeRepository } from '../referee/repository';


@Injectable()
export class GameRepository {

    constructor(
        private pouleplaceRepos: PoulePlaceRepository,
        private fieldRepos: FieldRepository,
        private refereeRepos: RefereeRepository,
    ) {
    }

    jsonArrayToObject(jsonArray: IGame[], poule: Poule): Game[] {
        const objects: Game[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObjectHelper(json, poule);
            objects.push(object);
        }
        return objects;
    }

    jsonToObjectHelper(json: IGame, poule: Poule): Game {
        const game = new Game(
            poule,
            poule.getPlaces().find(pouleplaceIt => json.homePoulePlace.number === pouleplaceIt.getNumber()),
            poule.getPlaces().find(pouleplaceIt => json.awayPoulePlace.number === pouleplaceIt.getNumber()),
            json.roundNumber, json.subNumber
        );
        game.setId(json.id);
        game.setState(json.state);
        game.setField(poule.getCompetitionseason().getFieldByNumber(json.field.number));
        if (json.referee !== undefined) {
            game.setReferee(poule.getCompetitionseason().getRefereeByNumber(json.referee.number));
        }
        if (json.startDateTime !== undefined) {
            game.setStartDateTime(new Date(json.startDateTime));
        }
        return game;
    }

    objectsToJsonArray(objects: Game[]): IGame[] {
        const jsonArray: IGame[] = [];
        for (const object of objects) {
            const json = this.objectToJsonHelper(object);
            jsonArray.push(json);
        }
        return jsonArray;
    }

    objectToJsonHelper(object: Game): IGame {
        return {
            id: object.getId(),
            homePoulePlace: this.pouleplaceRepos.objectToJsonHelper(object.getHomePoulePlace()),
            awayPoulePlace: this.pouleplaceRepos.objectToJsonHelper(object.getAwayPoulePlace()),
            roundNumber: object.getRoundNumber(),
            subNumber: object.getSubNumber(),
            field: this.fieldRepos.objectToJsonHelper(object.getField()),
            state: object.getState(),
            referee: object.getReferee() ? this.refereeRepos.objectToJsonHelper(object.getReferee()) : undefined,
            startDateTime: object.getStartDateTime() ? object.getStartDateTime().toISOString() : undefined
        };
    }
}

export interface IGame {
    id?: number;
    homePoulePlace: IPoulePlace;
    awayPoulePlace: IPoulePlace;
    roundNumber: number;
    subNumber: number;
    field: IField;
    state: number;
    startDateTime?: string;
    referee?: IReferee;
}
