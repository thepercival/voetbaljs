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

    jsonToObjectHelper( json : any, round: Round ): RoundScoreConfig
    {
        let parent = null;
        if ( json.parent != null ) {
            parent = this.jsonToObjectHelper( json.parent, round );
        }
        let roundScoreConfig = new RoundScoreConfig( round, parent );
        roundScoreConfig.setId(json.id);
        roundScoreConfig.setName(json.name);
        roundScoreConfig.setDirection(json.direction);
        roundScoreConfig.setMaximum(json.maximum);
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
            "direction": object.getDirection(),
            "maximum": object.getMaximum(),
            "parent": object.getParent() != null ? this.objectToJsonHelper( object.getParent() ) : null
        };
        return json;
    }

    createObjectFromParent( round: Round ) {



        if( round.getParentRound() != null ) {

        }

        if( round.getCompetitionseason().getSport() === 'darten' ) {

                return new Round\ScoreConfig( $round, 'punten', Round\ScoreConfig::DOWNWARDS, 501,
                new Round\ScoreConfig( $round, 'legs', Round\ScoreConfig::UPWARDS, 2,
                new Round\ScoreConfig( $round, 'sets', Round\ScoreConfig::UPWARDS, 0)
            )

        }

        let scoreConfig = new RoundScoreConfig( round );
        scoreConfig.setName( 'punten' );
        scoreConfig.setDirection( RoundScoreConfig.UPWARDS );
        scoreConfig.setMaximum( 0 );
        return scoreConfig;
    }

    // public static function getDefaultRoundScoreConfig( Round $round )
    // {
    //     $sportName = $round->getCompetitionseason()->getSport();
    //     if ( $sportName === 'darten' ) {
    //     return new Round\ScoreConfig( $round, 'punten', Round\ScoreConfig::DOWNWARDS, 501,
    //     new Round\ScoreConfig( $round, 'legs', Round\ScoreConfig::UPWARDS, 2,
    //     new Round\ScoreConfig( $round, 'sets', Round\ScoreConfig::UPWARDS, 0)
    // )
    // );
    // }
    // else if ( $sportName === 'tafeltennis' ) {
    //     return new Round\ScoreConfig( $round, 'punten', Round\ScoreConfig::UPWARDS, 21,
    //         new Round\ScoreConfig( $round, 'sets', Round\ScoreConfig::UPWARDS, 0)
    // );
    // }
    // else if ( $sportName === 'voetbal' ) {
    //     return new Round\ScoreConfig( $round, 'goals', Round\ScoreConfig::UPWARDS, 0 );
    // }
    // return new Round\ScoreConfig( $round, "punten", Round\ScoreConfig::UPWARDS, 0 );
    // }
}
