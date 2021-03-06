
/* globals FILTER, Unit, app */

// eslint-disable-next-line no-unused-vars
class Mouse extends EventEmitter2 {

	constructor() {

		super();
		this.setMaxListeners( 0 );

		this.filter = FILTER.UNITS;
		this.intersection = null;

		this.interaction = [
            [ { filter: entity => entity instanceof Unit, callback: intersect => this.select( intersect ) } ],
            [ { filter: () => false } ],
            [ { filter: () => false } ]
		];

		document.addEventListener( "mousemove", e => this.onMouseMove( e ) );
		document.addEventListener( "mousedown", e => this.onMouseDown( e ) );
		document.addEventListener( "mouseup", e => this.onMouseUp( e ) );

	}

	onMouseMove( /* e */ ) {

        //Grab all objects the mouse intersects with
		const intersects = this.intersects;

		this.lastIntersects = intersects;

        // if (intersects.length > 0) console.log(intersects[0].point);

        //No intersection; we're in gray space
		if ( intersects.length === 0 ) {

            //If we had an intersection, alert hoverOff
			if ( this.lastIntersect )
				this.lastIntersect.object.entity.emit( "hoverOff", this.lastIntersect );

            //We have none now
			this.lastIntersect = null;

			return;

		}

        //Grab the top-most intersection that matches the primary button filter (0, left)
		const intersect = this.topIntersect( this.interaction[ 0 ] );

        //We have no top-most intersection that matches the primary button filter, so alert hoverOff
		if ( ! intersect ) {

			if ( this.lastIntersect )
				this.lastIntersect.object.entity.emit( "hoverOff", this.lastIntersect );

			this.lastIntersect = null;

			return;

		}

        //We had an intersection before...
		if ( this.lastIntersect ) {

            //New intersect
			if ( this.lastIntersect.object !== intersect.object )
				this.lastIntersect.object.entity.emit( "hoverOff", this.lastIntersect, intersect );

            //Old intersect
			else if ( this.lastIntersect.face !== intersect.face )
				this.lastIntersect.object.entity.emit( "hoverFace", this.lastIntersect, intersect );

            //Comment out because the hover event is unlikely to be used
			else
                this.lastIntersect.object.entity.emit( "hover", this.lastIntersect, intersect );

			this.lastIntersect = intersect;

			return;

		}

        //Alert hoverOn for new intersection
		intersect.object.entity.emit( "hoverOn", intersect );

		this.lastIntersect = intersect;

	}

	topIntersect( interaction, filterIndex ) {

        // console.log(interaction, interaction[]);

        //No specific sub-action, check all
		if ( typeof filterIndex === "undefined" ) {

			for ( let i = 0; i < this.lastIntersects.length; i ++ )
				for ( let n = 0; n < interaction.length; n ++ ) {

					if ( ! interaction[ n ].filter( this.lastIntersects[ i ].object.entity ) )
						continue;

					this.topIntersectFilter = n;

					return this.lastIntersects[ i ];

				}

			return null;

		}

        //Looking at a specific sub-action, check it
		for ( let i = 0; i < this.lastIntersects.length; i ++ ) {

			if ( ! interaction[ filterIndex ].filter( this.lastIntersects[ i ].object.entity ) )
				continue;

			this.topIntersectFilter = filterIndex;

			return this.lastIntersects[ i ];

		}

		return null;

	}

	onMouseDown( e ) {

		const intersect = this.topIntersect( this.interaction[ e.button ] );
		if ( intersect ) this.interaction[ e.button ][ this.topIntersectFilter ].callback( intersect );
		// else console.error( "Bad click!" );

	}

	select( intersect ) {

		this.selection = [ intersect.object.entity ];
		this.emit( "selection", this.selection );

	}

	onMouseUp( /* e */ ) {

	}

	get intersects() {

		return app.graphic.intersect();

	}

	get x() {

		const intersect = this.intersects[ 0 ];
		if ( intersect ) return intersect.point.x;
		return NaN;

	}

	get y() {

		const intersect = this.intersects[ 0 ];
		if ( intersect ) return intersect.point.y;
		return NaN;

	}

}
