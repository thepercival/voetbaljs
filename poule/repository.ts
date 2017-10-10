/**
 * Created by coen on 3-3-17.
 */

import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { PoulePlaceRepository } from '../pouleplace/repository';
import { Poule } from '../poule';
import { GameRepository } from '../game/repository';
import { VoetbalRepository } from '../repository';
import { Round } from '../round';

@Injectable()
export class PouleRepository extends VoetbalRepository{

    private url : string;
    private http: Http;

    constructor( http: Http, private pouleplaceRepos: PoulePlaceRepository, private gameRepos: GameRepository )
    {
        super();
        this.http = http;
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string
    {
        return 'poules';
    }

    jsonArrayToObject( jsonArray: any, round: Round ): Poule[]
    {
        let objects: Poule[] = [];
        for (let json of jsonArray) {
            let object = this.jsonToObjectHelper(json, round);
            objects.push( object );
        }
        return objects;
    }

    jsonToObjectHelper( json : any, round: Round ): Poule
    {
        let poule = new Poule(round, json.number);
        poule.setName(json.name);
        this.pouleplaceRepos.jsonArrayToObject( json.places, poule );
        this.gameRepos.jsonArrayToObject( json.games, poule );
        round.getPoules().push(poule);
        return poule;
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

    objectToJsonHelper( object : Poule ): any
    {
        let json = {
            "id":object.getId(),
            "number":object.getNumber(),
            "name":object.getName(),
            "places":this.pouleplaceRepos.objectsToJsonHelper(object.getPlaces())
        };
        return json;
    }

    // this could also be a private method of the component class
    handleError(res: Response): Observable<any> {
        console.error( res );
        // throw an application level error
        return Observable.throw( res.statusText );
    }
}
