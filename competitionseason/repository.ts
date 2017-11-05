/**
 * Created by coen on 16-2-17.
 */

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Competitionseason } from '../competitionseason';
import { AssociationRepository } from '../association/repository';
import { CompetitionRepository } from '../competition/repository';
import { SeasonRepository } from '../season/repository';
import { VoetbalRepository } from '../repository';
import { FieldRepository } from '../field/repository';

@Injectable()
export class CompetitionseasonRepository extends VoetbalRepository{

    private url : string;
    private objects: Competitionseason[];

    constructor( private http: HttpClient,
         private associationRepository: AssociationRepository,
         private competitionRepository: CompetitionRepository,
         private seasonRepository: SeasonRepository,
         private fieldRepository: FieldRepository
    )
    {
        super();
        this.http = http;
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string
    {
        return 'competitionseasons';
    }

    getObjects(): Observable<Competitionseason[]>
    {
        if ( this.objects != null ){
            return Observable.create(observer => {
                observer.next(this.objects);
                observer.complete();
            });
        }

        return this.http.get(this.url, { headers: super.getHeaders() } )
            .map((res) => {
                let objects = this.jsonArrayToObject(res);
                this.objects = objects;
                return this.objects;
            })
            .catch( this.handleError );
    }

    jsonArrayToObject( jsonArray : any ): Competitionseason[]
    {
        let competitionseasons: Competitionseason[] = [];
        for (let json of jsonArray) {
            let object = this.jsonToObjectHelper(json);
            competitionseasons.push( object );
        }
        return competitionseasons;
    }

    getObject( id: number): Observable<Competitionseason>
    {
        console.log('id',id);
        let observable = Observable.create(observer => {
            this.getObjects().subscribe(
                /* happy path */ competitionseasons => {
                    let competitionseason = competitionseasons.filter(
                        competitionseasonsIt => competitionseasonsIt.getId() == id
                    ).shift();
                    observer.next(competitionseason);
                    observer.complete();
                },
                /* error path */ e => { this.handleError(e) },
                /* onComplete */ () => { }
            );
        });
        return observable;
    }

    jsonToObjectHelper( json : any ): Competitionseason
    {
        if ( this.objects != null ){
            let foundObjects = this.objects.filter(
                objectIt => objectIt.getId() == json.id
            );
            if ( foundObjects.length == 1) {
                return foundObjects.shift();
            }
        }

        let association = this.associationRepository.jsonToObjectHelper(json.association);
        let competition = this.competitionRepository.jsonToObjectHelper(json.competition);
        let season = this.seasonRepository.jsonToObjectHelper(json.season);

        let competitionseason = new Competitionseason(association, competition, season);
        competitionseason.setId(json.id);
        competitionseason.setState(json.state);
        competitionseason.setSport(json.sport);
        competitionseason.setStartDateTime( new Date( json.startDateTime ) );
        this.fieldRepository.jsonArrayToObject( json.fields, competitionseason );
        return competitionseason;
    }

    objectToJsonHelper( object : Competitionseason ): any
    {
        let json = {
            "id":object.getId(),
            "association":this.associationRepository.objectToJsonHelper(object.getAssociation()),
            "competition":this.competitionRepository.objectToJsonHelper(object.getCompetition()),
            "season":this.seasonRepository.objectToJsonHelper(object.getSeason()),
            "sport":object.getSport(),
            "startDateTime":object.getStartDateTime().toISOString(),
            "state":object.getState()
        };
        return json;
    }

    createObject( jsonObject: any ): Observable<Competitionseason>
    {
        return this.http
            .post(this.url, jsonObject, { headers: super.getHeaders() })
            // ...and calling .json() on the response to return data
            .map((res) => this.jsonToObjectHelper(res))
            //...errors if any
            .catch(this.handleError);
    }

    editObject( object: Competitionseason ): Observable<Competitionseason>
    {
        let url = this.url + '/'+object.getId();

        return this.http
            .put(url, JSON.stringify( object ), { headers: super.getHeaders() })
            // ...and calling .json() on the response to return data
            .map((res) => { console.log(res); return this.jsonToObjectHelper(res); })
            //...errors if any
            .catch(this.handleError);
    }

    removeObject( object: Competitionseason): Observable<void>
    {
        let url = this.url + '/'+object.getId();
        return this.http
            .delete(url, { headers: super.getHeaders() })
            // ...and calling .json() on the response to return data
            .map((res:Response) => res)
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

