/**
 * Created by coen on 3-3-17.
 */

import { RoundScoreConfig } from '../scoreconfig';
import { Round } from '../../round';

export class RoundScoreConfigRepository {

    constructor() {

    }

    jsonToObjectHelper(json: any, round: Round): RoundScoreConfig {
        let parent = null;
        if (json.parent != null) {
            parent = this.jsonToObjectHelper(json.parent, round);
        }
        const roundScoreConfig = new RoundScoreConfig(round, parent);
        roundScoreConfig.setId(json.id);
        roundScoreConfig.setName(json.name);
        roundScoreConfig.setDirection(json.direction);
        roundScoreConfig.setMaximum(json.maximum);
        return roundScoreConfig;
    }

    objectsToJsonArray(objects: any[]): any[] {
        const jsonArray: any[] = [];
        for (const object of objects) {
            const json = this.objectToJsonHelper(object);
            jsonArray.push(json);
        }
        return jsonArray;
    }

    objectToJsonHelper(object: RoundScoreConfig): any {
        const json = {
            'id': object.getId(),
            'name': object.getName(),
            'direction': object.getDirection(),
            'maximum': object.getMaximum(),
            'parent': object.getParent() != null ? this.objectToJsonHelper(object.getParent()) : null
        };
        return json;
    }

    createObjectFromParent(round: Round): RoundScoreConfig {

        let json = null;
        if (round.getParentRound() != null) {
            json = this.objectToJsonHelper(round.getParentRound().getScoreConfig());
        } else if (round.getCompetitionseason().getSport() === 'darten') {
            json = {
                id: null,
                name: 'punten',
                direction: RoundScoreConfig.DOWNWARDS,
                maximum: 501,
                parent: {
                    id: null,
                    name: 'legs',
                    direction: RoundScoreConfig.UPWARDS,
                    maximum: 2,
                    parent: {
                        id: null,
                        name: 'sets',
                        direction: RoundScoreConfig.UPWARDS,
                        maximum: 0,
                        parent: null
                    }
                }
            };
        } else if (round.getCompetitionseason().getSport() === 'tafeltennis') {
            json = {
                id: null,
                name: 'punten',
                direction: RoundScoreConfig.UPWARDS,
                maximum: 21,
                parent: {
                    id: null,
                    name: 'sets',
                    direction: RoundScoreConfig.UPWARDS,
                    maximum: 0,
                    parent: null
                }
            };
        } else if (round.getCompetitionseason().getSport() === 'voetbal') {
            json = {
                id: null,
                name: 'goals',
                direction: RoundScoreConfig.UPWARDS,
                maximum: 0,
                parent: null
            };
        } else {
            json = {
                id: null,
                name: 'punten',
                direction: RoundScoreConfig.UPWARDS,
                maximum: 0,
                parent: null
            };
        }
        return this.jsonToObjectHelper(json, round);
    }
}
