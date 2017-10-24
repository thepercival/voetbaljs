/**
 * Created by coen on 3-3-17.
 */

import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable, Observer } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Competitionseason } from '../competitionseason';
import { PouleRepository } from '../poule/repository';
import { Round } from '../round';
import { CompetitionseasonRepository } from '../competitionseason/repository';
import { VoetbalRepository } from '../repository';
import { QualifyService } from "../qualifyrule/service";
import { QualifyRuleRepository } from "../qualifyrule/repository";

@Injectable()
export class RoundRepository extends VoetbalRepository{

    private url : string;
    private structures : Round[] = [];

    constructor(
        private http: Http,
        private pouleRepos: PouleRepository,
        private competitionseasonRepos: CompetitionseasonRepository,
        private qualifyRuleRepos: QualifyRuleRepository)
    {
        super();
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string
    {
        return 'rounds';
    }

    getObject( competitionseason: Competitionseason ): Observable<Round>
    {
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

        let params: URLSearchParams = new URLSearchParams();
        params.set('competitionseasonid', competitionseason.getId() );
        const options = new RequestOptions( {
                headers: super.getHeaders(),
                params: params
            }
        );

        return this.http.get(this.url, options )
            .map( (res) => {
                const jsonRound = res.json().shift();
                console.log(jsonRound);
                const round = this.jsonToObjectHelper(jsonRound, competitionseason);
                this.structures.push( round );
                return round;
            })
            .catch( this.handleError );
    }

    jsonArrayToObject( jsonArray: any, competitionseason: Competitionseason, parentRound: Round = null ): Round[]
    {
        let objects: Round[] = [];
        for (let json of jsonArray) {
            let object = this.jsonToObjectHelper(json, competitionseason, parentRound);
            objects.push( object );
        }
        return objects;
    }

    jsonToObjectHelper( json : any, competitionseason: Competitionseason, parentRound: Round = null ): Round
    {
        let round = new Round(competitionseason, parentRound, json.winnersOrLosers);
        round.setId(json.id);
        round.setNrofheadtoheadmatches(json.nrofheadtoheadmatches);
        round.setName(json.name);
        this.pouleRepos.jsonArrayToObject( json.poules, round );
        this.jsonArrayToObject( json.childRounds, competitionseason, round );
        if ( parentRound != null ) {
            const qualifyService = new QualifyService( round );
            qualifyService.createObjectsForParentRound();
        }
        return round;
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

    objectToJsonHelper( object : Round ): any
    {
        let json = {
            "id":object.getId(),
            "number":object.getNumber(),
            "nrofheadtoheadmatches":object.getNrofheadtoheadmatches(),
            "name":object.getName(),
            "competitionseason":this.competitionseasonRepos.objectToJsonHelper(object.getCompetitionseason()),
            "poules":this.pouleRepos.objectsToJsonArray(object.getPoules())
        };
        return json;
    }

    createObject( jsonObject: any, competitionseason: Competitionseason ): Observable<Round>
    {
        return this.http
            .post(this.url, jsonObject, new RequestOptions({ headers: super.getHeaders() }))
            // ...and calling .json() on the response to return data
            .map((res) => this.jsonToObjectHelper(res.json(), competitionseason))
            //...errors if any
            .catch(this.handleError);
    }

    removeObject( object: Round): Observable<void>
    {
        let url = this.url + '/'+object.getId();
        return this.http
            .delete(url, new RequestOptions({ headers: super.getHeaders() }))
            // ...and calling .json() on the response to return data
            .map((res:Response) => {

            })
            //...errors if any
            .catch(this.handleError);
    }

    // this could also be a private method of the component class
    handleError(res: Response): Observable<any> {
        console.error( res );
        // throw an application level error
        return Observable.throw( res.statusText );
    }
}