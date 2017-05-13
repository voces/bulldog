
function syncProperty( obj, property, details ) {

    // console.log("syncProperty", property, obj.constructor.name)

	let initialValue = typeof details.initialValue !== "undefined" ? details.initialValue : undefined,
		interpolate = typeof details.interpolate !== "undefined" ? details.interpolate : true,
		preprocessor = details.preprocessor,
		postprocessor = details.postprocessor,

		historyTimes = [ syncProperty.time ],
		historyValues = [],
		historyIsPrediction = [ false ],
		standingPredictions = [];

    //Process if a preprocessor exists
	if ( preprocessor ) historyValues.push( preprocessor( initialValue, obj ) );
	else historyValues.push( initialValue );

	Object.defineProperty( obj, property, {
		configurable: true,

		get: () => {

            //Start at the end
			let index = historyTimes.length - 1,
				value;

			// console.log( historyTimes, historyValues );

            //Linear search backwards (heavily biasing tail), ignore predictions if not in prediction mode
			while ( index > 0 && ( historyTimes[ index ] > syncProperty.time || ( ! syncProperty.prediction && historyIsPrediction[ index ] ) ) )
				index --;

            //Get the value (interpolate if neccessary)
			if ( interpolate && typeof historyValues[ index ] === "function" )
				value = historyValues[ index ]( syncProperty.time );
			else
                value = historyValues[ index ];

            // console.log(syncProperty.time, index, historyValues.length, value);

            //Process if a postprocessor exists
			if ( postprocessor ) return postprocessor( value, obj );

			return value;

		},

		set: value => {

            //Process if a preprocessor exists
			if ( preprocessor ) value = preprocessor( value, obj );

            //Clear predictions first
			if ( ! syncProperty.prediction && standingPredictions.length ) {

				for ( let i = 0; i < standingPredictions.length; i ++ ) {

					historyTimes.splice( standingPredictions[ i ], 1 );
					historyValues.splice( standingPredictions[ i ], 1 );
					historyIsPrediction.splice( standingPredictions[ i ], 1 );

				}

				standingPredictions = [];

			}

            //Start at the end
			let index = historyTimes.length - 1;

            //Linear search backwards (heavily biasing tail)
			while ( index > 0 && historyTimes[ index ] > syncProperty.time )
				index --;

            //Simply push if still at the end
			if ( index === historyTimes.length - 1 ) {

				historyTimes.push( syncProperty.time );
				historyValues.push( value );
				historyIsPrediction.push( syncProperty.prediction );
				return;

			}

            //Insert the new value into our arrays otherwise
			historyTimes.splice( index, 0, syncProperty.time );
			historyValues.splice( index, 0, value );
			historyIsPrediction.splice( index, 0, syncProperty.prediction );

		}
	} );

}

syncProperty.time = Date.now();
syncProperty.prediction = false;
