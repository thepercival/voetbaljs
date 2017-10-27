/**
 * Created by coen on 3-3-17.
 */

import { Injectable } from '@angular/core';
import { RoundScoreConfig } from '../scoreconfig';
import { Round } from '../../round';

@Injectable()
export class RoundScoreConfigRepository {

    constructor() {

    }

    jsonArrayToObject( jsonArray: any, round: Round ): RoundScoreConfig[]
    {
        let objects: RoundScoreConfig[] = [];
        for (let json of jsonArray) {
            let object = this.jsonToObjectHelper(json, round);
            objects.push( object );
        }
        return objects;
    }

    jsonToObjectHelper( json : any, round: Round ): RoundScoreConfig
    {
        let roundScoreConfig = new RoundScoreConfig( round );
        roundScoreConfig.setId(json.id);
        // roundConfig.setHasExtraTime(json.hasExtraTime);
        // roundConfig.setNrOfMinutesPerGame(json.nrOfMinutesPerGame);
        // roundConfig.setNrOfMinutesExtraTime(json.nrOfMinutesExtraTime);
        // roundConfig.setNrOfMinutesInBetween(json.nrOfMinutesInBetween);
        return roundScoreConfig;
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

    objectToJsonHelper( object : RoundScoreConfig ): any
    {
        let json = {
            "id": object.getId()//,
            // "nrofheadtoheadmatches": object.getNrofheadtoheadmatches(),
            // "qualifyRule": object.getQualifyRule(),
            // "winPointsPerGame": object.getWinPointsPerGame(),
            // "winPointsExtraTime": object.getWinPointsExtraTime(),
            // "hasExtraTime": object.getHasExtraTime(),
            // "nrOfMinutesPerGame": object.getNrOfMinutesPerGame(),
            // "nrOfMinutesExtraTime": object.getNrOfMinutesExtraTime(),
            // "nrOfMinutesInBetween": object.getNrOfMinutesInBetween()
        };
        return json;
    }
}
