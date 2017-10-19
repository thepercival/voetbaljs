/**
 * Created by coen on 3-3-17.
 */

import { Injectable } from '@angular/core';
import { Round } from '../round';
import { QualifyRule } from '../qualifyrule';
import { PoulePlaceRepository } from "../pouleplace/repository";

@Injectable()
export class QualifyRuleRepository {

    constructor( private poulePlaceRepos: PoulePlaceRepository ) {

    }

    jsonArrayToObject( jsonArray: any, round: Round, fromRound: Round = null ): QualifyRule[]
    {
        let objects: QualifyRule[] = [];
        for (let json of jsonArray) {
            let object = this.jsonToObjectHelper(json, round, fromRound);
            objects.push( object );
        }
        return objects;
    }

    jsonToObjectHelper( json : any, round: Round, fromRound: Round = null ): QualifyRule
    {
        let qualifyRule = new QualifyRule( fromRound, round );

        json.fromPoulePlaces.forEach( function( jsonFromPoulePlace ){
            const fromPoulePlace = this.getPoulePlaceByIdAndRound( jsonFromPoulePlace.id, fromRound );
            qualifyRule.addFromPoulePlace( fromPoulePlace );
        }, this);

        json.toPoulePlaces.forEach( function( jsonToPoulePlace ){
            const toPoulePlace = this.getPoulePlaceByIdAndRound( jsonToPoulePlace.id, round );
            qualifyRule.addToPoulePlace( toPoulePlace );
        }, this );
        return qualifyRule;
    }

    private getPoulePlaceByIdAndRound( poulePlaceId: number, round: Round ) {
        return round.getPoulePlaces().find( function( placeIt ) {
            return ( placeIt.getId() === this );
        }, poulePlaceId );
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

    objectToJsonHelper( object : QualifyRule ): any
    {
        let json = {
            'fromPoulePlaces': this.poulePlaceRepos.objectsToJsonArray( object.getFromPoulePlaces() ),
            'toPoulePlaces': this.poulePlaceRepos.objectsToJsonArray( object.getToPoulePlaces() )
        };
        return json;
    }
}