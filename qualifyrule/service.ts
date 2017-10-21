/**
 * Created by coen on 18-10-17.
 */

 import { Injectable } from '@angular/core';
 import { Competitionseason } from '../competitionseason';
 import { Round } from '../round';
 import { Poule } from '../poule';
 import { PoulePlace } from '../pouleplace';
 import { Game } from '../game';
 import { QualifyRule } from '../qualifyrule';

 export class QualifyService {
   private parentRound: Round;

   constructor( private childRound: Round ) {
    this.parentRound = childRound.getParentRound();
   }

   createObjectsForParentRound() {
     const poulePlacesPerNumberParentRound = this.parentRound.getPoulePlacesPerNumber( this.childRound.getWinnersOrLosers() );
     const orderedByPlace = true;
     let poulePlacesOrderedByPlaceChildRound = this.childRound.getPoulePlaces( orderedByPlace );

     while ( poulePlacesOrderedByPlaceChildRound.length > 0 ) {
       if ( this.childRound.getWinnersOrLosers() === Round.LOSERS) {
            poulePlacesOrderedByPlaceChildRound.reverse();
       }
       let qualifyRule = new QualifyRule( this.parentRound, this.childRound );
       // from places
       let poulePlaces = null;
       {
         // if ( this.childRound.getWinnersOrLosers() === Round.WINNERS) {
           poulePlaces = poulePlacesPerNumberParentRound.shift();
         // }
         // else {
         //   poulePlaces = poulePlacesPerNumberParentRound.pop();
         // }
         poulePlaces.forEach(function (poulePlaceIt) {
           qualifyRule.addFromPoulePlace(poulePlaceIt);
         });
       }

       // to places
       for( let nI = 0 ; nI < poulePlaces.length ; nI++ ) {
         if( poulePlacesOrderedByPlaceChildRound.length === 0 ) {
           break;
         }
         let toPoulePlace = null;
         // if ( this.childRound.getWinnersOrLosers() === Round.WINNERS ) {
           toPoulePlace = poulePlacesOrderedByPlaceChildRound.shift();
         // }
         // else {
           // toPoulePlace = poulePlacesOrderedByPlaceChildRound.pop();
         // }
         qualifyRule.addToPoulePlace( toPoulePlace );
       }
     }
   };

   removeObjectsForParentRound() {
       let fromQualifyRules = this.childRound.getFromQualifyRules().slice();
       fromQualifyRules.forEach( function( qualifyRuleIt ) {
           while ( qualifyRuleIt.getFromPoulePlaces().length > 0 ) {
               qualifyRuleIt.removeFromPoulePlace();
           }
           while ( qualifyRuleIt.getToPoulePlaces().length > 0 ) {
               qualifyRuleIt.removeToPoulePlace();
           }
           qualifyRuleIt.setFromRound( null );
           qualifyRuleIt.setToRound( null );
       });
       fromQualifyRules = null;
   }

   oneMultipleToSingle() {
       let fromQualifyRules = this.parentRound.getToQualifyRules();
       let multiples = fromQualifyRules.filter( function( qualifyRuleIt ) {
           return qualifyRuleIt.isMultiple();
       });
       if ( multiples.length !== 1 ) {
           return;
       }

       let multiple = multiples.pop();
       console.log(multiple.getWinnersOrLosers(), multiple);
       let multipleFromPlaces = multiple.getFromPoulePlaces().slice();
       while( multiple.getFromPoulePlaces().length > 1 ) {
           multiple.removeFromPoulePlace( multipleFromPlaces.pop() );
       }
   }

  // getActiveQualifyRules( winnersOrLosers: number ): QualifyRule[] {
      // let qualifyRules: QualifyRule[] = [];
      // const poulePlacesByNumber = this.round.getPoulePlaces( true );
      // if( winnersOrLosers === Round.WINNERS ){
      //  while
      //
      //  poulePlacesByNumber.forEach( (poulePlaceIt) => )
      // }
      // return qualifyRules;
     // }

     getActivePoulePlaceNumber( winnersOrLosers: number ) {
      // als winners dan
     }

     // 1 ( removing qualifier & adding/removing poule,  poule ) : rearrange qualifyrules over active-placenumber-line
     // 2 ( adding qualifier ) : determine new active-placenumber-line and do 1


     /*addQualifier( fromRound: Round ) {
         let toRound = this.getNextRound(fromRound);
         console.log(toRound);
         if (toRound == null) {
             toRound = this.addRound();
         }
         // determine if new qualifiationrule is needed


         const fromQualifyRules = toRound.getFromQualifyRules();
         const lastFromQualifyRule = fromQualifyRules[fromQualifyRules.length - 1];
         if( lastFromQualifyRule != null && lastFromQualifyRule.isMultiple() ) {
             if( ( lastFromQualifyRule.getFromPoulePlaces().length - 1 ) < lastFromQualifyRule.getToPoulePlaces().length ) { // edit lastFromQualifyRule

             }
             if( ( lastFromQualifyRule.getFromPoulePlaces().length - 1 ) === lastFromQualifyRule.getToPoulePlaces().length ) {  // remove and add multiple

             }
         }

         const fromPoules = fromRound.getPoules();
         if ( fromPoules.length > 1 ) { // new multiple

         }
         else { // new single
             const fromPoule = fromPoules[0];
             const fromPlace = fromPoule.getPlaces().find( function( pouleplaceIt ) {
                 return this == pouleplaceIt.getNumber()
             }, toRound.getFromQualifyRules().length + 1 );
             if ( fromPlace == null ) { return; }

             const toPoules = toRound.getPoules();
             const toPoule = toPoules[0];
             let toPlace = null;
             if( lastFromQualifyRule == null ) { // just get first
                 toPlace = toPoule.getPlaces()[0];
             }
             else { // determine which toPoule and toPlace

             }
             if ( toPlace == null ) { return; }

             let qualifyRule = new QualifyRule( fromRound, toRound );
             qualifyRule.addFromPoulePlace( fromPlace );
             qualifyRule.addToPoulePlace( toPlace );
         }
     }*/
 }
