/**
 * Created by coen on 3-3-17.
 */

import { Injectable } from '@angular/core';
import { RoundConfig } from '../config';
import { Round } from '../../round';

@Injectable()
export class RoundConfigRepository {

    constructor() {

    }

    jsonArrayToObject( jsonArray: any, round: Round ): RoundConfig[]
    {
        let objects: RoundConfig[] = [];
        for (let json of jsonArray) {
            let object = this.jsonToObjectHelper(json, round);
            objects.push( object );
        }
        return objects;
    }

    jsonToObjectHelper( json : any, round: Round ): RoundConfig
    {
        let roundConfig = new RoundConfig( round );
        roundConfig.setId(json.id);
        roundConfig.setNrOfHeadtoheadMatches(json.nrOfHeadtoheadMatches);
        roundConfig.setQualifyRule(json.qualifyRule);
        roundConfig.setWinPoints(json.winPoints);
        roundConfig.setDrawPoints(json.drawPoints);
        roundConfig.setHasExtension(json.hasExtension);
        roundConfig.setWinPointsExt(json.winPointsExt);
        roundConfig.setDrawPointsExt(json.drawPointsExt);
        roundConfig.setMinutesPerGameExt(json.minutesPerGameExt);
        roundConfig.setEnableTime(json.enableTime);
        roundConfig.setMinutesPerGame(json.minutesPerGame);
        roundConfig.setMinutesInBetween(json.minutesInBetween);
        return roundConfig;
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

    objectToJsonHelper( object : RoundConfig ): any
    {
        let json = {
            "id": object.getId(),
            "nrOfHeadtoheadMatches": object.getNrOfHeadtoheadMatches(),
            "qualifyRule": object.getQualifyRule(),
            "winPoints": object.getWinPoints(),
            "drawPoints": object.getDrawPoints(),
            "hasExtension": object.getHasExtension(),
            "winPointsExt": object.getWinPointsExt(),
            "drawPointsExt": object.getDrawPointsExt(),
            "minutesPerGameExt": object.getMinutesPerGameExt(),
            "enableTime": object.getEnableTime(),
            "minutesPerGame": object.getMinutesPerGame(),
            "mMinutesInBetween": object.getMinutesInBetween()
        };
        return json;
    }
}
