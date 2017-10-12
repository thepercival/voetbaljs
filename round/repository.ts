/**
 * Created by coen on 3-3-17.
 */

import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions, URLSearchParams } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Competitionseason } from '../competitionseason';
import { PouleRepository } from '../poule/repository';
import { Round } from '../round';
import { CompetitionseasonRepository } from '../competitionseason/repository';
import { VoetbalRepository } from '../repository';

@Injectable()
export class RoundRepository extends VoetbalRepository{

    private url : string;

    constructor(
        private http: Http,
        private pouleRepos: PouleRepository,
        private competitionseasonRepos: CompetitionseasonRepository )
    {
        super();
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string
    {
        return 'rounds';
    }

    getObjects( competitionseason: Competitionseason ): Observable<Round[]>
    {
        let params: URLSearchParams = new URLSearchParams();
        params.set('competitionseasonid', competitionseason.getId() );
        const options = new RequestOptions( {
                headers: super.getHeaders(),
                params: params
            }
        );

        return this.http.get(this.url, options )
            .map((res) => this.jsonArrayToObject(res.json(), competitionseason))
            .catch( this.handleError );
    }

    jsonArrayToObject( jsonArray: any, competitionseason: Competitionseason ): Round[]
    {
        console.log('rounds',jsonArray);
        let objects: Round[] = [];
        for (let json of jsonArray) {
            let object = this.jsonToObjectHelper(json, competitionseason);
            objects.push( object );
        }
        return objects;
    }

    jsonToObjectHelper( json : any, competitionseason: Competitionseason ): Round
    {
        let round = new Round(competitionseason, json.number);
        round.setId(json.id);
        round.setNrofheadtoheadmatches(json.nrofheadtoheadmatches);
        round.setName(json.name);
        this.pouleRepos.jsonArrayToObject( json.poules, round );
        return round;
    }

    objectsToJsonHelper( objects: any[] ): any[]
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
            "poules":this.pouleRepos.objectsToJsonHelper(object.getPoules())
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