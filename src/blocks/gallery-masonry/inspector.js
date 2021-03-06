/**
 * Internal dependencies
 */
import { title } from './'
import ResponsiveTabsControl from '../../components/responsive-tabs-control';
import linkOptions from '../../components/block-gallery/options/link-options';
import captionOptions from '../../components/block-gallery/options/caption-options';
import SizeControl from '../../components/size-control';
import { BackgroundPanel } from '../../components/background';

/**
 * WordPress dependencies
 */
const { __, sprintf } = wp.i18n;
const { Component, Fragment } = wp.element;
const { InspectorControls, PanelColorSettings } = wp.editor;
const { PanelBody, RangeControl, ToggleControl, SelectControl } = wp.components;

/**
 * Inspector controls
 */
class Inspector extends Component {

	constructor( props ) {
		super( ...arguments );
		this.setSizeControl = this.setSizeControl.bind( this );
		this.setLinkTo = this.setLinkTo.bind( this );
		this.setRadiusTo = this.setRadiusTo.bind( this );
		this.setCaptionStyleTo = this.setCaptionStyleTo.bind( this );
		this.getColors = this.getColors.bind( this );
	}

	componentDidUpdate( prevProps ) {
		if ( this.props.attributes.gutter <= 0 ) {
			this.props.setAttributes( {
				radius: 0,
			} );
		}
	}

	setLinkTo( value ) {
		this.props.setAttributes( { linkTo: value } );
	}

	setRadiusTo( value ) {
		this.props.setAttributes( { radius: value } );
	}

	setSizeControl( value ) {
		this.props.setAttributes( { gridSize: value } );
	}

	setCaptionStyleTo( value ) {
		this.props.setAttributes( { captionStyle: value } );
	}

	getCaptionsHelp( checked ) {
		return checked ? __( 'Showing captions for each media item.' ) : __( 'Toggle to show media captions.' );
	}

	getColors() {

		const {
			attributes,
			backgroundColor,
			captionColor,
			setBackgroundColor,
			setCaptionColor,
		} = this.props;

		const {
			backgroundImg,
			backgroundPadding,
			backgroundPaddingMobile,
			captions,
		} = attributes;

		const background = [
			{
				value: backgroundColor.color,
				onChange: ( nextBackgroundColor ) => {

					setBackgroundColor( nextBackgroundColor );

					// Add default padding, if they are not yet present.
					if ( ! backgroundPadding && ! backgroundPaddingMobile  ) {
						this.props.setAttributes( {
							backgroundPadding: 30,
							backgroundPaddingMobile: 30,
						} );
					}

					// Reset when cleared.
					if ( ! nextBackgroundColor && ! backgroundImg ) {
						this.props.setAttributes( {
							backgroundPadding: 0,
							backgroundPaddingMobile: 0,
						} );
					}
				},
				label: __( 'Background Color' ),
			},
		];

		const caption = [
			{
				value: captionColor.color,
				onChange: setCaptionColor,
				label: __( 'Caption Color' ),
			},
		];

		if ( captions ) {
			return background.concat( caption );
		} else {
			return background;
		}
	}

	render() {

		const {
			attributes,
			setAttributes,
			isSelected,
		} = this.props;

		const {
			captions,
			captionStyle,
			gridSize,
			gutter,
			images,
			lightbox,
			linkTo,
			radius,
		} = attributes;

		return (
			<InspectorControls>
				<PanelBody title={ sprintf( __( '%s Settings' ), title ) }>
					<SizeControl { ...this.props }
						type={ 'grid' }
						label={ __( 'Column Size' ) }
						onChange={ this.setSizeControl }
						value={ gridSize }
						resetValue={ 'xlrg' }
					/>
					<ResponsiveTabsControl { ...this.props }/>
					{ gutter > 0 && <RangeControl
						label={ __( 'Rounded Corners' ) }
						aria-label={ __( 'Add rounded corners to the gallery items.' ) }
						value={ radius }
						onChange={ this.setRadiusTo }
						min={ 0 }
						max={ 20 }
						step={ 1 }
					/> }
					<ToggleControl
						label={ __( 'Captions' ) }
						checked={ !! captions }
						onChange={ () => setAttributes( {  captions: ! captions } ) }
						help={ this.getCaptionsHelp }
					/>
					{ captions &&
						<SelectControl
							label={ __( 'Caption Style' ) }
							value={ captionStyle }
							onChange={ this.setCaptionStyleTo }
							options={ captionOptions }
						/>
					}
				</PanelBody>
				{ ! lightbox && <PanelBody
					title={ __( 'Link Settings' ) }
					initialOpen={ false }
					>
					<SelectControl
						label={ __( 'Link To' ) }
						value={ linkTo }
						options={ linkOptions }
						onChange={ this.setLinkTo }
					/>
				</PanelBody> }
				<BackgroundPanel { ...this.props }
 					hasCaption={ true }
 					hasOverlay={ true }
 					hasGalleryControls={ true }
 				/>
 				<PanelColorSettings
					title={ __( 'Color Settings' ) }
					initialOpen={ false }
					colorSettings={ this.getColors() }
				/>
			</InspectorControls>
		)
	}
};

export default Inspector;
