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
export class RoundRepository extends VoetbalRepository {

    private url: string;
    private structures: Round[] = [];

    constructor(
        private http: HttpClient,
        private configRepos: RoundConfigRepository,
        private scoreConfigRepos: RoundScoreConfigRepository,
        private pouleRepos: PouleRepository,
        private competitionseasonRepos: CompetitionseasonRepository,
        private qualifyRuleRepos: QualifyRuleRepository) {
        super();
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'rounds';
    }

    getObject( competitionseason: Competitionseason ): Observable<Round> {
        const foundStructure = this.structures.find( function( structure ) {
            return structure.getCompetitionseason() === competitionseason;
        });
        if ( foundStructure != null ) {
            console.log('getStructureFromCache', foundStructure);
            return Observable.create( (observer: Observer<Round> ) => {
                observer.next(foundStructure);
                observer.complete();
            });
        }

        const options = {
            headers: super.getHeaders(),
            params: new HttpParams().set('competitionseasonid', competitionseason.getId())
        };

        return this.http.get<Array<Round>>(this.url, options )
            .map( (res) => {
                const jsonRound = res.shift();
                console.log(jsonRound);
                const round = this.jsonToObjectHelper(jsonRound, competitionseason);
                this.structures.push( round );
                return round;
            })
            .catch( this.handleError );
    }

    jsonArrayToObject( jsonArray: any, competitionseason: Competitionseason, parentRound: Round = null ): Round[] {
        const objects: Round[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObjectHelper(json, competitionseason, parentRound);
            objects.push( object );
        }
        return objects;
    }

    jsonToObjectHelper( json: any, competitionseason: Competitionseason, parentRound: Round = null ): Round {
        const round = new Round(competitionseason, parentRound, json.winnersOrLosers);
        round.setId(json.id);
        round.setName(json.name);
        this.configRepos.jsonToObjectHelper( json.config, round );
        round.setScoreConfig( this.scoreConfigRepos.jsonToObjectHelper( json.scoreConfig, round ) );
        this.pouleRepos.jsonArrayToObject( json.poules, round );
        this.jsonArrayToObject( json.childRounds, competitionseason, round );
        if ( parentRound != null ) {
            const qualifyService = new QualifyService( round );
            qualifyService.createObjectsForParentRound();
        }
        return round;
    }

    objectsToJsonArray( objects: any[] ): any[] {
        const jsonArray: any[] = [];
        for (const object of objects) {
            const json = this.objectToJsonHelper(object);
            jsonArray.push( json );
        }
        return jsonArray;
    }

    objectToJsonHelper( object: Round ): any {
        const json = {
            'id': object.getId(),
            'number': object.getNumber(),
            'name': object.getName(),
            'competitionseason': this.competitionseasonRepos.objectToJsonHelper(object.getCompetitionseason()),
            'config': this.configRepos.objectToJsonHelper(object.getConfig()),
            'scoreConfig': this.scoreConfigRepos.objectToJsonHelper(object.getScoreConfig()),
            'poules': this.pouleRepos.objectsToJsonArray(object.getPoules())
        };
        return json;
    }

    createObject( jsonObject: any, competitionseason: Competitionseason ): Observable<Round> {
        return this.http
            .post(this.url, jsonObject, { headers: super.getHeaders() } )
            // ...and calling .json() on the response to return data
            .map((res) => this.jsonToObjectHelper(res, competitionseason))
            .catch(this.handleError);
    }

    removeObject( object: Round): Observable<void> {
        const url = this.url + '/' + object.getId();
        return this.http
            .delete(url, { headers: super.getHeaders() })
            // ...and calling .json() on the response to return data
            .map((res: Response) => {

            })
            .catch(this.handleError);
    }

    // this could also be a private method of the component class
    handleError(res: Response): Observable<any> {
        console.error( res );
        // throw an application level error
        return Observable.throw( res.statusText );
    }
}
