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

    jsonToObjectHelper( json : any, round: Round, parent: RoundScoreConfig ): RoundScoreConfig
    {
        let roundScoreConfig = new RoundScoreConfig( round, parent );
        roundScoreConfig.setId(json.id);
        roundScoreConfig.setName(json.name);
        roundScoreConfig.setStart(json.start);
        roundScoreConfig.setGoal(json.goal);
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
            "id": object.getId(),
            "name": object.getName(),
            "start": object.getStart(),
            "goal": object.getGoal(),
            "parent": object.getParent() != null ? this.objectToJsonHelper( object.getParent() ) : null
        };
        return json;
    }
}
