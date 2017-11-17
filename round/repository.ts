/**
 * Created by coen on 3-3-17.
 */

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Observer } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Competitionseason } from '../competitionseason';
import { PouleRepository } from '../poule/repository';
import { Round } from '../round';
import { CompetitionseasonRepository } from '../competitionseason/repository';
import { VoetbalRepository } from '../repository';
import { QualifyService } from '../qualifyrule/service';
import { RoundConfigRepository } from './config/repository';
import { RoundScoreConfigRepository } from './scoreconfig/repository';
import { QualifyRuleRepository } from '../qualifyrule/repository';

@Injectable()
export class RoundRepository {

    constructor(
        private configRepos: RoundConfigRepository,
        private scoreConfigRepos: RoundScoreConfigRepository,
        private pouleRepos: PouleRepository,
        private competitionseasonRepos: CompetitionseasonRepository,
        private qualifyRuleRepos: QualifyRuleRepository) {
    }

    jsonArrayToObject(jsonArray: any, competitionseason: Competitionseason, parentRound: Round = null): Round[] {
        const objects: Round[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObjectHelper(json, competitionseason, parentRound);
            objects.push(object);
        }
        return objects;
    }

    jsonToObjectHelper(json: any, competitionseason: Competitionseason, parentRound: Round = null): Round {
        const round = new Round(competitionseason, parentRound, json.winnersOrLosers);
        round.setId(json.id);
        round.setName(json.name);
        this.configRepos.jsonToObjectHelper(json.config, round);
        round.setScoreConfig(this.scoreConfigRepos.jsonToObjectHelper(json.scoreConfig, round));
        this.pouleRepos.jsonArrayToObject(json.poules, round);
        this.jsonArrayToObject(json.childRounds, competitionseason, round);
        if (parentRound != null) {
            const qualifyService = new QualifyService(round);
            qualifyService.createObjectsForParentRound();
        }
        return round;
    }

    objectsToJsonArray(objects: any[]): any[] {
        const jsonArray: any[] = [];
        for (const object of objects) {
            const json = this.objectToJsonHelper(object);
            jsonArray.push(json);
        }
        return jsonArray;
    }

    objectToJsonHelper(object: Round): any {
        const json = {
            'id': object.getId(),
            'number': object.getNumber(),
            'winnersOrLosers': object.getWinnersOrLosers(),
            'name': object.getName(),
            'config': this.configRepos.objectToJsonHelper(object.getConfig()),
            'scoreConfig': this.scoreConfigRepos.objectToJsonHelper(object.getScoreConfig()),
            'poules': this.pouleRepos.objectsToJsonArray(object.getPoules()),
            'childRounds': this.objectsToJsonArray(object.getChildRounds())
        };
        return json;
    }
}
