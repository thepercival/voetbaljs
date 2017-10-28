/**
 * Created by coen on 20-3-17.
 */

import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Game } from '../game';
import { Poule } from '../poule';
import { PoulePlaceRepository } from '../pouleplace/repository';
import { FieldRepository } from '../field/repository';
import { RefereeRepository } from '../referee/repository';
import { VoetbalRepository } from '../repository';

@Injectable()
export class GameRepository extends VoetbalRepository{

    private url : string;

    constructor(
        private http: Http,
        private pouleplaceRepos: PoulePlaceRepository,
        private fieldRepos: FieldRepository,
        private refereeRepos: RefereeRepository,
    )
    {
        super();
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string
    {
        return 'games';
    }

    // getObjects( structureService: StructureService ): Observable<Game[]>
    // {
    //     let params: URLSearchParams = new URLSearchParams();
    //     params.set('competitionseasonid', structureService.getCompetitionseason().getId() );
    //     let requestOptions = new RequestOptions();
    //     requestOptions.headers = super.getHeaders();
    //     requestOptions.search = params;
    //
    //     let pouleplaces = structureService.getPoulePlaces();
    //
    //     // add competitionseasonid to url
    //     return this.http.get(this.url, requestOptions )
    //         .map((res) => this.jsonArrayToObject(res.json(), poule) )
    //         .catch( this.handleError );
    // }

    jsonArrayToObject( jsonArray: any, poule: Poule ): Game[]
    {
        let objects: Game[] = [];
        for (let json of jsonArray) {
            let object = this.jsonToObjectHelper(json,poule);
            objects.push( object );
        }
        return objects;
    }

    jsonToObjectHelper( json : any, poule: Poule ): Game
    {
        let game = new Game(
            poule.getPlaces().find( pouleplaceIt => json.homePoulePlaceNr == pouleplaceIt.getNumber() ),
            poule.getPlaces().find( pouleplaceIt => json.awayPoulePlaceNr == pouleplaceIt.getNumber() ),
            json.roundNumber, json.subNumber
        );
        console.log('game',json);
        game.setId(json.id);
        game.setState(json.state);
        game.setField( this.fieldRepos.getObject( json.field.id ) );
        // game.setReferee( this.refereeRepos.jsonToObjectHelper( json.referee ) );
        game.setStartDateTime( new Date(json.startDateTime) );
        poule.getGames().push(game);
        return game;
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

    objectToJsonHelper( object : Game ): any
    {
        let json = {
            "id":object.getId(),
            "homepouleplace":this.pouleplaceRepos.objectToJsonHelper(object.getHomePoulePlace()),
            "awaypouleplace":this.pouleplaceRepos.objectToJsonHelper(object.getAwayPoulePlace()),
            "roundNumber":object.getRoundNumber(),
            "subNumber":object.getSubNumber(),
            "startDateTime":object.getStartDateTime().toISOString(),
            "field":this.fieldRepos.objectToJsonHelper(object.getField()),
            "referee":this.refereeRepos.objectToJsonHelper(object.getReferee()),
            "state":object.getState()
        };
        return json;
    }

    createObject( jsonObject: any, poule: Poule ): Observable<Game>
    {
        return this.http
            .post(this.url, jsonObject, new RequestOptions({ headers: super.getHeaders() }))
            // ...and calling .json() on the response to return data
            .map((res) => this.jsonToObjectHelper(res.json(), poule))
            //...errors if any
            .catch(this.handleError);
    }

    removeObject( object: Game): Observable<void>
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